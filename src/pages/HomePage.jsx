import { useEffect } from "react";
import heroImg from "../assets/hero.svg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllCommunities } from "../store/slices/communitiesSlice";
import { setAllEvents } from "../store/slices/eventSlice";

const SERVER_URI = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const dispatch = useDispatch();

  const communities = useSelector(
    (state) => state.community?.allCommunities || [],
  );
  const events = useSelector((state) => state.event?.allEvents || []);
  useEffect(() => {
    const fetchHomedata = async () => {
      try {
        const communityRes = await axios.get(`${SERVER_URI}/community/all`);
        const eventRes = await axios.get(`${SERVER_URI}/event/all`);

        dispatch(setAllCommunities(communityRes.data.data.communities));

        dispatch(setAllEvents(eventRes.data.data.events));
      } catch (error) {
        console.log(error);
      }
    };

    fetchHomedata();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative ">
      {" "}
      <div className="absolute top-24 left-0 w-80 h-80 bg-red-600 rounded-full blur-[140px] opacity-20"></div>
      <div className="absolute top-20 right-20 w-80 h-80 bg-purple-600 rounded-full blur-[140px] opacity-20"></div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 grid md:grid-cols-2 items-center gap-12">
        {" "}
        <div className="w-full max-w-xl">
          <p className="inline-block px-5 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-lg font-medium">
            Connect • Grow • Belong
          </p>

          <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            {" "}
            Find Your <span className="text-red-500">Community</span>
            <br />
            Attend Meaningful <span className="text-red-500">Events</span>
          </h1>

          <p className="mt-4 text-lg text-gray-400 leading-8 max-w-lg">
            Discover communities, join events, and connect with people who share
            your passion.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-5">
            {" "}
            <Link to="/events">
              <button className="bg-red-500 hover:bg-red-600 px-8 py-4 rounded-2xl font-semibold cursor-pointer transition shadow-lg shadow-red-500/20">
                Explore Events
              </button>
            </Link>
            <Link to="/communities">
              <button className="border border-gray-700 hover:border-red-500 px-8 py-4 rounded-2xl font-semibold cursor-pointer transition">
                Explore Communities
              </button>
            </Link>
          </div>

          <div className="mt-6 flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-4 max-w-xl backdrop-blur-lg">
            <input
              type="text"
              placeholder="Search community, event, city..."
              className="bg-transparent flex-1 outline-none text-gray-300 text-lg"
            />

            <button className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-medium cursor-pointer transition">
              Search
            </button>
          </div>
        </div>
        <div className="flex justify-center ">
          {" "}
          <img src={heroImg} alt="Community" className="w-full max-w-md..." />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        {" "}
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-red-400 font-medium">COMMUNITIES</p>
            <h2 className="text-4xl font-bold mt-2">Featured Communities</h2>
          </div>

          <Link
            to="/communities"
            className="border border-gray-700 px-5 py-3 rounded-xl hover:border-red-500 cursor-pointer transition"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {" "}
          {communities.slice(0, 3).map((community) => (
            <div
              key={community._id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[320px]  backdrop-blur-lg hover:border-red-500/40 hover:-translate-y-2 transition duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-2xl mb-5">
                🚀
              </div>

              <h3 className="text-2xl font-semibold">{community.name}</h3>

              <p className="text-gray-400 mt-4 line-clamp-3 leading-7">
                {community.description}
              </p>

              <p className="text-sm text-red-400 mt-5">
                Host: {community.host?.name}
              </p>

              <button className="mt-6 w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-medium cursor-pointer transition">
                Join Community
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {" "}
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-red-400 font-medium">EVENTS</p>
            <h2 className="text-4xl font-bold mt-2">Upcoming Events</h2>
          </div>

          <Link
            to="/events"
            className="border border-gray-700 px-5 py-3 rounded-xl hover:border-red-500 cursor-pointer transition"
          >
            View All
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {events.slice(0, 3).map((event) => (
            <div
              key={event._id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-lg hover:border-red-500/40 hover:-translate-y-2 transition duration-300"
            >
              <div className="inline-block px-4 py-2 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-medium">
                {new Date(event.time).toLocaleDateString()}
              </div>

              <h3 className="text-2xl font-semibold mt-5">{event.name}</h3>

              <p className="text-gray-300 mt-4 leading-7 line-clamp-2">
                {event.description}
              </p>

              <div className="mt-5 inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                📍 {event.city}
              </div>

              <p className="mt-4 text-red-400">Venue: {event.venue}</p>

              <button className="mt-6 w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-medium cursor-pointer transition">
                View Event
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
