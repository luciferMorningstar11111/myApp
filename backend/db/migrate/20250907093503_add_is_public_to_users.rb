class AddIsPublicToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :is_public, :boolean, default: true, null: false
  end
end
