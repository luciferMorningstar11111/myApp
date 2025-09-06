import React, { useEffect, useState } from "react";
import { myPosts } from "../../api/post";
import { Link } from "react-router-dom";
import PostCard from "./PostCard";

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
        <PostCard key={post.id} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default MyPosts;
