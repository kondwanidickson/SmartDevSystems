import axios from './instance';

export const getData = (url) => async (dispatch) => {
  dispatch({ type: 'GET_DATA_REQUEST' });

  try {
    const response = await axios.get(url);
    dispatch({
      type: 'GET_DATA_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: 'GET_DATA_FAILURE',
      payload: { 
        type: 'error', 
        message: (error.response && 
          error.response.data &&
          error.response.data.message) || 
            error.message ||
              error.toString() 
      },
    });
  }
};

export const postData = (url, data) => async (dispatch) => {
  dispatch({ type: 'POST_DATA_REQUEST' });

  try {
    const response = await axios.post(url, data);
    dispatch({
      type: 'POST_DATA_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: 'POST_DATA_FAILURE',
      payload: { 
        type: 'error', 
        message: (error.response && 
          error.response.data &&
          error.response.data.message) || 
            error.message ||
              error.toString() 
      },
    });
  }
};

export const resetData = () => async (dispatch) => {
  dispatch({
      type: 'RESET_DATA',
      payload: null,
  })
}

export const resetAll = () => async (dispatch) => {
  dispatch({
      type: 'RESET_ALL',
  })
}
