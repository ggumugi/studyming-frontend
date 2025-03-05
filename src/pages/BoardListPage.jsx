import { useCallback, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BoardSidebar from '../components/sidebar/BoardSidebar'
import BoardList from '../components/board/BoardList'
import { fetchPostsThunk } from '../features/postSlice'
import styled from 'styled-components'

function BoardListPage() {
   const dispatch = useDispatch()
   const category = useSelector((state) => state.posts.category)

   useEffect(() => {
      dispatch(fetchPostsThunk({ page: 1, category })) // ✅ Redux 상태가 변경될 때마다 fetchPosts 실행
   }, [dispatch, category]) // ✅ category 변경 감지

   return (
      <BoardContainer>
         <BoardSidebar />
         <BoardList category={category} />
      </BoardContainer>
   )
}
/* 965 */
export default BoardListPage

const BoardContainer = styled.div`
   display: flex;
   flex-direction: row;
   width: 100%;

   @media (max-width: 965px) {
      flex-direction: column; /* 화면이 965px 이하일 때 상하 정렬 */
   }
`
