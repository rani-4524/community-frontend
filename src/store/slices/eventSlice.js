// all event related tasks

import { createSlice } from "@reduxjs/toolkit";

// user -> rsvp , cancelRsvp , add , remove

const initialState = {
  allEvents: [],
  rsvpedEvents: [],
  myCreatedEvents: [], //created by current user who's also a host
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setAllEvents: (state, action) => {
      state.allEvents = action.payload;
    },
    rsvpedEvents: (state, action) => {
      const newEvent = action.payload;
      if (!state.rsvpedEvents.find((event) => event._id == newEvent._id))
        state.rsvpedEvents.push(action.payload);
    },

    cancelRsvp: (state, action) => {
      const { eventId } = action.payload;
      state.rsvpedEvents = state.rsvpedEvents.filter(
        (event) => event._id != eventId,
      );
    },

    createEvent: (state, action) => {
      const newEvent = action.payload;
      state.myCreatedEvents.push(newEvent);
      state.allEvents.push(newEvent);
    },
    deleteEvent: (state, action) => {
      const { eventId } = action.payload;
      state.myCreatedEvents = state.myCreatedEvents.filter(
        (event) => event._id != eventId,
      );
    },

    /* 
        this action will be called after successful login so that existing
        details (rsvpedEvents & myCreatedEvents ) can be prefilled so that our db data and store data can be same
         */

    /* 
        update POST /login api to send current user's rsvpedEvents & created events in response
         */

    setExistingEventsDetails: (state, action) => {
      const { rsvpedEvents, myCreatedEvents } = action.payload;
      state.rsvpedEvents = rsvpedEvents;
      state.myCreatedEvents = myCreatedEvents;
    },
  },
});

export default eventSlice.reducer;
export const {
  setAllEvents,
  rsvpedEvents,
  cancelRsvp,
  createEvent,
  deleteEvent,
  setExistingEventsDetails,
} = eventSlice.actions;
