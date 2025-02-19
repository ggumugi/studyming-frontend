import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../features/authSlice'
import dDayReducer from '../features/dDaySlice'
import mindsetReducer from '../features/mindsetSlice'
import pointReducer from '../features/pointSlice'
import goalsReducer from '../features/goalsSlice'
import studygroupReducer from '../features/studygroupSlice'
import itemReducer from '../features/itemSlice'

const store = configureStore({
   reducer: {
      auth: authReducer, // authSlice를 포함시킴
      dDay: dDayReducer,
      mindset: mindsetReducer,
      points: pointReducer,
      goals: goalsReducer,
      studygroup: studygroupReducer,
      items: itemReducer,
   },
})

export default store
