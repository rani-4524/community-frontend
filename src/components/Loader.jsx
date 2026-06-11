import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />

        <p className="text-gray-400 text-lg tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;