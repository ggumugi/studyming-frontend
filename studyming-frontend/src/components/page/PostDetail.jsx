import React, { useState } from 'react'
import { Paper, Typography, Button, TextField, Box } from '@mui/material'

const PostDetail = ({ post, onBack }) => {
   console.log('PostDetail에서 받은 post 데이터:', post)
   const [comments, setComments] = useState([
      { id: 1, author: '수험박', text: '정신차리세요... 32년 동안 공부하셨다면서요', date: '2025.01.06. 15:30' },
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
      <Paper sx={{ padding: '20px', margin: '20px auto', maxWidth: '800px' }}>
         {/* 제목 */}
         <Typography variant="h4" gutterBottom>
            {post.title}
         </Typography>

         {/* 작성자 & 작성일 */}
         <Typography variant="subtitle1" color="textSecondary" align="right">
            작성자: {post.author} | {post.date}
         </Typography>

         {/* 본문 내용 */}
         <Typography variant="body1" sx={{ marginTop: '20px' }}>
            {post.content}
         </Typography>

         {/* 댓글 입력 */}
         <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <TextField fullWidth placeholder="댓글을 입력해주세요." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <Button variant="contained" color="warning" sx={{ marginLeft: '10px' }} onClick={handleAddComment}>
               등록
            </Button>
         </Box>

         {/* 댓글 목록 */}
         {comments.map((comment) => (
            <Box key={comment.id} sx={{ marginTop: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
               <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {comment.author}
               </Typography>
               <Typography variant="body2">{comment.text}</Typography>
               <Typography variant="caption" color="textSecondary">
                  {comment.date}
               </Typography>
               <Button size="small" color="error" onClick={() => handleDeleteComment(comment.id)}>
                  삭제
               </Button>
            </Box>
         ))}

         {/* 목록 버튼 */}
         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="contained" color="secondary" onClick={onBack}>
               목록
            </Button>
         </Box>
      </Paper>
   )
}

export default PostDetail
