# app/controllers/follow_requests_controller.rb
class FollowRequestsController < ApplicationController
  before_action :authenticate_user!

  def create
    receiver = User.find(params[:receiver_id])
    if receiver.is_public
      # If profile is public → directly follow
      current_user.follows.create(followed_id: receiver.id)
      render json: { message: "You are now following #{receiver.name}" }
    else
      # If private → send request
      request = current_user.sent_follow_requests.create(receiver: receiver)
      render json: { message: "Follow request sent to #{receiver.name}", request: request }
    end
  end

  def update
    request = FollowRequest.find(params[:id])
    if params[:status] == "accepted"
      # Create follow record
      Follow.create(follower_id: request.sender_id, followed_id: request.receiver_id)
      request.update(status: "accepted")
      render json: { message: "Follow request accepted" }
    else
      request.update(status: "rejected")
      render json: { message: "Follow request rejected" }
    end
  end
end
