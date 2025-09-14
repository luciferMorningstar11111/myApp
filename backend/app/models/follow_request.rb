# app/models/follow_request.rb
class FollowRequest < ApplicationRecord
  belongs_to :sender, class_name: "User"
  belongs_to :receiver, class_name: "User"

  validates :sender_id, uniqueness: { scope: :receiver_id }
  after_initialize :set_default_status, if: :new_record?

  def set_default_status
    self.status ||= "pending"
  end
end
