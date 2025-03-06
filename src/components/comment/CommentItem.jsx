import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { createCommentThunk, updateCommentThunk, fetchCommentsThunk, deleteCommentThunk, selectCommentThunk } from '../../features/commentSlice'
import { FaImage, FaCheck } from 'react-icons/fa' // 🔥 이미지 아이콘 추가

const CommentItem = () => {
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
   const totalPages = useSelector((state) => state.comments.totalPages) // 🔥 전체 페이지 수
   const currentPage = useSelector((state) => state.comments.currentPage) // 🔥 현재 페이지
   const user = useSelector((state) => state.auth.user)
   const post = useSelector((state) => state.posts.posts.find((p) => p.id === parseInt(postId, 10)))

   const [page, setPage] = useState(1) // ✅ 현재 페이지

   // ✅ 이미지 선택 핸들러
   const handleImageChange = (e) => {
      const file = e.target.files[0]
      if (file) {
         e.target.value = null // ✅ 같은 파일 연속 선택 가능하도록 설정
         setSelectedImage(URL.createObjectURL(file)) // 미리보기 설정
         setImageFile(file) // 실제 파일 저장
      }
   }

   // ✅ 이미지 삭제 핸들러 추가
   const handleRemoveImage = () => {
      setSelectedImage(null) // 미리보기 이미지 삭제
      setImageFile(null) // 업로드 파일 삭제
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
      setIsEditing(comment.id)
      setEditModeComment(comment.content)
      setSelectedImage(comment.img ? `http://ec2-15-164-103-85.ap-northeast-2.compute.amazonaws.com:8000${comment.img}` : null)
   }

   // 댓글 수정 확정
   const handleEditComment = () => {
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

      dispatch(updateCommentThunk({ id: isEditing, commentData: formData }))
         .unwrap()
         .then(() => {
            setIsEditing(null)
            setImageFile(null)
            setSelectedImage(null) // ✅ 미리보기 이미지 초기화 (등록창에 남지 않도록)
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

   // ✅ 댓글 채택 함수 (Redux 상태 즉시 반영 + 최상단 이동)
   const handleSelectComment = (id) => {
      dispatch(selectCommentThunk(id))
         .unwrap()
         .then(() => {
            // console.log('✅ 댓글 채택 성공')

            // ✅ Redux 상태를 즉시 갱신하여 UI에 반영 (채택 로고가 즉시 보이게 함)
            dispatch(fetchCommentsThunk({ postId })) // 🔥 Redux에서 새 데이터 불러오기
         })
         .catch((error) => {
            console.error('❌ 댓글 채택 실패:', error)
         })
   }

   const isAnyCommentSelected = comments.some((comment) => comment.selected) // ✅ 이미 채택된 댓글이 있는지 확인

   //페이징 버튼 함수
   useEffect(() => {
      if (postId) {
         dispatch(fetchCommentsThunk({ postId, page, limit: 10 }))
      }
   }, [dispatch, postId, page]) // ✅ 페이지 변경될 때마다 댓글 다시 불러오기

   const handlePageChange = (newPage) => {
      setPage(newPage)
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

         {/* 🔥 이미지 미리보기 및 삭제 버튼 */}
         {selectedImage && isEditing === null && (
            <ImagePreviewContainer>
               <ImagePreview src={selectedImage} alt="미리보기" />
               <RemoveImageButton onClick={handleRemoveImage}>삭제</RemoveImageButton>
            </ImagePreviewContainer>
         )}

         {/* 🔥 댓글 렌더링 */}
         {comments.map((comment) => (
            <CommentBox key={comment.id}>
               <CommentText>
                  <CommentAuthor>
                     {comment.User?.nickname || '익명'}
                     {comment.selected && (
                        <SelectedTag>
                           <FaCheck color="green" /> 채택됨
                        </SelectedTag>
                     )}
                  </CommentAuthor>

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
                        {/* 🔥 수정 중일 때 미리보기 및 삭제 버튼 */}
                        {selectedImage && isEditing === comment.id && (
                           <ImagePreviewContainer>
                              <ImagePreview src={selectedImage} alt="미리보기" />
                              <RemoveImageButton onClick={handleRemoveImage}>삭제</RemoveImageButton>
                           </ImagePreviewContainer>
                        )}
                     </>
                  ) : (
                     <>
                        {comment.img && <CommentImg src={`http://ec2-15-164-103-85.ap-northeast-2.compute.amazonaws.com:8000${comment.img}`} alt="댓글 이미지" />}
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
                        {post?.userId &&
                           user?.id === post.userId &&
                           user?.id !== comment.userId &&
                           !comment.selected &&
                           !isAnyCommentSelected && ( // ✅ 이미 채택된 댓글이 있으면 다른 댓글에 채택 버튼 안 보이게 함
                              <SelectButton onClick={() => handleSelectComment(comment.id)}>채택</SelectButton>
                           )}
                        {/* ✅ 로그인한 유저 본인의 댓글만 수정/삭제 가능 */}
                        {user?.id === comment.userId && (
                           <>
                              <EditButton onClick={() => startEditing(comment)}>수정</EditButton>
                              <SmallDeleteButton onClick={() => handleDelete(comment.id)}>삭제</SmallDeleteButton>
                           </>
                        )}
                     </>
                  )}
               </CommentActions>
            </CommentBox>
         ))}
         {/* 🔥 페이징 버튼 UI */}
         <PaginationContainer>
            <PageButton disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
               ◀ 이전
            </PageButton>
            {[...Array(totalPages)].map((_, i) => (
               <PageButton key={i + 1} onClick={() => handlePageChange(i + 1)} active={page === i + 1}>
                  {i + 1}
               </PageButton>
            ))}
            <PageButton disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>
               다음 ▶
            </PageButton>
         </PaginationContainer>
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
   display: flex;
   align-items: center; /* ✅ 체크 아이콘 + "채택됨"을 닉네임 옆에 배치 */
   gap: 10px; /* ✅ 아이콘과 텍스트 간격 조정 */
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

// const ReportButton = styled.button`
//    background: none;
//    color: red;
//    border: none;
//    cursor: pointer;
// `

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
   background: none;
   color: blue;
   border: none;
   cursor: pointer;
`
const CancelButton = styled.button`
   background: none;
   color: gray;
   border: none;
   cursor: pointer;
`
const SelectButton = styled.button`
   background: none;
   color: green;
   border: none;
   cursor: pointer;
`

const SelectedTag = styled.span`
   color: green;
   font-weight: bold;
   display: flex;
   align-items: center;
   gap: 3px;
   margin-bottom: 5px;
   font-size: 15px;
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
const ImagePreviewContainer = styled.div`
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   margin-top: 10px;
`

const RemoveImageButton = styled.button`
   margin-top: 5px;
   background: #ff4d4d;
   color: white;
   border: none;
   padding: 5px 10px;
   border-radius: 5px;
   cursor: pointer;
   font-size: 12px;

   &:hover {
      background: #cc0000;
   }
`
const EditImageInput = styled.input`
   display: none;
`

const PaginationContainer = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   margin-top: 20px;
`
const PageButton = styled.button`
   background: none; /* ✅ 배경색 없음 */
   border: none; /* ✅ 외곽선 없음 */
   color: black; /* ✅ 기본 글씨색 검정 */
   font-weight: bold;
   padding: 8px 15px;
   border-radius: 5px;
   margin: 0 5px;
   cursor: pointer;
   transition: color 0.2s ease-in-out; /* ✅ 부드러운 색상 전환 */

   &:hover {
      color: #ff7a00; /* ✅ hover 시 주황색 */
   }

   ${(props) =>
      props.active &&
      `
      color: #ff7a00; /* ✅ 선택된 페이지는 주황색 */
   `}
`
