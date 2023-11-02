// redux/actions/dataActions.js

export const updateDataItems = (items) => {
  return {
    type: 'UPDATE_DATA_ITEMS',
    payload: items,
  };
};
