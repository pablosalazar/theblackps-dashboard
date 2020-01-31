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