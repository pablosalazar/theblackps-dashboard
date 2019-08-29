import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGOUT_USER
} from '../actions';

const INIT_STATE = {
  user: localStorage.getItem('user'),
  loading: false,
  error: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loading: true, error: null };
    case LOGIN_USER_SUCCESS:
      return { ...state, loading: false, user: action.payload };
    case LOGIN_USER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case LOGOUT_USER:
      return { ...state, user: null};
    default: return { ...state };
  }
}
