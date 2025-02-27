import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { createCommentThunk, updateCommentThunk, fetchCommentsThunk } from '../../features/commentSlice'
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
      if (!editedComment.trim() && !imageFile) return // 🔥 텍스트 & 이미지 모두 없을 때 방지

      const formData = new FormData()
      formData.append('content', editedComment)
      if (imageFile) formData.append('image', imageFile) // 🔥 선택된 이미지가 있다면 추가
      console.log('🔥 보낼 데이터:', { postId, formData })

      dispatch(createCommentThunk({ postId, formData }))
         .unwrap()
         .then(() => {
            console.log('🔥 댓글 등록 요청 실행!') // ✅ 요청 실행 확인용 로그
            setEditedComment('') // 등록 후 입력 필드 초기화
            setSelectedImage(null) // 이미지 초기화
            setImageFile(null)
            dispatch(fetchCommentsThunk(postId)) // 🔥 댓글 리스트 갱신
         })
         .catch((error) => console.error('❌ 댓글 등록 실패:', error))
   }

   // ✅ 댓글 수정
   const handleEditComment = () => {
      if (!editedComment.trim() && !imageFile) return

      const formData = new FormData()
      formData.append('id', comment.id)
      formData.append('content', editedComment)
      if (imageFile) formData.append('image', imageFile) // 🔥 선택된 이미지가 있다면 추가

      dispatch(updateCommentThunk({ postId, formData }))
         .unwrap()
         .then(() => {
            setIsEditing(false) // 수정 완료 후, 수정 모드 해제
            setSelectedImage(null) // 이미지 초기화
            setImageFile(null)
            dispatch(fetchCommentsThunk(postId)) // 🔥 댓글 리스트 갱신
         })
         .catch((error) => console.error('❌ 댓글 수정 실패:', error))
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
         {comment && (
            <CommentBox>
               <CommentText>
                  <CommentAuthor>{comment.author}</CommentAuthor>
                  <CommentContent>{comment.content}</CommentContent>
                  <CommentDate>{new Date(comment.createdAt).toLocaleString()}</CommentDate>
               </CommentText>
               <CommentActions>
                  <ReportButton onClick={() => setIsEditing(true)}>수정</ReportButton>
                  <SmallDeleteButton>삭제</SmallDeleteButton>
               </CommentActions>
            </CommentBox>
         )}
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
