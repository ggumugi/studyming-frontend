import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createGroupMember, deleteGroupMember, updateGroupMember, getGroupMembers, getGroupMemberById, participateInGroup } from '../api/groupmemberApi'

// 그룹 멤버 전체 불러오기
export const fetchGroupMembersThunk = createAsyncThunk('groupmembers/fetchAll', async (groupId, { rejectWithValue }) => {
   try {
      const response = await getGroupMembers(groupId)
      console.log('response.data:', response.data)
      return response.data // 그룹 멤버 데이터를 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '그룹 멤버 목록 불러오기 실패')
   }
})

// 그룹 멤버 가입
export const createGroupMemberThunk = createAsyncThunk('groupmembers/create', async ({ groupId }, { rejectWithValue }) => {
   try {
      const response = await createGroupMember(groupId)
      return response.data // 생성된 그룹 멤버 데이터를 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '그룹 멤버 가입 실패')
   }
})

// 그룹 멤버 참여
export const participateInGroupThunk = createAsyncThunk('groupmembers/participate', async ({ groupId, status }, { rejectWithValue }) => {
   try {
      const response = await participateInGroup(groupId, status) // API 호출 함수
      return response.data // 응답 데이터 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '그룹 멤버 상태 변경 실패')
   }
})

// 그룹 멤버 탈퇴
export const deleteGroupMemberThunk = createAsyncThunk('groupmembers/delete', async ({ groupId, userId }, { rejectWithValue }) => {
   try {
      await deleteGroupMember(groupId, userId)
      return userId // 삭제된 멤버의 userId 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '그룹 멤버 탈퇴 실패')
   }
})

// 그룹 멤버 정보 업데이트
export const updateGroupMemberThunk = createAsyncThunk('groupmembers/update', async ({ groupId, userId, updateData }, { rejectWithValue }) => {
   try {
      const response = await updateGroupMember(groupId, userId, updateData)
      return response.data // 업데이트된 멤버 데이터를 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '그룹 멤버 정보 업데이트 실패')
   }
})

// 특정 그룹 멤버 가져오기
export const fetchGroupMemberByIdThunk = createAsyncThunk('groupmembers/fetchById', async ({ groupId, userId }, { rejectWithValue }) => {
   try {
      const response = await getGroupMemberById(groupId, userId)
      return response.data // 특정 그룹 멤버 데이터를 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '그룹 멤버 조회 실패')
   }
})

// 슬라이스 생성
const groupmemberSlice = createSlice({
   name: 'groupmembers',
   initialState: {
      groupmembers: [],
      groupmember: [],
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 그룹 멤버 전체 불러오기
      builder
         .addCase(fetchGroupMembersThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchGroupMembersThunk.fulfilled, (state, action) => {
            state.loading = false
            state.groupmember = action.payload // 그룹 멤버 목록 업데이트
         })
         .addCase(fetchGroupMembersThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 그룹 멤버 가입
         .addCase(createGroupMemberThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createGroupMemberThunk.fulfilled, (state, action) => {
            state.loading = false
            state.groupmembers.push(action.payload) // 새로 생성된 그룹 멤버 추가
         })
         .addCase(createGroupMemberThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(participateInGroupThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(participateInGroupThunk.fulfilled, (state, action) => {
            state.loading = false
            state.groupmember = action.payload // 그룹 멤버 목록 업데이트
         })
         .addCase(participateInGroupThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 그룹 멤버 탈퇴
         .addCase(deleteGroupMemberThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteGroupMemberThunk.fulfilled, (state, action) => {
            state.loading = false
            state.groupmembers = state.groupmembers.filter((member) => member.userId !== action.payload) // 삭제된 멤버 제거
         })
         .addCase(deleteGroupMemberThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 그룹 멤버 정보 업데이트
         .addCase(updateGroupMemberThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateGroupMemberThunk.fulfilled, (state, action) => {
            state.loading = false
            const index = state.groupmembers.findIndex((member) => member.userId === action.payload.userId)
            if (index !== -1) {
               state.groupmembers[index] = action.payload // 업데이트된 그룹 멤버로 교체
            }
         })
         .addCase(updateGroupMemberThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 특정 그룹 멤버 가져오기
         .addCase(fetchGroupMemberByIdThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchGroupMemberByIdThunk.fulfilled, (state, action) => {
            state.loading = false
            state.groupmember = action.payload // 특정 그룹 멤버 정보 업데이트
         })
         .addCase(fetchGroupMemberByIdThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default groupmemberSlice.reducer
