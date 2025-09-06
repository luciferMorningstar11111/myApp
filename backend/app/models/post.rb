class Post < ApplicationRecord
  scope :published, -> { where(published: true) }
  belongs_to :user

   has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user

  has_many :comments, dependent: :destroy
end
