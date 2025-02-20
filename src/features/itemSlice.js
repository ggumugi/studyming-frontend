import { createItem, getItems, updateItem } from '../api/itemApi'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ✅ 상품 등록
export const createItemThunk = createAsyncThunk('items/createItem', async (itemData, { rejectWithValue }) => {
   const response = await createItem(itemData)
   if (response.error) return rejectWithValue(response.error)
   return response.item
})

// ✅ 아이템 수정 Thunk
export const updateItemThunk = createAsyncThunk('items/updateItem', async ({ id, updatedData }, { rejectWithValue }) => {
   const response = await updateItem(id, updatedData)
   if (response.error) return rejectWithValue(response.error)
   return response
})

// ✅ 상품 목록 가져오기
export const fetchItems = createAsyncThunk('items/fetchItems', async (_, { rejectWithValue }) => {
   const response = await getItems()
   if (response.error) return rejectWithValue(response.error)
   return response.items
})

const itemSlice = createSlice({
   name: 'items',
   initialState: {
      items: [],
      selectedItem: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 상품 등록
         .addCase(createItemThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createItemThunk.fulfilled, (state, action) => {
            state.loading = false
            state.items.push(action.payload)
         })
         .addCase(createItemThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 상품 수정
         .addCase(updateItemThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateItemThunk.fulfilled, (state, action) => {
            state.loading = false
            const index = state.items.findIndex((item) => item.id === action.payload.id)
            if (index !== -1) {
               state.items[index] = action.payload // ✅ Redux 상태 업데이트
            }
         })
         .addCase(updateItemThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 상품 목록 조회
         .addCase(fetchItems.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchItems.fulfilled, (state, action) => {
            state.loading = false
            state.items = action.payload
         })
         .addCase(fetchItems.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default itemSlice.reducer
