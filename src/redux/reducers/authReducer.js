// authReducer.js
import { LOGIN_SUCCESS } from '../actions/authActions';

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    // Add other cases for different actions if needed

    default:
      return state;
  }
};

export default authReducer;
