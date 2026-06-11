import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllCommunities } from "../store/slices/communitiesSlice";
import Loader from "../components/Loader";

const SERVER_URI = import.meta.env.VITE_API_URL;
const CommunitiesPage = () => {
  const communities =
    useSelector((state) => state.community?.allCommunities) || [];
  const dispatch = useDispatch();

  const categories = [
    "All",
    ...new Set(communities.map((community) => community.category)),
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCommunities = communities.filter((community) => {
    const matchesCategory =
      selectedCategory === "All" || community.category === selectedCategory;

    const matchesSearch =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const fetchCommunites = async () => {
      try {
        const response = await axios.get(`${SERVER_URI}/community/all`);

        dispatch(setAllCommunities(response.data.data.communities));
      } catch (error) {
        console.log(error);
      }
    };
    fetchCommunites();
  }, [dispatch]);

  if (!communities.length) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-red-400 font-medium">COMMUNITIES</p>
          <h1 className="text-5xl font-bold mt-3">Discover Communities</h1>
        </div>

        <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-4 backdrop-blur-lg">
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent flex-1 outline-none text-gray-300 text-lg"
          />
          <button className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-medium cursor-pointer transition">
            Search
          </button>
        </div>
        <div className="flex gap-4 mt-8 flex-wrap">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`px-5 py-2 rounded-full border cursor-pointer transition ${
                selectedCategory === item
                  ? "bg-red-500 border-red-500 text-white"
                  : "border-white/10 bg-white/5 hover:border-red-500 "
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {filteredCommunities.map((community) => (
            <div
              key={community._id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-lg hover:border-red-500/40 hover:-translate-y-2 transition duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-2xl mb-5">
                🚀
              </div>
              <h2 className="text-2xl font-semibold">{community.name}</h2>
              <p className="text-gray-300 mt-4 leading-7 line-clamp-3">
                {community.description}
              </p>
              <div className="mt-5 inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                {community.category}
              </div>

              <p className="text-red-400 mt-5 text-sm">
                Host: {community.host?.name}
              </p>

              <Link to={`/community/${community._id}`}>
                <button className="mt-6 w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-medium cursor-pointer transition">
                  View Community
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunitiesPage;
