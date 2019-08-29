import axios from 'axios';
import { BASE_URI, API_URL } from '../constants/defaultValues';


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
    throw error.response.data.error;
  }
}


export async function getEmployee(id) {
  try {
    const data  = await axiosInstance.get(`/employees/${id}`);
    return data.data;
  } catch (error) {
    throw error.response.data.error;
  }
}


export async function createEmployee(employee) {
  try {
    const data  = await axiosInstance.post('/employees', employee);
    return data.data;
  } catch (error) {
    throw error.response.data.error;
  }
}


export async function updateEmployee(id, employee) {
  try {
    const data  = await axiosInstance.put(`/employees/${id}`, employee);
    return data.data;
  } catch (error) {
    throw error.response.data.error;
  }
}