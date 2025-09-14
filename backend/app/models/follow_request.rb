# app/models/follow_request.rb
class FollowRequest < ApplicationRecord
  belongs_to :sender, class_name: "User"
  belongs_to :receiver, class_name: "User"

  validates :sender_id, uniqueness: { scope: :receiver_id }
end
