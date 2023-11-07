// actions.js

// Define an action type
export const UPDATE_SERIES_DATA = "UPDATE_SERIES_DATA";
export const UPDATE_SERIES_SHADOW = "UPDATE_SERIES_SHADOW";

// Action creator for updating series data
export const updateSeriesData = (newSeriesData) => {
  return {
    type: UPDATE_SERIES_DATA,
    payload: newSeriesData,
  };
};

export const updateSeriesShadow = (newSeriesShadow) => {
  return {
    type: UPDATE_SERIES_SHADOW,
    payload: newSeriesShadow,
  };
};
