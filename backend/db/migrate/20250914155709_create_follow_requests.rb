# migration: create_follow_requests.rb
class CreateFollowRequests < ActiveRecord::Migration[7.1]
  def change
    create_table :follow_requests do |t|
      t.integer :sender_id, null: false   # the user who sends the request
      t.integer :receiver_id, null: false # the private profile user
      t.string :status, default: "pending" # pending, accepted, rejected
      t.timestamps
    end

    add_index :follow_requests, [:sender_id, :receiver_id], unique: true
  end
end
