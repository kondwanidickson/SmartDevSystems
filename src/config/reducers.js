// Get user from localstorage
const user = JSON.parse(localStorage.getItem('idsys_smartlancer_user'))

const initialState = {
    loading: false,
    data: null,
    error: null,
    user: user ? user : null,
};
  
const dataReducer = (state, action) => {
    state = initialState;

    switch (action.type) {
        case 'GET_DATA_REQUEST':
        case 'POST_DATA_REQUEST':
            return {
                ...state,
                loading: true,
            };
        case 'GET_DATA_SUCCESS':
        case 'POST_DATA_SUCCESS':
            if (action.payload.me) {
                localStorage.setItem('idsys_smartlancer_user', JSON.stringify(action.payload.me))
                return {
                    ...state,
                    loading: false,
                    data: null,
                    user: action.payload.me,
                    error: null,
                };
            }
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case 'GET_DATA_FAILURE':
        case 'POST_DATA_FAILURE':
            return {
                ...state,
                loading: false,
                data: null,
                error: action.payload,
            };
        case 'RESET_DATA':
            return {
                ...state,
                loading: false,
                data: null,
                error: null,
            };
        case 'RESET_ALL':
            return {
                loading: false,
                data: null,
                error: null,
                user: null,
            };
        default:
            return state;
    }
};

export default dataReducer;  