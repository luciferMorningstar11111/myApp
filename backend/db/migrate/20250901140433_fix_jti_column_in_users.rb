class FixJtiColumnInUsers < ActiveRecord::Migration[7.1]
  def change
    change_column_null :users, :jti, false

    unless index_exists?(:users, :jti)
      add_index :users, :jti, unique: true
    end
  end
end
