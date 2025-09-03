import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../api/user";
import UserCard from "./UserCard";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUsers();
      setUsers(response); 
    };
    fetchUsers();
  }, []);



  return (
    <div>
      {users.map((user) => 
      <UserCard key={user.id} user={user} setUsers={setUsers} />
      )}
    </div>
  );
};

export default UserList;
