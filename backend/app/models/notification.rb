class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :post
  belongs_to :actor, class_name: 'User'

  validates :action, presence: true
end
