import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  joinCommunity,
  leaveCommunity,
} from "../store/slices/communitiesSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const SERVER_URI = import.meta.env.VITE_API_URL;
const CommunityDetailPage = () => {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const { id } = useParams();
  const dispatch = useDispatch();

  const [community, setCommunity] = useState(null);

  const joinedCommunities = useSelector(
    (state) => state.community.joinedCommunities,
  );

  const isJoined = joinedCommunities.some(
    (item) => item._id === community?._id,
  );

  if (!isLoggedIn) {
    navigate("/login");
    return;
  }

  const handleJoinLeave = async () => {
    try {
      if (!isJoined) {
        await axios.patch(
          `${SERVER_URI}/user/join-community`,
          {},
          {
            params: {
              communityId: community._id,
            },
            withCredentials: true,
          },
        );

        dispatch(joinCommunity(community));
        toast.success("Joined Community 🎉");
      } else {
        await axios.patch(
          `${SERVER_URI}/user/leave-community/${community._id}`,
          {},
          {
            withCredentials: true,
          },
        );

        dispatch(leaveCommunity({ communityId: community._id }));
        toast.info("Left Community");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error?.info || "Action failed ❌");
    }
  };

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(`${SERVER_URI}/community/specific`, {
          params: { communityId: id },
        });

        setCommunity(response.data.community);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCommunity();
  }, [id]);

  if (!community) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen bg-black text-white px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">
          <span className="inline-block px-5 py-2 rounded-full bg-red-500/10 border border-red-400 text-sm">
            {community.category}
          </span>

          <h1 className="text-5xl font-bold mt-6">{community.name}</h1>

          <p className="mt-6 text-gray-300 text-lg leading-8 max-w-3xl">
            {community.description}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center text-xl">
              👤
            </div>

            <div>
              <p className="text-gray-400 text-sm">Hosted by</p>
              <p className="text-white font-medium text-lg">
                {community.host?.name}
              </p>
            </div>
          </div>

          <button
            onClick={handleJoinLeave}
            className={`mt-10 inline-block px-8 py-4 rounded-2xl font-semibold transition shadow-lg  ${
              isJoined
                ? "bg-white/10 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                : "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
            }`}
          >
            {isJoined ? "Leave Community" : "Join Community"}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400 text-sm">Category</p>
            <h3 className="text-2xl font-semibold mt-2 capitalize">
              {community.category}
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400 text-sm">Members</p>
            <h3 className="text-2xl font-semibold mt-2">120+</h3>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400 text-sm">Events</p>
            <h3 className="text-2xl font-semibold mt-2">15+</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailPage;
