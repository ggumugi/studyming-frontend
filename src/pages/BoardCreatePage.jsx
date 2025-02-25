import { useState, useCallback } from 'react'
import BoardSidebar from '../components/sidebar/BoardSidebar'
import BoardCreate from '../components/board/BoardCreate'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom' // useNavigate import

import { createPostThunk } from '../features/postSlice'

function BoardCreatePage({ isAuthenticated, user }) {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const category = useSelector((state) => state.posts.category) // ✅ Redux에서 선택된 카테고리 가져오기

   const handleSubmit = useCallback(
      (formData) => {
         if (!isAuthenticated) {
            alert('로그인이 필요합니다.')
            navigate('/login')
            return
         }

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
      },
      [dispatch, navigate, isAuthenticated]
   )

   return (
      <div style={{ display: 'flex' }}>
         {' '}
         {/* ✅ flex 적용 */}
         <BoardSidebar />
         <BoardCreate user={user} onSubmit={handleSubmit} isAuthenticated={isAuthenticated} category={category} />
      </div>
   )
}

export default BoardCreatePage
