import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type Memory = {
  _id?: string
  patient: string
  doctor: string
  vectorId: string
  text: string
  images: []
}

type Patient = {
  _id?: string
  name: string
  email: string
  password: string
  memories?: Memory[]
}

interface IPatients {
  patient: Patient | null
}

const initialState: IPatients = {
  patient: null,
}

const patientsSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setPatient: (state, action: PayloadAction<Patient>) => {
      state.patient = action.payload
    },
    resetPatient: (state) => {
      state.patient = null
    },
    addMemory: (state, action: PayloadAction<Memory>) => {
      if (!state.patient) return
      if (!state.patient.memories) {
        state.patient.memories = []
      }
      state.patient.memories.push(action.payload)
    },
  },
})

export const { setPatient, addMemory } = patientsSlice.actions
export default patientsSlice.reducer
