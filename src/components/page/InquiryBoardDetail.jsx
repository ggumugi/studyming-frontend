import React, { useState } from 'react'
import { Paper, Typography, Button, TextField, Box } from '@mui/material'

const PostDetail = ({ post, onBack }) => {
   console.log('PostDetail에서 받은 post 데이터:', post)
   const [comments, setComments] = useState([
      { id: 1, author: '수현박', text: '포도는 포도맛', date: '2025.01.06. 15:30' },
      { id: 2, author: '희경이', text: '어? 기사시험 그저께였는데요?', date: '2025.01.06. 15:35' },
   ])
   const [newComment, setNewComment] = useState('')

   // ✅ 댓글 추가 기능
   const handleAddComment = () => {
      if (!newComment.trim()) return
      const newEntry = {
         id: comments.length + 1,
         author: '익명',
         text: newComment,
         date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      }
      setComments([...comments, newEntry])
      setNewComment('') // 입력 필드 초기화
   }

   // ✅ 댓글 삭제 기능
   const handleDeleteComment = (id) => {
      setComments(comments.filter((comment) => comment.id !== id))
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
         {/* <Typography sx={{ marginTop: '20px', borderBottom: '2px solid #ff7a00' }}></Typography> */}
         <Paper sx={{ padding: '20px', margin: '20px auto', maxWidth: '100%', paddingLeft: '100px' }}>
            {/* 본문 내용 */}
            <Typography variant="body1" sx={{ height: '40px' }}>
               {post.content}
            </Typography>

            {/* 댓글 입력 */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
               <TextField fullWidth placeholder="댓글을 입력해주세요." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
               <Button variant="contained" color="warning" sx={{ marginLeft: '10px', height: '56px' }} onClick={handleAddComment}>
                  등록
               </Button>
            </Box>

            {/* 댓글 목록 */}
            {comments.map((comment) => (
               <Box
                  key={comment.id}
                  sx={{
                     marginTop: '15px',
                     borderBottom: '1px solid #eee',
                     paddingBottom: '10px',
                     display: 'flex',
                     justifyContent: 'space-between', // 내용과 버튼을 양쪽 정렬
                     alignItems: 'center', // 수직 정렬
                  }}
               >
                  {/* 왼쪽: 댓글 내용 */}
                  <Box>
                     <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>
                        {comment.author}
                     </Typography>
                     <Typography variant="body2" sx={{ marginLeft: '20px' }}>
                        {comment.text}
                     </Typography>
                     <Typography variant="caption" color="textSecondary" sx={{ marginLeft: '20px' }}>
                        {comment.date}
                     </Typography>
                  </Box>

                  {/* 오른쪽: 수정/삭제 버튼 */}
                  <Box sx={{ display: 'flex', gap: '10px' }}>
                     {' '}
                     {/* 버튼 간격 최소화 */}
                     <Button size="small" color="primary" sx={{ padding: '0', minWidth: 'auto' }}>
                        수정
                     </Button>
                     <Button size="small" color="error" sx={{ padding: '0', minWidth: 'auto' }} onClick={() => handleDeleteComment(comment.id)}>
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

export default PostDetail
