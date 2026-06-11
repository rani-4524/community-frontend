import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllEvents } from "../store/slices/eventSlice";
import Loader from "../components/Loader";

const SERVER_URI = import.meta.env.VITE_API_URL;

const EventsPage = () => {
  const dispatch = useDispatch();

  const events = useSelector((state) => state.event?.allEvents) || [];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter((event) => {
    return (
      (event.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (event.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.venue || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${SERVER_URI}/event/all`);

        dispatch(setAllEvents(response.data.data.events));
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, [dispatch]);

  if (!events.length) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-red-400 font-medium">EVENTS</p>
          <h1 className="text-5xl font-bold mt-3">Discover Events</h1>
          <p className="text-gray-400 mt-4 text-lg">
            Find upcoming events, workshops, and meetups near you.
          </p>
        </div>

        <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-4 backdrop-blur-lg">
          <input
            type="text"
            placeholder="Search Events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent flex-1 outline-none text-gray-300 text-lg"
          />

          <button className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-medium transition cursor-pointer">
            Search
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {filteredEvents.map((event, index) => (
            <div
              key={event._id || index}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[360px] backdrop-blur-lg hover:border-red-500/40 hover:-translate-y-2 transition duration-300"
            >
              <div className="inline-block px-4 py-2 rounded-full bg-red-500/15 border-red-500/30 text-red-400 text-sm font-medium">
                {new Date(event.time).toLocaleDateString()}
              </div>

              <h2 className="text-2xl font-semibold mt-5">{event.name}</h2>

              <p className="text-gray-300 mt-4 leading-7 line-clamp-2">
                {event.description}
              </p>

              <div className="mt-5 inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                📍
                {event.city
                  ? event.city.charAt(0).toUpperCase() + event.city.slice(1)
                  : "Unknown City"}
              </div>

              <p className="text-red-400 mt-5 text-sm">Venue: {event.venue}</p>

              <Link to={`/event/${event._id}`}>
                <button className="mt-6 w-full bg-red-500 hover:bg-red-600 py-3 cursor-pointer rounded-xl font-medium transition">
                  View Event
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
