class MessagesController < ApplicationController
  before_action :set_conversation

  def index
    @messages = @conversation.messages.includes(:user).order(:created_at)

    render json: @messages.as_json(
      include: { user: { only: [:id, :name] } },
      only: [:id, :content, :created_at]
    )
  end

def create
  recipient = @conversation.users.where.not(id: current_user.id).first

  @message = @conversation.messages.build(message_params)
  @message.user = current_user
  @message.recipient = recipient  # 👈 set recipient

  if @message.save
    render json: @message.as_json(
      include: { user: { only: [:id, :name] } },
      only: [:id, :content, :created_at]
    ), status: :created
  else
    render json: { errors: @message.errors.full_messages }, status: :unprocessable_content
  end
end


  private

  def set_conversation
    @conversation = Conversation.find(params[:conversation_id])
  end

  def message_params
    params.require(:message).permit(:content)
  end
end
