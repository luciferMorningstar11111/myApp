class AddScheduleToPost < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :scheduled_at, :datetime
  end
end
