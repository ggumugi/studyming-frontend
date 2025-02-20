import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../features/authSlice'
import dDayReducer from '../features/dDaySlice'
import mindsetReducer from '../features/mindsetSlice'
import pointReducer from '../features/pointSlice'
import captchaReducer from '../features/captchaSlice'
import goalsReducer from '../features/goalsSlice'
import studygroupReducer from '../features/studygroupSlice'
import itemReducer from '../features/itemSlice'
<<<<<<< HEAD
import postReducer from '../features/postSlice'
=======
>>>>>>> 3016d6eb5da48341d84a5705eca3d9dbfedba786

const store = configureStore({
   reducer: {
      auth: authReducer, // authSlice를 포함시킴
      dDay: dDayReducer,
      mindset: mindsetReducer,
      points: pointReducer,
      captcha: captchaReducer,
      goals: goalsReducer,
      studygroup: studygroupReducer,
      items: itemReducer,
<<<<<<< HEAD
      posts: postReducer,
=======
>>>>>>> 3016d6eb5da48341d84a5705eca3d9dbfedba786
   },
})

export default store
