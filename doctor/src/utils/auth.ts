import axiosInstance from './axios'

export const persistAdmin = async () => {
  const user = await axiosInstance.get('/auth/doctor/persist')
  return user.data.user
}

export const persistPatients = async (id: string) => {
  const patients = await axiosInstance.get(`/doctor/get-patients?id=${id}`)
  return patients.data.patients
}

export const persistPatientWithMemories = async (id: string) => {
  try {
    const [patientRes, memoriesRes] = await Promise.all([
      axiosInstance.get(`/patient/${id}`),
      axiosInstance.get(`/memory/patient/${id}`),
    ])

    const patient = patientRes.data.patient
    const memories = memoriesRes.data.memories || []

    return { ...patient, memories }
  } catch (error: any) {
    console.error('Error fetching patient and memories:', error)
    throw new Error(
      error.response?.data?.message || 'Failed to fetch patient details.',
    )
  }
}
