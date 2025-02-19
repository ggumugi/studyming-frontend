import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../features/authSlice'
import dDayReducer from '../features/dDaySlice'
import mindsetReducer from '../features/mindsetSlice'
import pointReducer from '../features/pointSlice'
<<<<<<< HEAD
import captchaReducer from '../features/captchaSlice'
=======
import goalsReducer from '../features/goalsSlice'
import studygroupReducer from '../features/studygroupSlice'
import itemReducer from '../features/itemSlice'
>>>>>>> 8bfaecd75c6c733f2c2ddbd399b4e2112efc76ec

const store = configureStore({
   reducer: {
      auth: authReducer, // authSlice를 포함시킴
      dDay: dDayReducer,
      mindset: mindsetReducer,
      points: pointReducer,
<<<<<<< HEAD
      captcha: captchaReducer,
=======
      goals: goalsReducer,
      studygroup: studygroupReducer,
      items: itemReducer,
>>>>>>> 8bfaecd75c6c733f2c2ddbd399b4e2112efc76ec
   },
})

export default store
