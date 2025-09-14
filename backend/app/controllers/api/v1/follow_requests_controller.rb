class Api::V1::FollowRequestsController < ApplicationController
  before_action :authenticate_user!

  def index
    requests = FollowRequest.where(receiver_id: current_user.id, status: 'pending')
    render json: requests.includes(:sender).map { |r|
      {
        id: r.id,
        name: r.sender.name,
        email: r.sender.email,
        status: r.status
      }
    }
  end

  def update
    request = FollowRequest.find(params[:id])
    if params[:status].in?(%w[accepted rejected])
      request.update(status: params[:status])

      # ✅ Only create follow for accepted
      Follow.create(follower_id: request.sender_id, followed_id: request.receiver_id) if params[:status] == 'accepted'

      render json: { message: "Request #{params[:status]}" }, status: :ok
    else
      render json: { error: 'Invalid status' }, status: :unprocessable_entity
    end
  end
end
