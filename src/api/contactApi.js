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


export async function createContact(contact) {
  try {
    const data  = await getAxiosIntance().post('contacts', getFormData(contact));
    return data.data;
  } catch (error) {
    throw error.response ? error.response.data.error : error.message;
  }
}

export async function updateContact(id, contact) {
  try {
    const data  = await getAxiosIntance().post(`contacts/${id}`, getFormData(contact, 'PUT'));
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