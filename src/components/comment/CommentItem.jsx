import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { createCommentThunk, updateCommentThunk, fetchCommentsThunk, deleteCommentThunk } from '../../features/commentSlice'
import { FaImage } from 'react-icons/fa' // 🔥 이미지 아이콘 추가

const CommentItem = ({ comment }) => {
   const { id: postId } = useParams() // ✅ 동적 postId 가져오기
   const dispatch = useDispatch()

   // 🔥 등록용 입력값
   const [newComment, setNewComment] = useState('')
   // 🔥 수정용 상태 변수
   const [isEditing, setIsEditing] = useState(null) // 수정 중인 댓글 ID 저장
   const [editModeComment, setEditModeComment] = useState('') // 수정 중인 댓글 입력값
   const [selectedImage, setSelectedImage] = useState(null) // 이미지 미리보기
   const [imageFile, setImageFile] = useState(null) // 실제 업로드할 파일

   const comments = useSelector((state) => state.comments.comments)

   // ✅ 이미지 선택 핸들러
   const handleImageChange = (e) => {
      const file = e.target.files[0]
      if (file) {
         setSelectedImage(URL.createObjectURL(file)) // 미리보기 설정
         setImageFile(file) // 실제 파일 저장
      }
   }

   // ✅ 댓글 등록
   const handleAddComment = () => {
      const numericPostId = parseInt(postId, 10)
      if (!numericPostId || isNaN(numericPostId)) return

      const formData = new FormData()
      formData.append('content', newComment)
      if (imageFile) formData.append('image', imageFile)

      dispatch(createCommentThunk({ postId: numericPostId, formData }))
         .unwrap()
         .then(() => {
            setNewComment('')
            setSelectedImage(null)
            setImageFile(null)
            dispatch(fetchCommentsThunk({ postId: numericPostId, page: 1, limit: 10 }))
         })
         .catch((error) => console.error('❌ 댓글 등록 실패:', error))
   }

   useEffect(() => {
      if (postId) {
         dispatch(fetchCommentsThunk({ postId, page: 1, limit: 10 }))
      }
   }, [dispatch, postId])

   // ✅ 수정 버튼 클릭 시 해당 댓글을 입력창으로 변경
   const startEditing = (comment) => {
      console.log('🛠 수정 시작 - 댓글 ID:', comment.id) // ✅ 수정할 댓글 ID 확인
      setIsEditing(comment.id)
      setEditModeComment(comment.content)
      setSelectedImage(comment.img ? `http://localhost:8000${comment.img}` : null)
   }

   // 댓글 수정 확정
   const handleEditComment = () => {
      console.log('🛠 수정 요청 ID 확인:', isEditing) // ✅ id 확인 로그 추가
      console.log('🛠 수정 요청 내용:', editModeComment) // ✅ 수정할 내용 확인
      console.log('🛠 수정 요청 이미지:', imageFile) // ✅ 이미지 확인

      if (!editModeComment.trim() && !imageFile) {
         console.error('❌ 수정할 내용 또는 이미지가 없습니다.')
         return
      }

      const formData = new FormData()
      formData.append('id', isEditing)
      formData.append('content', editModeComment)

      // ✅ 이미지 파일이 있을 경우만 추가
      if (imageFile) {
         formData.append('image', imageFile)
      }

      // 🔥 FormData 내부 값 확인 (디버깅)
      console.log('🔍 댓글 수정 요청:', { id: isEditing, formData })
      formData.forEach((value, key) => {
         console.log(`✅ FormData Key: ${key}, Value:`, value)
      })

      dispatch(updateCommentThunk({ id: isEditing, formData }))
         .unwrap()
         .then(() => {
            setIsEditing(null)
            setImageFile(null)
            dispatch(fetchCommentsThunk({ postId })) // 🔥 댓글 리스트 갱신
         })
         .catch((error) => console.error('❌ 댓글 수정 실패:', error))
   }

   // ✅ 댓글 삭제
   const handleDelete = async (commentId) => {
      try {
         await dispatch(deleteCommentThunk(commentId)).unwrap()
         dispatch(fetchCommentsThunk({ postId })) // 삭제 후 최신 댓글 반영
      } catch (error) {
         console.error(error)
      }
   }

   return (
      <>
         {/* 🔥 댓글 입력 필드 (등록) */}
         <CommentSection>
            <ImageUploadLabel>
               <FaImage size={18} color="#ff7a00" />
               <ImageInput type="file" accept="image/*" onChange={handleImageChange} />
            </ImageUploadLabel>

            <CommentInput
               placeholder="댓글을 입력해주세요."
               value={newComment} // ✅ 등록용 입력값 사용
               onChange={(e) => setNewComment(e.target.value)}
            />
            <CommentButton onClick={handleAddComment}>등록</CommentButton>
         </CommentSection>

         {/* 🔥 이미지 미리보기 */}
         {selectedImage && <ImagePreview src={selectedImage} alt="미리보기" />}

         {/* 🔥 댓글 렌더링 */}
         {comments.map((comment) => (
            <CommentBox key={comment.id}>
               <CommentText>
                  <CommentAuthor>{comment.User?.nickname || '익명'}</CommentAuthor>

                  {isEditing === comment.id ? (
                     <>
                        {/* 🔥 수정 중일 때 입력창 표시 */}
                        <EditContainer>
                           {/* 🔥 이미지 업로드 버튼 추가 */}
                           <EditImageUploadLabel>
                              <FaImage size={18} color="#ff7a00" />
                              <EditImageInput type="file" accept="image/*" onChange={handleImageChange} />
                           </EditImageUploadLabel>

                           <EditInput value={editModeComment} onChange={(e) => setEditModeComment(e.target.value)} />
                           <EditButton onClick={handleEditComment}>수정 완료</EditButton>
                           <CancelButton onClick={() => setIsEditing(null)}>취소</CancelButton>
                        </EditContainer>
                        {/* 🔥 이미지 미리보기 */}
                        {selectedImage && <ImagePreview src={selectedImage} alt="미리보기" />}
                     </>
                  ) : (
                     <>
                        {comment.img && <CommentImg src={`http://localhost:8000${comment.img}`} alt="댓글 이미지" />}
                        <CommentContent>{comment.content || '내용 없음'}</CommentContent>
                        <CommentDate>{new Date(comment.createdAt).toLocaleString()}</CommentDate>
                     </>
                  )}
               </CommentText>

               <CommentActions>
                  {isEditing === comment.id ? (
                     <CancelButton onClick={() => setIsEditing(null)}>취소</CancelButton>
                  ) : (
                     <>
                        <EditButton onClick={() => startEditing(comment)}>수정</EditButton>
                        <SmallDeleteButton onClick={() => handleDelete(comment.id)}>삭제</SmallDeleteButton>
                     </>
                  )}
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

const EditContainer = styled.div`
   display: flex;
   align-items: center;
   gap: 10px;
`

const EditInput = styled.input`
   flex-grow: 1;
   padding: 10px;
   border: 1px solid #ccc;
   border-radius: 5px;
`

const EditButton = styled.button`
   background-color: #ff7a00;
   color: white;
   font-weight: bold;
   padding: 5px 10px;
   border-radius: 5px;
   cursor: pointer;
   &:hover {
      background-color: #e66a00;
   }
`
const CancelButton = styled.button`
   background: none;
   color: gray;
   border: none;
   cursor: pointer;
`
const EditImageUploadLabel = styled.label`
   display: flex;
   align-items: center;
   justify-content: center;
   background-color: white;
   width: 30px;
   height: 30px;
   border-radius: 50%;
   cursor: pointer;
   margin-right: 10px;
   &:hover {
      background-color: #e66a00;
   }
`

const EditImageInput = styled.input`
   display: none;
`
