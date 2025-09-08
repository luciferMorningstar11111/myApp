class CreateBlocks < ActiveRecord::Migration[7.1]
  def change
    create_table :blocks do |t|
      t.integer :blocker_id
      t.integer :blocked_id

      t.timestamps
    end
  end
end
