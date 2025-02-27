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
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            // 모든 screenShare 관련 액션 무시
            ignoredActions: ['screenShare/start/fulfilled', 'screenShare/addStreamToState', 'screenShare/removeStreamFromState'],
            // 스트림 관련 모든 경로 무시
            ignoredPaths: ['screenShare.streams', 'payload.stream'],
         },
      }),
})

export default store
