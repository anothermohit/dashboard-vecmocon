// reducers.js

import { UPDATE_SERIES_DATA, UPDATE_SERIES_SHADOW } from '../actions/seriesActions';

// Define the initial state for seriesData
const initialState = {
  seriesData: [], // You can initialize it with your initial data if needed
};

// Reducer function to update seriesData
const seriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SERIES_DATA:
      // Update the seriesData in the store with the new data
      return {
        ...state,
        seriesData: action.payload,
      };

    case UPDATE_SERIES_SHADOW:
      // Update the seriesShadow in the store with the new data
      return {
        ...state,
        seriesShadow: action.payload,
      };
    default:
      return state;
  }
};

export default seriesReducer;
