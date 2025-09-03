import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-end gap-8 justify-end px-6 py-4 bg-white shadow-md">
      {/* Back button */}
      <button
        onClick={() => navigate("/users")}
        className="flex items-center text-gray-700 hover:text-gray-900"
      >

Users
      </button>
       <button
        onClick={() => navigate("/")}
        className="flex items-center text-gray-700 hover:text-gray-900"
      >
Posts
      </button>
      {/* New Post button */}
      <Link
        to="/createpost"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        New Post
      </Link>
    </nav>
  );
};

export default Navbar;
