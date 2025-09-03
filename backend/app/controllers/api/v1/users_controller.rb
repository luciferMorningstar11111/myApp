class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user! 
  before_action :set_user, only: [:show, :followers, :following, :follow, :unfollow]

def index
  users = User.where.not(id: current_user.id)
  render json: users.map { |user|
    user.as_json(only: [:id, :name, :email]).merge(
      is_following: current_user.following.exists?(user.id),
      followers: user.followers.map { |f| { id: f.id, name: f.name } },
      following: user.following.map { |f| { id: f.id, name: f.name } },
      following_count: user.following.count,                           # ✅ comma added
      current_user_id: current_user.id
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

  private

  def set_user
    @user = User.find(params[:id])
  end
end
