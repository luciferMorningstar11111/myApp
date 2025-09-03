class PostsController < ApplicationController
  before_action :authenticate_user!

  def index
    posts = Post.published.includes(:user)
    render json: posts.as_json(include: { user: { only: [:id, :name, :email] } })
  end

  def show
    post = Post.find(params[:id])
    render json: post.as_json(include: { user: { only: [:id, :name, :email] } })
  end

  def create
    post = current_user.posts.new(post_params)  # ✅ Correct association
    if post.save
      render json: handle_publish(post)
    else
      render json: { status: 422, message: post.errors.full_messages.to_sentence }
    end
  end

  def update
    post = Post.find(params[:id])
    if post.update(post_params)
      render json: handle_publish(post)
    else
      render json: { status: 422, message: post.errors.full_messages.to_sentence }
    end
  end

  def destroy
    post = Post.find(params[:id])
    if post.destroy
      render json: { status: 200, message: "Post deleted successfully" }
    else
      render json: { status: 422, message: "Failed to delete post" }
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :description, :scheduled_at)
  end

  def handle_publish(post)
    if post.scheduled_at.present? && post.scheduled_at > Time.zone.now
      post.update(published: false) if post.published
      PublishPostJob.set(wait_until: post.scheduled_at).perform_later(post.id, post.scheduled_at)
      {
        status: 200,
        message: "Post scheduled successfully",
        data: post.as_json(include: { user: { only: [:id, :name, :email] } })
      }
    else
      post.update(published: true)
      {
        status: 200,
        message: "Post published successfully",
        data: post.as_json(include: { user: { only: [:id, :name, :email] } })
      }
    end
  end
end
