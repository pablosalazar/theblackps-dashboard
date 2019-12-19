import axios from 'axios';
import { BASE_URI, API_URL } from '../constants/defaultValues';
import FormData from 'form-data'


function getAxiosIntance() {
  const axiosInstance = axios.create({
    baseURL: API_URL + BASE_URI,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });

  return axiosInstance;
}


export async function createUser(user) {
  try {
    const data  = await getAxiosIntance().post('users', getFormData(user));
    return data.data;
  } catch (error) {
    throw error.response ? error.response.data.error : error.message;
  }
}

export async function updateUser(id, employee) {
  try {
    const data  = await getAxiosIntance().post(`users/${id}`, getFormData(employee, 'PUT'));
    return data.data;
  } catch (error) {
    throw error.response ? error.response.data.error : error.message;
  }
}

function getFormData(object, method) {
  const formData = new FormData();

  Object.keys(object).forEach(key => formData.append(key, object[key]));
  if (method === 'PUT') {
    formData.append('_method', 'PUT');
  }
  return formData;
}