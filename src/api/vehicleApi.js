import axios from 'axios';
import { BASE_URI, API_URL } from '../constants/defaultValues';

function getAxiosIntance() {
    const axiosInstance = axios.create({
      baseURL: API_URL + BASE_URI,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    return axiosInstance;
}
export async function getVehicles(pageSize, page, orderBy, search) {
    try {
      const data  = await getAxiosIntance().get(`/vehicles?pageSize=${pageSize}
          &page=${page}
          &orderBy=${orderBy}
          &search=${search}`
        );
      return data.data;
    } catch (error) {
      throw error.response ? error.response.data.error : error.message;
    }
}
export async function getVehicle(id) {
  try {
      const data  = await getAxiosIntance().get(`vehicles/${id}`);
      return data.data;
  } catch (error) {
      throw error.response ? error.response.data.error : error.message;
  }
}
export async function createVehicle(vehicle){
    try {
        const data  = await getAxiosIntance().post('vehicles', getFormData(vehicle));
        return data.data;
    } catch (error) {
        throw error.response ? error.response.data.error : error.message;
    }
}
export async function updateVehicle(vehicleId, vehicle) {
    try {
        const data  = await getAxiosIntance().post(`vehicles/${vehicleId}`, getFormData(vehicle, 'PUT'));
        return data.data;
    } catch (error) {
        throw error.response ? error.response.data.error : error.message;
    }
}
export async function deleteVehicle(id) {
  try {
    const data  = await getAxiosIntance().delete(`/vehicles/${id}`);
    return data.data;
  } catch (error) {
    throw error.response ? error.response.data.error : error.message;
  }
}
export async function addCustomer(vehicleId, customerId){
  try {
    const data  = await getAxiosIntance().post(`/vehicles/${vehicleId}/customers`,  getFormData({customer_id:customerId}));
    return data.data;
  } catch (error) {
    throw error.response ? error.response.data.error : error.message;
  }
}
export async function deleteCustomer(vehicleId, customerId){
  try {
    const data  = await getAxiosIntance().delete(`/vehicles/${vehicleId}/customers/${customerId}`);
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