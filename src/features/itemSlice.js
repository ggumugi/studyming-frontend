import { createItem, getItems } from '../api/itemApi'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ✅ 상품 등록
export const createItemThunk = createAsyncThunk('items/createItem', async (itemData, { rejectWithValue }) => {
   const response = await createItem(itemData)
   if (response.error) return rejectWithValue(response.error)
   return response.item
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
