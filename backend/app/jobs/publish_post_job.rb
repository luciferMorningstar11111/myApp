class PublishPostJob < ApplicationJob
  queue_as :default

  def perform(post_id, scheduled_time = nil)
    post = Post.find_by(id: post_id)
    return unless post

    attributes = { published: true }
    attributes[:scheduled_at] = scheduled_time if scheduled_time.present?

    post.update(attributes)
  end
end
