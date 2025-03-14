import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../features/authSlice'
import dDayReducer from '../features/dDaySlice'
import mindsetReducer from '../features/mindsetSlice'
import pointReducer from '../features/pointSlice'
import captchaReducer from '../features/captchaSlice'
import goalsReducer from '../features/goalsSlice'
import studygroupReducer from '../features/studygroupSlice'
import itemReducer from '../features/itemSlice'
import postReducer from '../features/postSlice'
import conmmetReducer from '../features/commentSlice'
import bannedReducer from '../features/bannedSlice'
import adminpostReducer from '../features/adminpostSlice'
import studyLikeSliceReducer from '../features/likedSlice'
import groupmemberSliceReducer from '../features/groupmemberSlice'
import timeReducer from '../features/timeSlice'
import screenShareReducer from '../features/screenShareSlice'
import grouptimeReducer from '../features/grouptimeSlice'
import notiReducer from '../features/notiSlice'
import studyListReducer from '../features/studyListSlice'

const store = configureStore({
   reducer: {
      auth: authReducer, // authSlice를 포함시킴
      dDay: dDayReducer,
      mindset: mindsetReducer,
      points: pointReducer,
      captcha: captchaReducer,
      goals: goalsReducer,
      studygroups: studygroupReducer,
      items: itemReducer,
      posts: postReducer,
      comments: conmmetReducer,
      banned: bannedReducer,
      adminpost: adminpostReducer,
      studyLike: studyLikeSliceReducer,
      groupmembers: groupmemberSliceReducer,
      time: timeReducer,
      screenShare: screenShareReducer,
      grouptime: grouptimeReducer,
      noti: notiReducer,
      studyList: studyListReducer,
   },
})

export default store
