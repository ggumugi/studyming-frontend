// import { useState, useCallback } from 'react'
// import BoardSidebar from '../components/sidebar/BoardSidebar'
// import BoardCreate from '../components/board/BoardCreate'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom' // useNavigate import

// import { createPostThunk } from '../features/postSlice'

// function BoardCreatePage({ isAuthenticated, user }) {
//    const dispatch = useDispatch()
//    const navigate = useNavigate()
//    const category = useSelector((state) => state.posts.category) // ✅ Redux에서 선택된 카테고리 가져오기

//    const handleSubmit = useCallback(
//       (formData) => {
//          if (!isAuthenticated) {
//             alert('로그인이 필요합니다.')
//             navigate('/login')
//             return
//          }

//          dispatch(createPostThunk(formData))
//             .unwrap()
//             .then((post) => {
//                alert('게시글이 등록되었습니다!')
//                navigate(`/board/detail/${post.id}`)
//             })
//             .catch((error) => {
//                console.error('게시글 등록 실패:', error)
//                alert(`게시글 등록 실패: ${error?.message || '알 수 없는 오류'}`)
//             })
//       },
//       [dispatch, navigate, isAuthenticated]
//    )

//    return (
//       <div style={{ display: 'flex' }}>
//          {' '}
//          {/* ✅ flex 적용 */}
//          <BoardSidebar />
//          <BoardCreate user={user} onSubmit={handleSubmit} isAuthenticated={isAuthenticated} category={category} />
//       </div>
//    )
// }

// export default BoardCreatePage

import { useState, useCallback, useEffect } from 'react'
import BoardSidebar from '../components/sidebar/BoardSidebar'
import BoardCreate from '../components/board/BoardCreate'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom' // ✅ useParams 추가
import styled from 'styled-components'

import { createPostThunk, updatePostThunk, fetchPostByIdThunk } from '../features/postSlice'

function BoardCreatePage({ isAuthenticated, user }) {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams() // ✅ 수정 모드일 경우 postId 가져오기
   const category = useSelector((state) => state.posts.category)
   const post = useSelector((state) => state.posts.post) // ✅ 수정 시 기존 게시글 데이터 가져오기

   /*  // ✅ 수정 모드일 경우 기존 게시글 불러오기
   useEffect(() => {
      if (id) {
         dispatch(fetchPostByIdThunk(id))
      }
   }, [dispatch, id]) */

   const handleSubmit = useCallback(
      (formData) => {
         if (!isAuthenticated) {
            alert('로그인이 필요합니다.')
            navigate('/login')
            return
         }
         /* 
         if (id) {
            // ✅ 수정 모드
            dispatch(updatePostThunk({ id, postData: formData }))
               .unwrap()
               .then(() => {
                  alert('게시글이 수정되었습니다!')
                  navigate(`/board/detail/${id}`)
               })
               .catch((error) => {
                  console.error('게시글 수정 실패:', error)
                  alert(`게시글 수정 실패: ${error?.message || '알 수 없는 오류'}`)
               })
         } else { */
         // ✅ 등록 모드
         dispatch(createPostThunk(formData))
            .unwrap()
            .then((post) => {
               alert('게시글이 등록되었습니다!')
               navigate(`/board/detail/${post.id}`)
            })
            .catch((error) => {
               console.error('게시글 등록 실패:', error)
               alert(`게시글 등록 실패: ${error?.message || '알 수 없는 오류'}`)
            })
         /*   } */
      },
      [dispatch, navigate, isAuthenticated, id]
   )

   return (
      <BoardContainer>
         <BoardSidebar />
         {/* ✅ post가 있으면 수정, 없으면 등록 */}
         <BoardCreate user={user} onSubmit={handleSubmit} isAuthenticated={isAuthenticated} category={category} initialValues={post} />
      </BoardContainer>
   )
}
const BoardContainer = styled.div`
   display: flex;
   flex-direction: row;
   width: 100%;

   @media (max-width: 965px) {
      flex-direction: column !important;
   }
`
export default BoardCreatePage
