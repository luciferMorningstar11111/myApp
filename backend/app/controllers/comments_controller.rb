class CommentsController < ApplicationController
  before_action :set_post
  before_action :set_comment, only: %i[update destroy]

  def index
    comments_with_user = @post.comments.includes(:user).map do |comment|
      {
        id: comment.id,
        content: comment.content,
        user_name: comment.user.name,
        created_at: comment.created_at,
        updated_at: comment.updated_at
      }
    end

    render json: comments_with_user
  end

  def create
    comment = @post.comments.new(comment_params.merge(user: current_user))
    if comment.save
      Notification.create!(
        user: @post.user,
        post: @post,
        actor: current_user,
        action: 'commented'
      )
      render json: comment, status: :created

    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @comment.user == current_user && @comment.update(comment_params)
      render json: @comment
    else
      render json: { error: 'Not authorized or invalid data' }, status: :forbidden
    end
  end

  def destroy
    if @comment.user == current_user
      @comment.destroy
      head :no_content
    else
      render json: { error: 'Not authorized' }, status: :forbidden
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end

  def set_comment
    @comment = @post.comments.find(params[:id])
  end

  def comment_params
    params.require(:comment).permit(:content)
  end
end
