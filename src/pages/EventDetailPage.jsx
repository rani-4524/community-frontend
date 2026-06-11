import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { rsvpedEvents , cancelRsvp } from "../store/slices/eventSlice"
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const SERVER_URI = import.meta.env.VITE_API_URL;

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const dispatch = useDispatch();

  const myRsvps = useSelector(
    (state) => state.event.rsvpedEvents
  );

  const isLoggedIn = useSelector(
    (state) => state.auth.isLoggedIn
  )

  const isRsvped = myRsvps.some(
    (item) => item._id === event?._id
  );

  if(!isLoggedIn){
    navigate('/login');
    return;
  }

  const handleRsvp = async() =>{
    try {
      await axios.patch(
        `${SERVER_URI}/user/toggleRSVP`,
        {},
        {
          params : {
            eventId : event._id,
          },
          withCredentials : true,
        }
      );

      if(!isRsvped) {
        dispatch(rsvpedEvents(event));
        toast.success("RSVP successful 🎉")
      }else{
        dispatch(
          cancelRsvp({
            eventId:event._id,
          })
        )
        toast.info("RSVP cancelled")
      }
    } catch (error) {
      console.log(error); 
      toast.error(
        error.response?.data?.error?.info ||
        "Something went wrong ❌"
      )   
    }
  }

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${SERVER_URI}/event/specific`, {
          params: { id:eventId },
        });
        setEvent(response.data.data.event)

      } catch (error) {
        console.log(error);      
      }
    };
    fetchEvent();

  },[eventId]);

  if(!event) return <Loader/>

  return (
  <div className="min-h-screen bg-black text-white px-8 py-12">
    <div className="max-w-6xl mx-auto">

      <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">
          <span className="inline-block px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            Event
          </span>

          <h1 className="text-5xl font-bold mt-6">
            {event.name}
          </h1>

          <p className="mt-6 text-gray-300 text-lg leading-8 max-w-3xl">
            {event.description}
          </p>

          <button
            onClick={handleRsvp}
            className={`mt-10 inline-block px-8 py-4 rounded-2xl font-semibold cursor-pointer transition shadow-lg ${
              isRsvped
                ? "bg-white/10 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                : "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
            }`}
          >
            {isRsvped ? "Cancel RSVP" : "RSVP Event"}
          </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400 text-sm">City</p>
            <h3 className="text-2xl font-semibold mt-2">
              {event.city}
            </h3>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400 text-sm">Venue</p>
            <h3 className="text-2xl font-semibold mt-2">
              {event.venue}
            </h3>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400 text-sm">Date</p>
            <h3 className="text-2xl font-semibold mt-2">
              {new Date(event.time).toLocaleDateString()}
            </h3>
        </div>
        

      </div>

    </div>
    
  </div>
  );
};

export default EventDetailPage;
