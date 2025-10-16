import axiosInstance from './axios'

export const persistAdmin = async () => {
  const user = await axiosInstance.get('/auth/doctor/persist')
  return user.data.user
}

export const persistPatients = async (id: string) => {
  const patients = await axiosInstance.get(`/doctor/get-patients?id=${id}`)
  return patients.data.patients
}
