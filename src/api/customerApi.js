import axios from 'axios';
import { BASE_URI, API_URL } from '../constants/defaultValues';
import FormData from 'form-data'

const axiosInstance = axios.create({
  baseURL: API_URL + BASE_URI,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
});

export async function getCustomers(pageSize, page, orderBy, search) {
  try {
    const data  = await axiosInstance.get(`/customers?pageSize=${pageSize}
        &page=${page}
        &orderBy=${orderBy}
        &search=${search}`
      );
    return data.data;
  } catch (error) {
    throw error.response.data.error;
  }
}


export async function getCustomer(id) {
  try {
    const data  = await axiosInstance.get(`/customers/${id}`);
    return data.data;
  } catch (error) {
    throw error.response.data.error;
  }
}


export async function createCustomer(customer) {
  try {
    const data  = await axiosInstance.post('/customers', getFormData(customer));
    return data.data;
  } catch (error) {
    throw error.response.data.error;
  }
}

export async function updateCustomer(id, customer) {
  try {
    const data  = await axiosInstance.post(`/customers/${id}`, getFormData(customer, 'PUT'));
    return data.data;
  } catch (error) {
    throw error.response.data.error || error.response.data.message;
  }
}

export async function deleteCustomer(id) {
  try {
    const data  = await axiosInstance.delete(`/customers/${id}`);
    return data.data;
  } catch (error) {
    throw error.response.data.error;
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