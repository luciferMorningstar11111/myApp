import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../api/user";
import UserCard from "./UserCard";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const fetchUsers = async (term = "") => {
      setLoading(true);
      const response = await getAllUsers(term);
      setUsers(response);
      setLoading(false);
    };

    const timer = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div>
     {users
  .filter((u) => !u.is_blocked)
  .map((user) => (
    <UserCard key={user.id} user={user} setUsers={setUsers} />
  ))}

    <div className="p-4">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : users.length > 0 ? (
        users.map((user) => (
          <UserCard key={user.id} user={user} setUsers={setUsers} />
        ))
      ) : (
        <p className="text-gray-500 text-center">No users found</p>
      )}
    </div>
  );
};

export default UserList;
