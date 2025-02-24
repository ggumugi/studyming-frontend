import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCommentsThunk, createCommentThunk, updateCommentThunk, deleteCommentThunk } from '../../features/commentSlice'
import { Paper, Typography, Button, TextField, Box } from '@mui/material'

const FreePostDetail = ({ post, onBack }) => {
   const dispatch = useDispatch()
   const { comments, loading, error } = useSelector((state) => state.comments)
   const { user } = useSelector((state) => state.auth) // ✅ 현재 로그인된 사용자 정보 가져오기

   const [newComment, setNewComment] = useState('')
   const [editCommentId, setEditCommentId] = useState(null) // ✅ 수정 중인 댓글 ID
   const [editText, setEditText] = useState('') // ✅ 수정할 댓글 내용

   // ✅ 특정 게시물의 댓글 불러오기
   useEffect(() => {
      if (post?.id) {
         dispatch(fetchCommentsThunk({ postId: post.id, page: 1, limit: 5 }))
      }
   }, [dispatch, post?.id])

   // ✅ 댓글 추가
   const handleAddComment = () => {
      if (!newComment.trim()) return
      const commentData = new FormData()
      commentData.append('postId', post.id)
      commentData.append('content', newComment)

      dispatch(createCommentThunk(commentData)).then(() => {
         setNewComment('')
      })
   }

   // ✅ 수정 버튼 클릭 시 (본인 댓글만 가능)
   const handleEditClick = (comment) => {
      if (comment.userId !== user?.id) {
         alert('댓글을 수정할 수 없습니다!') // 🚨 본인이 아닐 경우 알림창 띄우기
         return
      }
      setEditCommentId(comment.id)
      setEditText(comment.content)
   }

   // ✅ 댓글 수정 요청
   const handleEditSubmit = (id) => {
      if (!editText.trim()) return
      const commentData = new FormData()
      commentData.append('content', editText)

      dispatch(updateCommentThunk({ id, commentData })).then(() => {
         setEditCommentId(null) // 수정 완료 후 ID 초기화
         setEditText('')
      })
   }

   // ✅ 댓글 삭제 (본인 또는 관리자만 가능)
   const handleDeleteComment = (id, userId) => {
      if (user?.role !== 'ADMIN' && user?.id !== userId) {
         alert('댓글을 삭제할 권한이 없습니다!')
         return
      }
      dispatch(deleteCommentThunk(id))
   }

   return (
      <>
         <Paper elevation={0} sx={{ padding: '10px', margin: '20px auto', maxWidth: '100%', paddingLeft: '100px', borderBottom: '2px solid rgba(255, 122, 0, 0.5)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               {/* 제목 */}
               <Typography variant="body1" gutterBottom>
                  {post.title}
               </Typography>

               {/* 수정/삭제 버튼 */}
               <Box sx={{ display: 'flex', gap: '10px' }}>
                  <Button variant="contained" sx={{ borderRadius: '20px', backgroundColor: '#FFCC99', color: '#fff', '&:hover': { backgroundColor: '#FFB266' } }}>
                     수정
                  </Button>
                  <Button variant="contained" sx={{ borderRadius: '20px', backgroundColor: '#FF5733', color: '#fff', '&:hover': { backgroundColor: '#E74C3C' } }}>
                     삭제
                  </Button>
               </Box>
            </Box>
            {/* 작성자 & 작성일 */}
            <Typography variant="subtitle1" color="textSecondary" align="right" sx={{ paddingTop: '20px' }}>
               작성자: {post.author} | {post.date}
            </Typography>
         </Paper>

         <Paper sx={{ padding: '20px', margin: '20px auto', maxWidth: '100%', paddingLeft: '100px' }}>
            {/* 본문 내용 */}
            <Typography variant="body1" sx={{ height: '40px' }}>
               {post.content}
            </Typography>

            {/* ✅ 댓글 입력 필드 */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
               <TextField fullWidth placeholder="댓글을 입력해주세요." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
               <Button variant="contained" color="warning" sx={{ marginLeft: '10px', height: '56px' }} onClick={handleAddComment}>
                  등록
               </Button>
            </Box>

            {/* ✅ 댓글 목록 */}
            {comments.map((comment) => (
               <Box
                  key={comment.id}
                  sx={{
                     marginTop: '15px',
                     borderBottom: '1px solid #eee',
                     paddingBottom: '10px',
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                  }}
               >
                  {/* 왼쪽: 댓글 내용 */}
                  <Box>
                     <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>
                        {comment.User?.nickname || '익명'}
                     </Typography>

                     {/* ✅ 수정 중일 경우 입력 필드 활성화 */}
                     {editCommentId === comment.id ? (
                        <TextField fullWidth value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus sx={{ marginBottom: '5px' }} />
                     ) : (
                        <Typography variant="body2" sx={{ marginLeft: '20px' }}>
                           {comment.content}
                        </Typography>
                     )}

                     <Typography variant="caption" color="textSecondary" sx={{ marginLeft: '20px' }}>
                        {comment.date}
                     </Typography>
                  </Box>

                  {/* ✅ 관리자(role=ADMIN)일 경우 "삭제"만 보이게 */}
                  <Box sx={{ display: 'flex', gap: '10px' }}>
                     {user?.role !== 'ADMIN' && editCommentId !== comment.id && (
                        <Button size="small" color="primary" sx={{ padding: '0', minWidth: 'auto' }} onClick={() => handleEditClick(comment)}>
                           수정
                        </Button>
                     )}

                     {editCommentId === comment.id && (
                        <Button size="small" color="success" sx={{ padding: '0', minWidth: 'auto' }} onClick={() => handleEditSubmit(comment.id)}>
                           완료
                        </Button>
                     )}

                     <Button size="small" color="error" sx={{ padding: '0', minWidth: 'auto' }} onClick={() => handleDeleteComment(comment.id, comment.userId)}>
                        삭제
                     </Button>
                  </Box>
               </Box>
            ))}
            {/* 목록 버튼 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
               <Button
                  variant="contained"
                  sx={{
                     width: '100px',
                     height: '35px',
                     backgroundColor: '#FFFFFF', // 버튼 배경을 흰색으로 설정
                     color: '#333333', // 텍스트 색상을 어두운 회색으로 변경
                     border: '1px solid rgba(0, 0, 0, 0.2)', // 연한 검정 테두리 추가

                     '&:hover': {
                        backgroundColor: '#F0F0F0', // 마우스 오버 시 약간 회색 배경
                        // boxShadow: '3px 3px 7px rgba(0, 0, 0, 0.3)', // 마우스 오버 시 그림자 강조
                     },
                     padding: '8px 20px', // 패딩 조정
                     borderRadius: '10px', // 버튼을 살짝 둥글게
                     fontWeight: 'bold',
                  }}
                  onClick={onBack}
               >
                  목록
               </Button>
            </Box>
         </Paper>
      </>
   )
}

export default FreePostDetail
