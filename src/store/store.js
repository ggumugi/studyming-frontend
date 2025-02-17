import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../features/authSlice'
import ddayReducer from '../features/ddaySlice'

const store = configureStore({
   reducer: {
      auth: authReducer, // authSlice를 포함시킴
      dday: ddayReducer,
   },
})

export default store
