class Conversation < ApplicationRecord
  has_many :conversation_users, dependent: :destroy
  has_many :users, through: :conversation_users
  has_many :messages, dependent: :destroy

  # Find or create a conversation between two users
  def self.between(user_a_id, user_b_id)
    convo = joins(:conversation_users)
            .where(conversation_users: { user_id: [user_a_id, user_b_id] })
            .group("conversations.id")
            .having("COUNT(conversation_users.user_id) = 2")
            .first
    return convo if convo

    ActiveRecord::Base.transaction do
      c = create!
      c.conversation_users.create!(user_id: user_a_id)
      c.conversation_users.create!(user_id: user_b_id)
      c
    end
  end
end
