import { combineReducers } from 'redux';
import authUser from './auth/reducer';
import menu from './menu/reducer';

const reducers = combineReducers({
  menu,
  authUser
});

export default reducers;