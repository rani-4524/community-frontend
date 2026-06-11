import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfilePic } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const SERVER_URI = import.meta.env.VITE_API_URL;

const UserProfile = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const joinedCommunities = user?.joinCommunities || [];

  const hostedCommunities = user?.hostedCommunities || [];

  const rsvpedEvents = user?.rsvpedEvents || [];

  const handleUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();

      formData.append("profilePic", file);

      const response = await axios.patch(
        `${SERVER_URI}/user/upload-profile-pic`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const imagePath = response.data.data.file.path.replace(/\\/g, "/");

      dispatch(updateProfilePic(imagePath));
      toast.success("Profile picture updated 🎉");
    } catch (error) {
      console.log(error);
      toast.error("Upload failed❌");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center text-2xl">
        No user logged in
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
            {user.profilePicUrl ? (
              <img
                src={`${SERVER_URI.replace("/api", "")}/${user.profilePicUrl.replace(/\\/g, "/")}`}
                alt="profile"
                className="w-28 h-28 rounded-full object-cover border-2 border-red-500"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-red-500 flex items-center justify-center text-4xl font-bold">
                {user.name[0]}
              </div>
            )}

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">{user.name}</h1>

              <p className="text-gray-400 mt-2">{user.email}</p>

              <span className="inline-block mt-4 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <label className="mt-8 inline-block w-full sm:w-auto text-center cursor-pointer bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-medium transition">
            Upload Profile Pic
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
            <h2 className="text-4xl font-bold text-red-400">
              {joinedCommunities.length}
            </h2>

            <p className="text-gray-400 mt-2">Joined Communities</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
            <h2 className="text-4xl font-bold text-red-400">
              {rsvpedEvents.length}
            </h2>

            <p className="text-gray-400 mt-2">RSVPed Evets</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
            <h2 className="text-4xl font-bold text-red-400">
              {hostedCommunities.length}
            </h2>

            <p className="text-gray-400 mt-2">Hosted Communities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
