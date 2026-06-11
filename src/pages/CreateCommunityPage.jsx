import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createCommunity } from "../store/slices/communitiesSlice";
import { toast } from "react-toastify";

const SERVER_URI = import.meta.env.VITE_API_URL;

const CreateCommunityPage = () => {
  const categories = [
    "chess",
    "mern",
    "cooking",
    "sports",
    "jobs",
    "politics",
    "tech",
  ];

  const [community, setCommunity] = useState({
    name: "",
    description: "",
    category: "",
  });

  const [errors, setErrors] = useState([]);

  const dispatch = useDispatch();

  const validate = () => {
    let errorList = [];

    if (!community.name.trim()) {
      errorList.push("name is required for create comunity");
    } else if (community.name.length < 6) {
      errorList.push("name length must at least 6 characters");
    }

    if (!community.description.trim()) {
      errorList.push("description is required for create community");
    } else if (community.description.length < 10) {
      errorList.push("description must be at least 10 characters");
    }

    if (!community.category.trim()) {
      errorList.push("category is required");
    }

    return errorList;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCommunity((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const validateErrors = validate();

    if (validateErrors.length > 0) {
      setErrors(validateErrors);
      toast.error(validateErrors[0]);
      return;
    }

    try {
      const response = await axios.post(
        `${SERVER_URI}/community/create`,
        community,
        { withCredentials: true },
      );

      dispatch(
        createCommunity({
          newCommunity: response.data.data,
        }),
      );

      toast.success("Community Created 🎉");
      setErrors([]);
      setCommunity({
        name: "",
        description: "",
        category: "",
      });
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.error?.info || "something went wrong";
      setErrors([errorMessage]);
      toast.error(errorMessage);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {" "}
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">
        <p className="text-red-400 font-medium">HOST PANEL</p>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">
          Create Community
        </h1>
        <p className="text-gray-400 mt-3">Start building your own community.</p>

        <div className="mt-10 space-y-6">
          <input
            type="text"
            placeholder="Community name"
            name="name"
            value={community.name}
            onChange={handleChange}
            className="w-full bg-white/5 text-white border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
          />
          <textarea
            placeholder="Community Description"
            name="description"
            value={community.description}
            onChange={handleChange}
            rows={5}
            className="w-full bg-white/5 text-white border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500 resize-none"
          />
          <select
            name="category"
            value={community.category}
            onChange={handleChange}
            className="w-full bg-white/5 text-white border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
          >
            <option value="" className="bg-black text-white">
              Select Category
            </option>

            {categories.map((category) => (
              <option
                value={category}
                key={category}
                className="bg-black text-white"
              >
                {category}
              </option>
            ))}
          </select>

          <button
            onClick={handleClick}
            className="w-full bg-red-500 hover:bg-red-600 py-3 sm:py-4 rounded-2xl cursor-pointer font-semibold text-base sm:text-lg transition"
          >
            Create Community
          </button>

          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
              {errors?.map((err, index) => (
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

export default CreateCommunityPage;
