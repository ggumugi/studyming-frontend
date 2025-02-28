import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { createCommentThunk, updateCommentThunk, fetchCommentsThunk, deleteCommentThunk, selectCommentThunk } from '../../features/commentSlice'
import { FaImage, FaCheck } from 'react-icons/fa' // 🔥 이미지 아이콘 추가

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
   const user = useSelector((state) => state.auth.user)
   const totalPages = useSelector((state) => state.comments.totalPages) // ✅ 총 페이지 수 가져오기

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

   // ✅ 댓글 채택 함수
   const handleSelectComment = (id) => {
      dispatch(selectCommentThunk(id))
         .unwrap()
         .then((updatedComment) => {
            // ✅ 채택된 댓글을 최상단으로 이동
            const updatedComments = comments.map(
               (c) =>
                  c.id === updatedComment.id
                     ? { ...updatedComment, selected: true } // ✅ 채택된 댓글 유지
                     : { ...c, selected: false } // ✅ 다른 댓글은 해제
            )

            // ✅ selected = true인 댓글을 최상단으로 정렬
            const sortedComments = [...updatedComments].sort((a, b) => (b.selected ? 1 : -1))

            dispatch({ type: 'comments/updateComments', payload: sortedComments })
         })
         .catch((error) => {
            console.error('❌ 댓글 채택 실패:', error)
         })
   }

   // // ✅ 페이지네이션 상태 추가
   // const [currentPage, setCurrentPage] = useState(1)
   // const limit = 10 // 한 페이지당 댓글 10개

   // useEffect(() => {
   //    console.log(`📢 useEffect 실행됨! 현재 페이지: ${currentPage}`) // ✅ 페이지 변경 시 useEffect가 실행되는지 확인

   //    if (postId) {
   //       console.log(`📡 fetchCommentsThunk 호출! postId: ${postId}, page: ${currentPage}`)
   //       dispatch(fetchCommentsThunk({ postId, page: currentPage, limit }))
   //    }
   // }, [dispatch, postId, currentPage]) // ✅ currentPage가 변경될 때 실행

   // // ✅ 페이지 변경 핸들러
   // const handlePageChange = (newPage) => {
   //    console.log(`📢 페이지 변경 시도: ${newPage}`) // ✅ 클릭 시 실행 확인

   //    if (newPage >= 1 && newPage <= totalPages) {
   //       console.log(`✅ 페이지 변경 적용: ${newPage}`) // ✅ 이게 안 찍히면 조건에서 걸림
   //       setCurrentPage(newPage)
   //    } else {
   //       console.error(`❌ 페이지 변경 실패! (범위 초과) newPage: ${newPage}, totalPages: ${totalPages}`)
   //    }
   // }

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
         {selectedImage && newComment.trim() && isEditing === null && <ImagePreview src={selectedImage} alt="미리보기" />}

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
                        {/* 🔥 이미지 미리보기 */}
                        {selectedImage && isEditing === comment.id && <ImagePreview src={selectedImage} alt="미리보기" />}
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
                        {user?.id !== comment.userId && !comment.selected && <SelectButton onClick={() => handleSelectComment(comment.id)}>채택</SelectButton>}
                        <EditButton onClick={() => startEditing(comment)}>수정</EditButton>
                        <SmallDeleteButton onClick={() => handleDelete(comment.id)}>삭제</SmallDeleteButton>
                     </>
                  )}
               </CommentActions>
            </CommentBox>
         ))}
         {/* 🔥 페이지네이션 UI
         <PaginationContainer>
            <PageButton disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
               이전
            </PageButton>
            <PageNumber>
               {currentPage} / {totalPages}
            </PageNumber>
            <PageButton
               onClick={() => {
                  console.log('🚀 버튼 클릭됨! 페이지 증가 시도')
                  handlePageChange(currentPage + 1)
               }}
            >
               다음
            </PageButton>
         </PaginationContainer> */}
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
   background: #ff7a00;
   color: white;
   font-weight: bold;
   padding: 8px 15px;
   border-radius: 5px;
   margin: 0 5px;
   cursor: pointer;
   &:disabled {
      background: #ccc;
      cursor: not-allowed;
   }
`
const PageNumber = styled.span`
   font-weight: bold;
   font-size: 16px;
`
