class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user! 
  before_action :set_user, only: [:show, :followers, :following, :follow, :unfollow]

def index
  users = User.where.not(id: current_user.id)

  if params[:q].present?
    search_term = "%#{params[:q]}%"
    users = users.where("name LIKE ? OR email LIKE ?", search_term, search_term)
  end

  render json: users.map { |user|
    # Find the block record if it exists
    block = current_user.blocks.find_by(blocked_id: user.id)

    user.as_json(only: [:id, :name, :email]).merge(
      is_following: current_user.following.exists?(user.id),
      followers: user.followers.map { |f| { id: f.id, name: f.name } },
      following: user.following.map { |f| { id: f.id, name: f.name } },
      following_count: user.following.count,
      current_user_id: current_user.id,
      is_blocked: block.present?,  # ✅ true if user is blocked
      block_id: block&.id          # ✅ needed for unblock API
    )
  }
end

 
  def show
    user=User.find(params[:id])
    render json: user
  end

  def followers
    render json: @user.followers
  end

  def following
    render json: @user.following
  end

def follow
  follow = current_user.active_follows.find_by(followed_id: @user.id)

  if follow
    follow.destroy
    render json: { message: "You unfollowed #{@user.name}" }, status: :ok
  else
    current_user.active_follows.create(followed_id: @user.id)
    render json: { message: "You are now following #{@user.name}" }, status: :ok
  end
end

  def unfollow
    follow = current_user.active_follows.find_by(followed_id: @user.id)
    follow.destroy if follow
    render json: { message: "You unfollowed #{@user.name}" }
  end

  def my_profile

    render json: {current_user: current_user, followers: current_user.followers, following: current_user.following}
  end

  def update
    if current_user.update(user_params)
      render json: current_user
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity 
    end
  end


  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email, :is_public)
  end
end
