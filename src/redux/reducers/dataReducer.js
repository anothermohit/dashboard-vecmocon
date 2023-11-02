
// redux/reducers/dataReducer.js

const initialState = {
    dataItems: [],
  };
  
  const dataReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_DATA_ITEMS':
        return {
          ...state,
          dataItems: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default dataReducer;
  