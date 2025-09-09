class Api::V1::BlocksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user

  def create
    if current_user.blocks.find_by(blocked_id: @user.id)
      render json: { error: 'Already blocked' }, status: :unprocessable_entity
    else
      current_user.blocks.create(blocked_id: @user.id)
      render json: { message: 'User blocked' }, status: :created
    end
  end

  def destroy
    block = current_user.blocks.find_by(blocked_id: @user.id)
    if block
      block.destroy
      render json: { message: 'User unblocked' }
    else
      render json: { error: 'Not blocked' }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id]) # ✅ FIX HERE
  end
end
