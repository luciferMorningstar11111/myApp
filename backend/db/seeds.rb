# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Create Users
users = User.create!([
  { name: "Aaditya", email: "aaditya@example.com", password: "password123" },
  { name: "John Doe", email: "john@example.com", password: "password123" },
  { name: "Jane Smith", email: "jane@example.com", password: "password123" }
])

# Create Posts
Post.create!([
  { title: "First Post", description: "This is the first post", published: true, user_id: users.first.id },
  { title: "Scheduled Post", description: "This will be published later", scheduled_at: Time.zone.now + 2.hours, published: false, user_id: users.second.id },
  { title: "Another Post", description: "Published immediately", published: true, user_id: users.last.id }
])

# Create Follows
Follow.create!([
  { follower_id: users.first.id, followed_id: users.second.id },
  { follower_id: users.second.id, followed_id: users.last.id },
  { follower_id: users.last.id, followed_id: users.first.id }
])
