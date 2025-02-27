import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { createCommentThunk, updateCommentThunk, fetchCommentsThunk, deleteCommentThunk } from '../../features/commentSlice'
import { FaImage } from 'react-icons/fa' // 🔥 이미지 아이콘 추가

const CommentItem = ({ comment }) => {
   const { id: postId } = useParams() // ✅ 동적 postId 가져오기 boarddetail에 import할 때 URL post 값 갖고오게 하기
   console.log('📝 postId 확인:', postId) // ✅ postId 값 확인

   const dispatch = useDispatch()

   // 🔥 댓글 입력값 & 수정 상태 관리
   const [editedComment, setEditedComment] = useState(comment?.content || '') // 기존 댓글 값 유지
   const [isEditing, setIsEditing] = useState(false) // 수정 모드
   const [selectedImage, setSelectedImage] = useState(null) // 🔥 이미지 파일 상태 추가
   const [imageFile, setImageFile] = useState(null) // 🔥 실제 업로드할 파일

   const comments = useSelector((state) => state.comments.comments)
   // console.log('댓글 리스트:', comments)
   //comments.map((comment) => console.log(comment))
   // ✅ 이미지 선택 핸들러
   const handleImageChange = (e) => {
      const file = e.target.files[0] // 첫 번째 선택한 파일 가져오기
      if (file) {
         setSelectedImage(URL.createObjectURL(file)) // 미리보기 설정
         setImageFile(file) // 실제 파일 저장
      }
   }

   // ✅ 댓글 등록 (Redux Thunk 활용)
   const handleAddComment = () => {
      console.log('📢 댓글 등록 요청 시작')

      const numericPostId = parseInt(postId, 10)
      console.log('📢 숫자로 변환된 postId:', numericPostId)

      if (!numericPostId || isNaN(numericPostId)) {
         console.error('❌ postId가 잘못되었습니다! API 요청을 중단합니다.')
         return
      }
      console.log('✅ editedComment 타입 확인:', typeof editedComment, editedComment)

      const formData = new FormData()
      formData.append('content', editedComment)
      if (imageFile) formData.append('image', imageFile)

      console.log('📢 FormData 내부 데이터 확인:')
      formData.forEach((value, key) => {
         console.log(`✅ FormData key: ${key}, value:`, value)
      })

      console.log('🔥 보낼 데이터:', { postId: numericPostId, formData })

      dispatch(createCommentThunk({ postId: numericPostId, formData }))
         .unwrap()
         .then(() => {
            console.log('🔥 댓글 등록 요청 실행 완료!')
            setEditedComment('')
            setSelectedImage(null)
            setImageFile(null)
         })
         .catch((error) => console.error('❌ 댓글 등록 실패:', error))
   }

   useEffect(() => {
      if (postId) {
         const numericPostId = parseInt(postId, 10)
         dispatch(fetchCommentsThunk({ postId: numericPostId, page: 1, limit: 10 }))
      }
   }, [dispatch, postId])

   // ✅ 댓글 수정
   const handleEditComment = () => {
      if (!editedComment.trim() && !imageFile) return

      const formData = new FormData()
      formData.append('id', comment.id) // ✅ commentId 사용
      formData.append('content', editedComment)
      if (imageFile) formData.append('image', imageFile) // 🔥 선택된 이미지가 있다면 추가

      dispatch(updateCommentThunk({ id: comment.id, commentData: formData })) // ✅ commentId 전달
         .unwrap()
         .then(() => {
            setIsEditing(false) // 수정 완료 후, 수정 모드 해제
            setSelectedImage(null) // 이미지 초기화
            setImageFile(null)
         })
         .catch((error) => console.error('❌ 댓글 수정 실패:', error))
   }
   //댓글삭제
   const handleDelete = async (commentId) => {
      const id = Number(commentId) // 숫자로 변환
      console.log('삭제할 댓글 ID:', commentId)
      if (!commentId) {
         console.error('삭제할 댓글 ID가 없습니다.')
         return
      }
      try {
         await dispatch(deleteCommentThunk(id)).unwrap()
         alert('댓글이 삭제되었습니다.')
      } catch (error) {
         console.error(error)
         alert(error || '댓글 삭제 중 오류가 발생했습니다.')
      }
   }

   return (
      <>
         {/* 🔥 댓글 입력 필드 (등록 & 수정) */}
         <CommentSection>
            {/* 🔥 이미지 업로드 버튼 */}
            <ImageUploadLabel>
               <FaImage size={18} color="#ff7a00" />
               <ImageInput type="file" accept="image/*" onChange={handleImageChange} />
            </ImageUploadLabel>

            <CommentInput placeholder="댓글을 입력해주세요." value={editedComment} onChange={(e) => setEditedComment(e.target.value)} />
            {isEditing ? <CommentButton onClick={handleEditComment}>수정 완료</CommentButton> : <CommentButton onClick={handleAddComment}>등록</CommentButton>}
         </CommentSection>

         {/* 🔥 이미지 미리보기 */}
         {selectedImage && <ImagePreview src={selectedImage} alt="미리보기" />}

         {/* 🔥 댓글 렌더링 */}
         {comments.map((comment) => (
            <CommentBox key={comment.id}>
               <CommentText>
                  <CommentAuthor>{comment.User?.nickname || '익명'}</CommentAuthor>
                  {comment.img && <CommentImg src={`http://localhost:8000${comment.img}`} alt="댓글 이미지" />}
                  <CommentContent>{comment.content || '내용 없음'}</CommentContent>
                  <CommentDate>{new Date(comment.createdAt).toLocaleString()}</CommentDate>
               </CommentText>
               <CommentActions>
                  <ReportButton onClick={handleEditComment}>수정</ReportButton>
                  <SmallDeleteButton onClick={() => handleDelete(comment.id)}>삭제</SmallDeleteButton>
               </CommentActions>
            </CommentBox>
         ))}
      </>
   )
}

