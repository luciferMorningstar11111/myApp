import React, { useState } from "react";
import { Link } from "react-router-dom";
import { deletePost ,likePost,unlikePost} from "../../api/post";

const PostCard = ({ post, onDelete }) => {
  const [liked, setLiked] = useState(post.is_liked);
  const [likeCount, setLikeCount] = useState(post.like_count);

  const handleLikeToggle = async () => {
    try {
      if (liked) {
        await unlikePost(post.id);
        setLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await likePost(post.id);
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDelete = () => {
    deletePost(post.id);
    onDelete(post.id);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5 flex flex-col justify-between hover:shadow-xl transition duration-300">
      <div>
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-2">{post.description}</p>
        <p className="text-gray-500 text-sm mb-2">By {post.user.name}</p>
        <p
          className={`text-sm font-semibold ${
            post.published ? "text-green-600" : "text-red-600"
          }`}
        >
          {post.published ? "Published" : "Not Published"}
        </p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        {/* Like Button */}
        <button
          onClick={handleLikeToggle}
          className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition ${
            liked
              ? "bg-pink-600 text-white hover:bg-pink-700"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {liked ? "❤️ Liked" : "🤍 Like"} ({likeCount})
        </button>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
          <Link to={`/editpost/${post.id}`}>
            <button className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">
              Edit
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
