class ConversationsController < ApplicationController
  def index
    conversations = current_user.conversations.includes(:users, :messages)
    render json: conversations.map { |c|
      {
        id: c.id,
        users: c.users.map { |u| { id: u.id, name: u.name } },
        last_message: c.messages.last&.as_json(
          only: %i[id content created_at],
          include: { user: { only: %i[id name] } }
        ),
        unread_count: c.messages.unread_for(current_user.id).count # 👈 add here also
      }
    }
  end

  def show
    conversation = current_user.conversations
                               .includes(messages: :user, users: {})
                               .find(params[:id])

    render json: conversation_json(conversation)
  end

  def create
    other_user = User.find(params[:user_id])
    conversation = Conversation.between(current_user.id, other_user.id)

    render json: { conversation_id: conversation.id }
  end

  def unread_count
    count = Message.unread_for(current_user.id).count
    render json: { unread_count: count }
  end

  # 👇 NEW ACTION: mark all unread messages in this conversation as read
  def mark_as_read
    conversation = current_user.conversations.find(params[:id])
    conversation.messages
                .where(recipient_id: current_user.id, read: false)
                .update_all(read: true)
    render json: { success: true }
  end

  private

def conversation_json(conversation)
  {
    id: conversation.id,
    users: conversation.users.map { |u| { id: u.id, name: u.name } },
    messages: conversation.messages.order(:created_at).map do |m|
      {
        id: m.id,
        content: m.content,
        created_at: m.created_at,
        read: m.read,
        recipient_id: m.recipient_id,
        user: { id: m.user.id, name: m.user.name }
      }
    end,
    last_message: conversation.messages.order(:created_at).last&.as_json(
      only: %i[id content created_at],
      include: { user: { only: %i[id name] } }
    ),
    unread_count: conversation.messages.unread_for(current_user.id).count
  }
end

end
