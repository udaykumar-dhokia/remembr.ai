import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type Admin = {
  _id?: string
  name: string
  email: string
  password: string
  patients: string[]
}

interface IAdmin {
  admin: Admin | null
  isAuthenticated: boolean
}

const initialState: IAdmin = {
  admin: null,
  isAuthenticated: false,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<Admin>) => {
      state.admin = action.payload
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.admin = null
      state.isAuthenticated = false
    },
  },
})

export const { setAdmin } = adminSlice.actions
export default adminSlice.reducer
