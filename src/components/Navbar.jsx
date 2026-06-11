import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { useState } from "react";

const Navbar = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logged out");
  };
  return (
    <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {" "}
        <Link to="/" className="text-2xl sm:text-3xl font-bold text-white">
          Community<span className="text-red-500">Hub</span>
        </Link>
        <div className="hidden md:flex items-center gap-10 text-gray-300 font-medium">
          <Link to="/" className="hover:text-red-500 transition">
            Home
          </Link>

          <Link to="/communities" className="hover:text-red-500 transition">
            Communities
          </Link>

          <Link to="/events" className="hover:text-red-500 transition">
            Events
          </Link>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white text-3xl"
        >
          {isOpen ? "✕" : "☰"}
        </button>
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <span className=" hidden md:block text-gray-300">
                Hi, <span className="text-red-400">{user?.name}</span>
              </span>

              <Link
                to="/profile"
                className="text-gray-300 hover:text-red-500 transition"
              >
                Profile
              </Link>

              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-red-500 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-medium transition shadow-lg shadow-red-500/20 text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-black border-t border-white/10 px-4 py-6 space-y-4">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-gray-300 hover:text-red-500"
          >
            Home
          </Link>

          <Link
            to="/communities"
            onClick={() => setIsOpen(false)}
            className="block text-gray-300 hover:text-red-500"
          >
            Communities
          </Link>

          <Link
            to="/events"
            onClick={() => setIsOpen(false)}
            className="block text-gray-300 hover:text-red-500"
          >
            Events
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-red-500"
              >
                Profile
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-red-500"
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full px-6 py-3 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-red-500"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl text-center text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
