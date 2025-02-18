import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../features/authSlice'
import dDayReducer from '../features/dDaySlice'

const store = configureStore({
   reducer: {
      auth: authReducer, // authSlice를 포함시킴
      dDay: dDayReducer,
   },
})

export default store
