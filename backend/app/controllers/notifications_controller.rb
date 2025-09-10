class NotificationsController < ApplicationController
def index
  notifications = current_user.notifications
                              .includes(:actor, :post)
                              .order(created_at: :desc)

  render json: notifications.map { |n|
    {
      id: n.id,
      actor_name: n.actor.name,
      action: n.action,
      post_title: n.post.title,
      read: n.read,
      created_at: n.created_at
    }
  }
end



  def mark_all_as_read
    current_user.notifications.update_all(read: true)
    render json: { success: true }
  end
end
