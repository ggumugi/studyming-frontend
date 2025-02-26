import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import BoardSidebar from '../components/sidebar/BoardSidebar'
import BoardCreate from '../components/board/BoardCreate'
import { fetchPostByIdThunk, updatePostThunk } from '../features/postSlice'

function BoardEditPage({ isAuthenticated, user }) {
   const { id } = useParams()
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [selectedCategory, setSelectedCategory] = useState('free')
   const post = useSelector((state) => state.posts.post)

   useEffect(() => {
      dispatch(fetchPostByIdThunk(id))
   }, [dispatch, id])

   const handleSubmit = useCallback(
      (formData) => {
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
      },
      [dispatch, navigate, id]
   )

   return (
      <div style={{ display: 'flex' }}>
         <BoardSidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
         {post && <BoardCreate user={user} onSubmit={handleSubmit} isAuthenticated={isAuthenticated} selectedCategory={selectedCategory} initialValues={post} />}
      </div>
   )
}

export default BoardEditPage
