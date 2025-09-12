class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :active_follows, class_name: 'Follow', foreign_key: 'follower_id'
  has_many :following, through: :active_follows, source: :followed
  has_many :posts, dependent: :destroy

  has_many :passive_follows, class_name: 'Follow', foreign_key: 'followed_id'
  has_many :followers, through: :passive_follows, source: :follower

  has_many :blocks, foreign_key: :blocker_id, dependent: :destroy
  has_many :blocked_users, through: :blocks, source: :blocked

  has_many :likes, dependent: :destroy
  has_many :liked_posts, through: :likes, source: :post

  has_many :comments, dependent: :destroy

  has_many :notifications, dependent: :destroy

  # 👇 Add these associations
  has_many :conversation_users, dependent: :destroy
  has_many :conversations, through: :conversation_users

  # Helper method to check if user is blocked
  def blocked?(user)
    blocked_users.include?(user)
  end

  validates :is_public, inclusion: { in: [true, false] }
end
