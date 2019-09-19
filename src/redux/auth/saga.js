import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { API_URL, BASE_URI } from '../../constants/defaultValues';
import axios from 'axios';

import {
  LOGIN_USER,
  LOGOUT_USER
} from '../actions';

import {
  loginUserSuccess,
  loginUserFail
} from './actions';


const loginWithCredentialsAsync = async (login, password) => {
  try {
    const response = await axios.post(API_URL + BASE_URI + '/login', {login, password});
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.error : error.message;
  } 
}


function* loginWithCredentials({ payload }) {
  
  const { login, password } = payload.user;
  const { history } = payload;
  try {
      const data = yield call(loginWithCredentialsAsync, login, password);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      yield put(loginUserSuccess(data.user));
      history.push('/');
  } catch (error) {
    yield put(loginUserFail(error));
  }
}


const logoutAsync = async (history) => {
  const token = localStorage.getItem('token');
  await axios.get(API_URL + BASE_URI + '/logout').then(authUser => authUser).catch(error => error);
  history.push('/')
}

function* logout({payload}) {
  const { history } = payload
  try {
      yield call(logoutAsync,history);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
  } catch (error) {
    
  }
}

export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, loginWithCredentials);
}

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logout);
}

export default function* rootSaga() {
  yield all([
      fork(watchLoginUser),
      fork(watchLogoutUser),
  ]);
}