import { configureStore } from '@reduxjs/toolkit'
import adminReducer from './slices/admin.slice'
import patientsReducer from './slices/patients.slice'
import patientReducer from './slices/patient.slice'

export const store = configureStore({
  reducer: {
    adminReducer: adminReducer,
    patientsReducer: patientsReducer,
    patientReducer: patientReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
