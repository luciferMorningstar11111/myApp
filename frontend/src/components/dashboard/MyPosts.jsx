import React, { useEffect, useState } from "react";
import { myPosts, deletePost } from "../../api/post";
import { Link } from "react-router-dom";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await myPosts();
        setPosts(data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = (id) => {
    deletePost(id);
    setPosts(posts.filter((p) => p.id !== id));
  };

  if (posts.length === 0) {
    return (
      <div className="p-5 text-center">
        <Link
          to="/createpost"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Post
        </Link>
        <div className="mt-4 text-gray-500">No Posts Available</div>
      </div>
    );
  }

  return (
    <div className="p-5 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white shadow-md rounded-lg p-5 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-2">{post.description}</p>
            <p className="text-gray mb-2">Created by {post.user.name}</p>
            <p
              className={`text-sm font-semibold ${
                post.published ? "text-green-600" : "text-red-600"
              }`}
            >
              {post.published ? "Published" : "Not Published"}
            </p>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
              onClick={() => handleDelete(post.id)}
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
      ))}
    </div>
  );
};

export default MyPosts;
