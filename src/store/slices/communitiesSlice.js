// all community related tasks
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCommunities: [],
  joinedCommunities: [],
  hostedCommunities: [],
};

/* 
sampleCommunity = {
_id:3,
name:'chess',
description:.....
}
 */

const communitiesSlice = createSlice({
  name: "communities",
  initialState,
  reducers: {
    setAllCommunities: (state, action) => {
      state.allCommunities = action.payload;
    },
    joinCommunity: (state, action) => {
      if (
        !state.joinedCommunities.find(
          (community) => community._id == action.payload._id,
        )
      )
        state.joinedCommunities.push(action.payload);
    },

    leaveCommunity: (state, action) => {
      const { communityId } = action.payload;
      state.joinedCommunities = state.joinedCommunities.filter(
        (community) => community._id != communityId,
      );
    },

    createCommunity: (state, action) => {
      const { newCommunity } = action.payload;
      state.hostedCommunities.push(newCommunity);
      state.allCommunities.push(newCommunity)
    },
    deleteCommunity: (state, action) => {
      const { communityId } = action.payload;
      state.hostedCommunities = state.hostedCommunities.filter(
        (community) => community._id != communityId,
      );
    },

    setExistingCommunitiesDetails: (state, action) => {
      const { joinedCommunities, hostedCommunities } = action.payload;
      state.joinedCommunities = joinedCommunities;
      state.hostedCommunities = hostedCommunities;
    },
  },
});

export const {
  setAllCommunities,
  joinCommunity,
  leaveCommunity,
  deleteCommunity,
  createCommunity,
  setExistingCommunitiesDetails,
} = communitiesSlice.actions;
export default communitiesSlice.reducer;
