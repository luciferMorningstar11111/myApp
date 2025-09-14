class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: %i[show followers following follow unfollow]

  def index
    users = User.where.not(id: current_user.id)

    if params[:q].present?
      search_term = "%#{params[:q]}%"
      users = users.where('name LIKE ? OR email LIKE ?', search_term, search_term)
    end

    render json: users.map { |user|
      block = current_user.blocks.find_by(blocked_id: user.id)

      # 🔑 Use sender_id / receiver_id (NOT follower_id/followed_id)
      follow_request = FollowRequest.find_by(sender_id: current_user.id, receiver_id: user.id)

      user.as_json(only: %i[id name email is_public]).merge(
        is_following: current_user.following.exists?(user.id),
        request_status: follow_request&.status, # 👈 pending / accepted / rejected
        followers: user.followers.map { |f| { id: f.id, name: f.name } },
        following: user.following.map { |f| { id: f.id, name: f.name } },
        following_count: user.following.count,
        current_user_id: current_user.id,
        is_blocked: block.present?,
        block_id: block&.id
      )
    }
  end

  def show
    render json: @user
  end

  def followers
    render json: @user.followers
  end

  def following
    render json: @user.following
  end

  def follow
    if @user.is_public
      # Public account → directly follow/unfollow
      follow = current_user.active_follows.find_by(followed_id: @user.id)

      if follow
        follow.destroy
        render json: { message: "You unfollowed #{@user.name}" }, status: :ok
      else
        current_user.active_follows.create(followed_id: @user.id)
        render json: { message: "You are now following #{@user.name}" }, status: :ok
      end
    else
      # Private account → send follow request
      request = FollowRequest.find_or_create_by(sender_id: current_user.id, receiver_id: @user.id)
      request.update(status: 'pending') unless request.status.present?
      render json: { message: "Follow request sent to #{@user.name}", request: request }, status: :ok
    end
  end

  def unfollow
    follow = current_user.active_follows.find_by(followed_id: @user.id)
    follow.destroy if follow

    # Also handle accepted follow requests for private users
    request = FollowRequest.find_by(sender_id: current_user.id, receiver_id: @user.id)
    request.destroy if request&.status == 'accepted'

    render json: { message: "You unfollowed #{@user.name}" }
  end

  def my_profile
    user = current_user
    render json: {
      current_user: user,
      followers: user.followers,
      following: user.following,
      blocked_users: user.blocked_users.select('users.*, blocks.id as block_id'),
      incoming_requests: FollowRequest.where(receiver_id: user.id, status: 'pending'),
      outgoing_requests: FollowRequest.where(sender_id: user.id, status: 'pending'),
      follow_requests_count: FollowRequest.where(receiver_id: user.id, status: 'pending').count
    }
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
