import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../store/slices/eventSlice";
import { setExistingCommunitiesDetails } from "../store/slices/communitiesSlice";
import { toast } from "react-toastify";

const SERVER_URI = import.meta.env.VITE_API_URL;

const CreateEventPage = () => {
  const dispatch = useDispatch();
  const [event, setEvent] = useState({
    name: "",
    description: "",
    city: "",
    venue: "",
    time: "",
    communityId: "",
  });

  const hostedCommunities = useSelector(
    (state) => state.community?.hostedCommunities || [],
  );

  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEvent((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const validate = () => {
    let errorList = [];

    if (!event.name.trim()) {
      errorList.push("Event Name is required");
    } else if (event.name.length < 6) {
      errorList.push("Event Name must be at least 6 characters");
    }

    if (!event.description.trim()) {
      errorList.push("Description is needed for create event");
    } else if (event.description.length < 10) {
      errorList.push("Description must be at least 10 characters");
    }

    if (!event.city.trim()) {
      errorList.push("City is required");
    }

    if (!event.venue.trim()) {
      errorList.push("venue is required");
    }

    if (!event.time.trim()) {
      errorList.push("time is required");
    }

    if (!event.communityId) {
      errorList.push("please select a community");
    }
    return errorList;
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error(validationErrors[0]);
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URI}/event/create`, event, {
        withCredentials: true,
      });

      dispatch(createEvent(response.data.data));

      toast.success("Event Created 🎉");

      setEvent({
        name: "",
        description: "",
        city: "",
        venue: "",
        time: "",
        communityId: "",
      });

      setErrors([]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.info || "Something went wrong";
      setErrors([errorMessage]);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await axios.get(`${SERVER_URI}/community/hosted`, {
          withCredentials: true,
        });
        dispatch(
          setExistingCommunitiesDetails({
            joinedCommunities: [],
            hostedCommunities: res.data.data.communities,
          }),
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchCommunities();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {" "}
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">
        <p className="text-red-400 font-medium">HOST PANEL</p>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">
          Create Event
        </h1>
        <p className="text-gray-400 mt-3">Organize something amazing.</p>

        <div className="mt-10 space-y-6">
          <input
            type="text"
            placeholder="Event Name"
            name="name"
            value={event.name}
            onChange={handleChange}
            className="w-full bg-white/5 text-white border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
          />

          <textarea
            placeholder="Event Description"
            name="description"
            value={event.description}
            onChange={handleChange}
            className="w-full bg-white/5 text-white border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
          />

          <input
            type="text"
            placeholder="City"
            name="city"
            value={event.city}
            onChange={handleChange}
            className="w-full bg-white/5 text-white border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
          />

          <input
            type="text"
            placeholder="Venue"
            name="venue"
            value={event.venue}
            onChange={handleChange}
            className="w-full bg-white/5 text-white border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
          />

          <input
            type="datetime-local"
            placeholder=" time"
            name="time"
            value={event.time}
            onChange={handleChange}
            className="w-full bg-white/5 text-white border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
          />

          <select
            name="communityId"
            value={event.communityId}
            onChange={handleChange}
            className="w-full bg-white/5 text-white border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
          >
            <option value="" className="bg-black text-white">
              Select Community
            </option>
            {hostedCommunities.filter(Boolean).map((community) => (
              <option
                key={community._id}
                value={community._id}
                className="bg-black text-white"
              >
                {community.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleClick}
            className="w-full bg-red-500 hover:bg-red-600 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition"
          >
            Create Event
          </button>

          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
              {errors.map((err, index) => (
                <p key={index} className="text-red-400">
                  • {err}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
