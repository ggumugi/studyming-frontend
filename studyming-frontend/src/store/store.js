import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'

const store = configureStore({
   reducer: {
      auth: authReducer, // authSlice를 포함시킴
   },
})

export default store
