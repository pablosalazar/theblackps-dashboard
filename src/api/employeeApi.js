import axios from 'axios';
import { BASE_URI, API_URL } from '../constants/defaultValues';
import FormData from 'form-data'

const axiosInstance = axios.create({
  baseURL: API_URL + BASE_URI,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
});

export async function getEmployees(pageSize, page, orderBy, search) {
  try {
    const data  = await axiosInstance.get(`/employees?pageSize=${pageSize}
        &page=${page}
        &orderBy=${orderBy}
        &search=${search}`
      ); 
    return data.data;
  } catch (error) {
    throw error.response ? error.response.data.error : error.message;
  }
}


export async function getEmployee(id) {
  try {
    const data  = await axiosInstance.get(`/employees/${id}`);
    return data.data;
  } catch (error) {
    throw error.response ? error.response.data.error : error.message;
  }
}


export async function createEmployee(employee) {
  try {
    const data  = await axiosInstance.post('/employees', getFormData(employee));
    return data.data;
  } catch (error) {
    throw error.response ? error.response.data.error : error.message;
  }
}

export async function updateEmployee(id, employee) {
  try {
    const data  = await axiosInstance.post(`/employees/${id}`, getFormData(employee, 'PUT'));
    return data.data;
  } catch (error) {
    throw error.response ? error.response.data.error : error.message;
  }
}

export async function deleteEmployee(id) {
  try {
    const data  = await axiosInstance.delete(`/employees/${id}`);
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