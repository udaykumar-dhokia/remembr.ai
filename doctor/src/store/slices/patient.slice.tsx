import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type Patient = {
  _id?: string
  name: string
  email: string
  password: string
  memories?: any[]
}

interface IPatients {
  patients: Patient[] | null
}

const initialState: IPatients = {
  patients: null,
}

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload
    },
  },
})

export const { setPatients } = patientSlice.actions
export default patientSlice.reducer
