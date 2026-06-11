import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { makeHost } from "../store/slices/authSlice";
import { setExistingCommunitiesDetails } from "../store/slices/communitiesSlice";
import { setExistingEventsDetails } from "../store/slices/eventSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const SERVER_URI = import.meta.env.VITE_API_URL;

const DashboardPage = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [data, setData] = useState(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center text-2xl">
        Please login first
      </div>
    );
  }

  const handleBecomeHost = async () => {
    try {
      await axios.patch(
        `${SERVER_URI}/user/make-host`,
        {},
        {
          withCredentials: true,
        },
      );

      dispatch(makeHost());
      toast.success("You are now a host 🎉");
    } catch (error) {
      console.log(error);
      toast.error("Failed to bacome host ❌");
    }
  };

  const handleDeleteCommunity = async (communityId) => {
    try {
      await axios.delete(`${SERVER_URI}/community/${communityId}`, {
        withCredentials: true,
      });

      setData((prev) => ({
        ...prev,
        hostedCommunities: prev.hostedCommunities.filter(
          (community) => community._id !== communityId,
        ),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`${SERVER_URI}/event/${eventId}`, {
        withCredentials: true,
      });

      setData((prev) => ({
        ...prev,
        createdEvents: prev.createdEvents.filter(
          (event) => event._id !== eventId,
        ),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    try {
      await axios.patch(
        `${SERVER_URI}/user/leave-community/${communityId}`,
        {},
        {
          withCredentials: true,
        },
      );

      setData((prev) => ({
        ...prev,
        joinCommunities: prev.joinCommunities.filter(
          (community) => community._id !== communityId,
        ),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelRSVP = async (eventId) => {
    try {
      await axios.patch(
        `${SERVER_URI}/user/toggleRSVP`,
        {},
        {
          params: { eventId },
          withCredentials: true,
        },
      );

      setData((prev) => ({
        ...prev,
        rsvpedEvents: prev.rsvpedEvents.filter(
          (event) => event._id !== eventId,
        ),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const url =
          user.role === "host"
            ? `${SERVER_URI}/user/host/dashboard`
            : `${SERVER_URI}/user/dashboard`;

        const response = await axios.get(url, {
          withCredentials: true,
        });

        const dashboardData =
          user.role === "host"
            ? response.data.data.hostDashboard
            : response.data.data.dashboard;

        setData(dashboardData);
        dispatch(
          setExistingCommunitiesDetails({
            joinedCommunities: dashboardData.joinedCommunities || [],
            hostedCommunities: dashboardData.hostedCommunities || [],
          }),
        );
        dispatch(
          setExistingEventsDetails({
            rsvpedEvents: dashboardData.rsvpedEvents || [],
            myCreatedEvents: dashboardData.myCreatedEvents || [],
          }),
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, [user]);

  if (!data) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {" "}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          {" "}
          Welcome, <span className="text-red-500">{data.name}</span>
        </h1>

        <p className="text-gray-400 mt-3 capitalize text-lg">
          {data.role} Dashboard
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {" "}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
            <h2 className="text-4xl font-bold text-red-400">
              {data.joinCommunities?.length || 0}
            </h2>
            <p className="text-gray-400 mt-2">Joined Communities</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
            <h2 className="text-4xl font-bold text-red-400">
              {data.rsvpedEvents?.length || 0}
            </h2>
            <p className="text-gray-400 mt-2">RSVPed Events</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
            <h2 className="text-4xl font-bold text-red-400">
              {data.hostedCommunities?.length || 0}
            </h2>
            <p className="text-gray-400 mt-2">Hosted Communities</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-5 flex-wrap">
          {" "}
          <Link
            to="/communities"
            className="bg-red-500 hover:bg-red-600 px-7 py-4 rounded-2xl font-medium transition"
          >
            Explore Communities
          </Link>
          <Link
            to="/events"
            className="border border-white/10 hover:border-red-500 px-7 py-4 rounded-2xl transition"
          >
            Explore Events
          </Link>
          {user.role === "member" && (
            <button
              onClick={handleBecomeHost}
              className="px-7 py-4 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl cursor-pointer transition"
            >
              Become Host
            </button>
          )}
          {user.role === "host" && (
            <>
              <Link
                to="/create-community"
                className="border border-white/10 hover:border-red-500 px-7 py-4 rounded-2xl transition"
              >
                Create Community
              </Link>

              <Link
                to="/create-event"
                className="border border-white/10 hover:border-red-500 px-7 py-4 rounded-2xl transition"
              >
                Create Event
              </Link>
            </>
          )}
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between sm:items-center">
            <h2 className="text-2xl font-bold mb-6">Joined Communities</h2>

            {data.joinCommunities?.length ? (
              <div className="space-y-4">
                {data.joinCommunities.map((community) => (
                  <div
                    key={community._id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-xl font-semibold">
                        {community.name}
                      </h3>
                      <p className="text-gray-400 mt-2 capitalize">
                        {community.category}
                      </p>
                    </div>

                    <button
                      onClick={() => handleLeaveCommunity(community._id)}
                      className="px-5 py-2 rounded-xl border border-red-500 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition"
                    >
                      Leave
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No joined communities</p>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between sm:items-center">
            <h2 className="text-2xl font-bold mb-6">RSVPed Events</h2>

            {data.rsvpedEvents?.length ? (
              <div className="space-y-4">
                {data.rsvpedEvents.map((event) => (
                  <div
                    key={event._id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-xl font-semibold">{event.name}</h3>
                      <p className="text-gray-400 mt-2">{event.city}</p>
                    </div>

                    <button
                      onClick={() => handleCancelRSVP(event._id)}
                      className="px-5 py-2 rounded-xl border border-red-500 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No RSVPs yet</p>
            )}
          </div>
        </div>

        {user.role === "host" && (
          <div className="mt-12 grid lg:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between sm:items-center">
              <h2 className="text-2xl font-bold mb-6">Hosted Communities</h2>

              {data.hostedCommunities?.length ? (
                <div className="space-y-4">
                  {data.hostedCommunities.map((community) => (
                    <div
                      key={community._id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="text-xl font-semibold">
                          {community.name}
                        </h3>
                        <p className="text-gray-400 mt-2 capitalize">
                          {community.category}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const confirmDelete = window.confirm(
                            `Delete ${community.name}?`,
                          );
                          if (confirmDelete) {
                            handleDeleteCommunity(community._id);
                          }
                        }}
                        className="px-5 py-2 rounded-xl border border-red-500 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No communities hosted yet</p>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between sm:items-center">
              <h2 className="text-2xl font-bold mb-6">Created Events</h2>

              {data.createdEvents?.length ? (
                <div className="space-y-4">
                  {data.createdEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="text-xl font-semibold">{event.name}</h3>
                        <p className="text-gray-400 mt-2">{event.city}</p>
                      </div>

                      <button
                        onClick={() => {
                          const confirmDelete = window.confirm(
                            `Delete ${event.name}?`,
                          );
                          if (confirmDelete) {
                            handleDeleteEvent(event._id);
                          }
                        }}
                        className="px-5 py-2 rounded-xl border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No created events yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
