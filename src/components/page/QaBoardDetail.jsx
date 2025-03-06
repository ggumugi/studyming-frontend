import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'

import { fetchPostsThunk, deletePostThunk } from '../../features/postSlice'
import { createCommentThunk } from '../../features/commentSlice'
import { Paper, Typography, Button, TextField, Box } from '@mui/material'

const QaBoardtDetail = ({ post, onBack }) => {
   const [comments, setComments] = useState([
      { id: 1, author: '식원강', text: '저요', date: '2025.01.06. 15:30' },
      { id: 2, author: '희경이', text: '어? 기사시험 그저께였는데요?', date: '2025.01.06. 15:35' },
   ])
   const dispatch = useDispatch()
   const navigate = useNavigate() // ✅ 페이지 이동을 위한 navigate 추가
   const fileInputRef = useRef(null)
   const [selectedFile, setSelectedFile] = useState(null)
   const [newComment, setNewComment] = useState('')
   const { postId } = useParams()

   useEffect(() => {
      if (postId) {
         dispatch(fetchPostsThunk({ page: 1 }))
      }
   }, [dispatch, postId])

   const handleImageUploadClick = () => {
      fileInputRef.current.click()
   }

   const handleFileChange = (event) => {
      const file = event.target.files[0]
      if (file) {
         setSelectedFile(file)
      }
   }

   //댓글추가
   const handleAddComment = () => {
      if (!postId) {
         console.error('❌ 오류: postId가 정의되지 않음')
         return
      }
      if (!newComment.trim()) {
         console.error('❌ 오류: 댓글 내용을 입력하세요')
         return
      }

      const formData = new FormData()
      formData.append('content', newComment)
      formData.append('postId', postId)

      if (selectedFile) {
         formData.append('img', selectedFile)
      }

      dispatch(createCommentThunk(formData))
      setNewComment('')
      setSelectedFile(null)
   }

   // ✅ 목록 버튼 클릭 시 목록 페이지로 이동
   const handleBackToList = () => {
      navigate('/board') // ✅ 게시판 목록으로 이동
   }

   return (
      <>
         <Paper elevation={0} sx={{ padding: '10px', margin: '20px auto', maxWidth: '100%', paddingLeft: '100px', borderBottom: '2px solid rgba(255, 122, 0, 0.5)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Typography variant="body1" gutterBottom>
                  {post?.title || '제목 없음'}
               </Typography>
               <Box sx={{ display: 'flex', gap: '10px' }}>
                  <Button variant="contained" sx={{ borderRadius: '20px', backgroundColor: '#FFCC99', color: '#fff', '&:hover': { backgroundColor: '#FFB266' } }}>
                     수정
                  </Button>
                  <Button variant="contained" sx={{ borderRadius: '20px', backgroundColor: '#FF5733', color: '#fff', '&:hover': { backgroundColor: '#E74C3C' } }}>
                     삭제
                  </Button>
               </Box>
            </Box>
            <Typography variant="subtitle1" color="textSecondary" align="right" sx={{ paddingTop: '20px' }}>
               작성자: {post?.author || '알 수 없음'} | {post?.date || '날짜 없음'}
            </Typography>
         </Paper>

         <Paper sx={{ padding: '20px', margin: '20px auto', maxWidth: '100%', paddingLeft: '100px' }}>
            <Typography variant="body1" sx={{ height: '40px' }}>
               {post?.content || '내용 없음'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', marginTop: '20px' }}>
               <Button
                  variant="contained"
                  sx={{
                     position: 'absolute',
                     right: '1px',
                     top: '-50px',
                     width: '70px',
                     height: '40px',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     fontSize: '14px',
                     padding: '10px 0',
                  }}
                  onClick={handleImageUploadClick}
               >
                  이미지
               </Button>
               <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
               <TextField
                  fullWidth
                  placeholder="댓글을 입력해주세요."
                  sx={{
                     height: '56px',
                     '& .MuiInputBase-root': {
                        height: '100%',
                     },
                  }}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
               />
               <Button variant="contained" color="warning" sx={{ marginLeft: '10px', height: '56px' }} onClick={handleAddComment}>
                  등록
               </Button>
            </Box>

            {/* ✅ 목록 버튼 추가 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
               <Button
                  variant="contained"
                  sx={{
                     width: '100px',
                     height: '35px',
                     backgroundColor: '#FFFFFF',
                     color: '#333333',
                     border: '1px solid rgba(0, 0, 0, 0.2)',
                     '&:hover': {
                        backgroundColor: '#F0F0F0',
                     },
                     padding: '8px 20px',
                     borderRadius: '10px',
                     fontWeight: 'bold',
                  }}
                  onClick={handleBackToList} // ✅ 목록 버튼 클릭 시 이동
               >
                  목록
               </Button>
            </Box>
         </Paper>
      </>
   )
}

export default QaBoardtDetail
