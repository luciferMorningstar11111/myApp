class LikesController < ApplicationController
  before_action :set_post

  def create
    like = current_user.likes.new(post: @post)
    if like.save
      render json: { success: true, message: "Post liked" }, status: :created
    else
      render json: { success: false, message: "Already liked" }, status: :unprocessable_entity
    end
  end

  def destroy
    like = current_user.likes.find_by(post: @post)
    if like
      like.destroy
      render json: { success: true, message: "Post unliked" }, status: :ok
    else
      render json: { success: false, message: "Not liked yet" }, status: :not_found
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end
end
