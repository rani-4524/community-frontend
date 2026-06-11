import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import CommunitiesPage from "./pages/CommunitiesPage";
import CommunityDetailPage from "./pages/CommunityDetailPage";
import UserProfile from "./pages/UserProfile";
import CreateEventPage from "./pages/CreateEventPage";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { login } from "./store/slices/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SERVER_URI = import.meta.env.VITE_API_URL;

function App() {
  const dispatch = useDispatch();

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${SERVER_URI}/user/me`, {
          withCredentials: true,
        });

        dispatch(
          login({
            user: res.data.data.user,
          }),
        );
      } catch (error) {
        console.log("No active session");
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [dispatch]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen bg-black overflow-x-hidden">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/community/:id" element={<CommunityDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/event/:eventId" element={<EventDetailPage />} />
            <Route
              path="/create-community"
              element={
                <ProtectedRoute>
                  <CreateCommunityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="dark"
            toastClassName={() =>
              "bg-zinc-900 text-white border border-zinc-700 rounded-2xl shadow-lg min-w-[280px] p-2"
            }
            bodyClassName={() => "text-sm font-medium"}
          />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
