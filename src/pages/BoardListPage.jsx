import { useCallback, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BoardSidebar from '../components/sidebar/BoardSidebar'
import BoardList from '../components/board/BoardList'
import { fetchPostsThunk } from '../features/postSlice'

function BoardListPage() {
   const dispatch = useDispatch()
   const category = useSelector((state) => state.posts.category)

   useEffect(() => {
      dispatch(fetchPostsThunk({ page: 1, category })) // ✅ Redux 상태가 변경될 때마다 fetchPosts 실행
   }, [dispatch, category]) // ✅ category 변경 감지

   return (
      <div style={{ display: 'flex' }}>
         <BoardSidebar />
         <BoardList />
      </div>
   )
}

export default BoardListPage
