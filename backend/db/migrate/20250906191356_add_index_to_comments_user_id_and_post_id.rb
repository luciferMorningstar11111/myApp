class AddIndexToCommentsUserIdAndPostId < ActiveRecord::Migration[7.1]
  def change
    add_index :comments, [:user_id, :post_id]
  end
end
