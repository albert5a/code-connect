import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import FeedPage from "./pages/FeedPage";
import PostDetailPage from "./pages/PostDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/posts" replace />,
  },
  {
    path: "/posts",
    element: <FeedPage />,
  },
  {
    path: "/posts/:postId",
    element: <PostDetailPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
