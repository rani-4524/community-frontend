import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import communitiesReducer from './slices/communitiesSlice';
import eventReducer from './slices/eventSlice'

const store = configureStore({
   reducer:{
     auth:authReducer,
     community:communitiesReducer,
     event:eventReducer
   }
})

export default store;