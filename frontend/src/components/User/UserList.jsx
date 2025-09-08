import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../api/user";
import UserCard from "./UserCard";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUsers();
      console.log(response);
      setUsers(response); 
    };
    fetchUsers();
  }, []);



  return (
    <div>
     {users
  .filter((u) => !u.is_blocked)
  .map((user) => (
    <UserCard key={user.id} user={user} setUsers={setUsers} />
  ))}
    </div>
  );
};

export default UserList;
