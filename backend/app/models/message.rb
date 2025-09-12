class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :user

  validates :content, presence: true

  after_create_commit :broadcast_conversation
  belongs_to :recipient, class_name: 'User'

  scope :unread_for, ->(user_id) { where(recipient_id: user_id, read: false) }

  private

  def broadcast_conversation
    ConversationsChannel.broadcast_to(conversation, {
                                        payload: {
                                          id: conversation.id,
                                          users: conversation.users.map { |u| { id: u.id, name: u.name } },
                                          messages: conversation.messages.order(:created_at).map do |m|
                                            {
                                              id: m.id,
                                              content: m.content,
                                              created_at: m.created_at,
                                              user: { id: m.user.id, name: m.user.name }
                                            }
                                          end
                                        }
                                      })
  end
end
