import React from 'react'
import SignIn from './components/Authentication/SignIn'
import SignUp from './components/Authentication/SignUp'
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/Authentication/ProtectedRoute'
import MyPosts from './components/dashboard/MyPosts';
import NewPost from './components/dashboard/newPost';
import EditPost from './components/dashboard/editPost';
import Navbar from './components/Navbar/Navbar';
import UserList from './components/User/UserList';
import UserProfile from './components/User/UserProfile';

function App() {
  return (
   <Routes>
      
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/my_profile" element={
          <ProtectedRoute>
            <Navbar />
          <UserProfile/>
          </ProtectedRoute>
        } 
      />
      <Route path="/users" element={
          <ProtectedRoute>
            <Navbar />
          <UserList />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navbar />
            <MyPosts />
          </ProtectedRoute>
        }
      />
       <Route
        path="/createpost"
        element={
          <ProtectedRoute>
            <NewPost />
          </ProtectedRoute>
        }
      />
       <Route
        path="/editpost/:id"
        element={
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App