export default CommentItem

// Styled Components
const CommentSection = styled.div`
   display: flex;
   align-items: center;
   margin-top: 20px;
   position: relative;
`

const ImageUploadLabel = styled.label`
   position: absolute;
   top: -10px; /* 🔥 위치 조정 */
   left: 10px;
   display: flex;
   align-items: center;
   justify-content: center;
   background-color: white;
   width: 25px; /* 🔥 버튼 크기 조절 */
   height: 25px;
   border-radius: 50%;
   cursor: pointer;
   &:hover {
      background-color: #e66a00;
   }
`

const ImageInput = styled.input`
   display: none; // 🔥 파일 선택창 숨기기
`

const CommentInput = styled.input`
   flex-grow: 1;
   padding: 10px;
   border: 1px solid #ccc;
   border-radius: 5px;
`

const CommentButton = styled.button`
   margin-left: 10px;
   background-color: #ff7a00;
   color: white;
   font-weight: bold;
   padding: 10px 20px;
   border-radius: 5px;
   cursor: pointer;
   &:hover {
      background-color: #e66a00;
   }
`

const ImagePreview = styled.img`
   width: 40px;
   height: 40px;
   object-fit: cover;
   margin-left: 10px;
   border-radius: 5px;
`

const CommentBox = styled.div`
   margin-top: 15px;
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 10px 0;
   border-bottom: 1px solid #eee;
`

const CommentText = styled.div`
   display: flex;
   flex-direction: column;
`
const CommentImg = styled.img`
   width: 100px; /* 원하는 크기로 조정 */
   height: auto;
   border-radius: 5px;
   margin-top: 5px;
`

const CommentAuthor = styled.p`
   font-weight: bold;
`

const CommentContent = styled.p`
   margin-left: 20px;
`

const CommentDate = styled.p`
   margin-left: 20px;
   font-size: 12px;
   color: gray;
`

const CommentActions = styled.div`
   display: flex;
   gap: 10px;
`

const ReportButton = styled.button`
   background: none;
   color: red;
   border: none;
   cursor: pointer;
`

const SmallDeleteButton = styled.button`
   background: none;
   color: red;
   border: none;
   cursor: pointer;
`
