class AddReadAndRecipientToMessages < ActiveRecord::Migration[7.0]
  def change
    add_column :messages, :read, :boolean, default: false
    add_column :messages, :recipient_id, :integer
  end
end
