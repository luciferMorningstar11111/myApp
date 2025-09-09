import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPost } from "../../api/post";
import { getComments, createComment, updateComment, deleteComment } from "../../api/comment";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPost(id);
        setPost(res.data);
      } catch (e) {
        console.error("Error loading post:", e);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await getComments(id);
        setComments(res.data);
      } catch (e) {
        console.error("Error loading comments:", e);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await createComment(id, { comment: { content: newComment } });
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (e) {
      console.error("Error adding comment:", e);
    }
  };

  const startEditComment = (comment) => {
    setEditCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const cancelEdit = () => {
    setEditCommentId(null);
    setEditCommentContent("");
  };

  const saveEditComment = async () => {
    if (!editCommentContent.trim()) return;

    try {
      const res = await updateComment(id, editCommentId, { comment: { content: editCommentContent } });
      setComments(
        comments.map((c) => (c.id === editCommentId ? res.data : c))
      );
      setEditCommentId(null);
      setEditCommentContent("");
    } catch (e) {
      console.error("Error updating comment:", e);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(id, commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (e) {
      console.error("Error deleting comment:", e);
    }
  };

  if (!post) return <div>Loading post...</div>;

  return (
    <div className="max-w-3xl mx-auto p-5">
      <Link to="/" className="text-blue-600 underline mb-4 inline-block">
        ← Back to Posts
      </Link>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-700 mb-4">{post.description}</p>
      <p className="text-gray-500 text-sm mb-4">By {post.user.name}</p>

      <hr className="mb-6" />

      {/* Comments Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Comments</h2>
        {comments.length === 0 && <p>No comments yet.</p>}
<ul className="mb-4 space-y-2">
  {comments.map((c) => (
    <li key={c.id} className="bg-gray-100 p-3 rounded flex flex-col gap-2">
      {editCommentId === c.id ? (
        <>
          <input
            type="text"
            className="border p-2 rounded"
            value={editCommentContent}
            onChange={(e) => setEditCommentContent(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={saveEditComment}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {/* USERNAME DISPLAY */}
          <p className="text-sm font-semibold text-gray-700">{c.user_name || c.user?.name}</p>
          <p>{c.content}</p>
          <div className="flex gap-2">
            <button
              onClick={() => startEditComment(c)}
              className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteComment(c.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  ))}
</ul>

        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="border p-2 rounded flex-grow"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
