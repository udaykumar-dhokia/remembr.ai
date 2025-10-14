import axiosInstance from './axios'

export const persistAdmin = async () => {
  return (await axiosInstance.get('/auth/doctor/persist')).data
}
