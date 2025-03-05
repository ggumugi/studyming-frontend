/* 사이드바 눌렀을때 각각의 리스트로 가야함 */
import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { TextField, Button, Typography } from '@mui/material'
import { createPostThunk, updatePostThunk } from '../../features/postSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const BoardCreate = ({ user, category, onSubmit, initialValues = {} }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')
   const [images, setImages] = useState([]) // ✅ 기존 이미지 (서버에서 불러온 것)
   const [imageFiles, setImageFiles] = useState([]) // ✅ 새로 업로드한 이미지
   const [removedImages, setRemovedImages] = useState([]) // ✅ 삭제할 기존 이미지 목록
   const [titleError, setTitleError] = useState(false)

   const reverseCategoryMap = {
      free: '자유',
      QnA: '질문',
      noti: '정보',
      inquiry: '문의',
   }
   useEffect(() => {
      console.log('images 상태:', images) // ✅ 현재 상태 확인
   }, [images])

   useEffect(() => {
      console.log('🛠 삭제된 이미지 리스트 변경됨:', removedImages)
   }, [removedImages]) // ✅ removedImages가 변경될 때마다 콘솔 찍기

   // 기존 게시글이 있다면 (수정 모드), 초기값 설정
   useEffect(() => {
      if (initialValues && Object.keys(initialValues).length > 0) {
         // 기존 게시글 수정 모드
         setTitle(initialValues.title || '')
         setContent(initialValues.content || '')
         setImages(initialValues.Images || [])
      } else {
         // 새로운 글쓰기 모드 -> 기존 값 초기화
         setTitle('')
         setContent('')
         setImages([])
         setImageFiles([])
         setRemovedImages([])
      }
   }, [initialValues])

   const handleTitleChange = (e) => {
      const inputValue = e.target.value
      if (inputValue.length > 100) {
         setTitleError(true)
      } else {
         setTitleError(false)
      }
      setTitle(inputValue.slice(0, 100))
   }

   const handleImageUpload = (e) => {
      const files = Array.from(e.target.files)
      console.log('📌 업로드된 파일:', files)

      // 🔥 현재 업로드된 이미지 개수 체크
      const totalImages = images.length + files.length
      if (totalImages > 10) {
         alert('이미지는 최대 10개까지 업로드할 수 있습니다.')
         return
      }

      setImageFiles((prev) => [...prev, ...files]) // ✅ 기존 이미지 유지
      const previews = files.map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...previews]) // ✅ 미리보기 추가
   }

   // ✅ 기존 이미지 삭제
   const handleRemoveImage = (target) => {
      // 기존 이미지 삭제 (ID로 처리)
      if (typeof target === 'number' || (typeof target === 'string' && !isNaN(target))) {
         const imageId = Number(target)
         setImages((prev) => prev.filter((img) => img.id !== imageId))
         setRemovedImages((prev) => [...prev, imageId])
      }
      // 새 이미지 삭제 (preview URL로 처리)
      else {
         setImageFiles((prev) => prev.filter((file) => URL.createObjectURL(file) !== target))
         setImages((prev) => prev.filter((preview) => preview !== target))
      }
   }

   const handleSubmit = useCallback(async () => {
      if (!title.trim() || !content.trim()) {
         alert('제목과 내용을 입력해주세요!')
         return
      }

      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('category', category || initialValues.category || 'free') // ✅ 기존 카테고리 유지

      if (removedImages.length > 0) {
         formData.append('removeImageIds', JSON.stringify(removedImages))
      }

      if (imageFiles.length > 0) {
         imageFiles.forEach((file) => formData.append('images', file))
      }

      console.log('📌 수정 요청 formData:', {
         title,
         content,
         category,
         removedImages,
         imageFiles,
      })

      if (initialValues) {
         try {
            const response = await dispatch(
               updatePostThunk({
                  id: initialValues.id,
                  postData: formData,
                  imagesToRemove: removedImages,
               })
            ).unwrap()

            console.log('✅ 수정 완료:', response)
            navigate(`/board/detail/${initialValues.id}`) // ✅ 수정 완료 후 해당 게시글 상세 페이지로 이동!
         } catch (error) {
            console.error('🚨 수정 실패:', error)
            alert('수정 중 오류가 발생했습니다.')
         }
      } else {
         onSubmit(formData)
      }
   }, [title, content, category, removedImages, imageFiles, initialValues, dispatch, navigate])

   return (
      <Container>
         <Header>
            <Title>{reverseCategoryMap[category]} 게시판</Title>
         </Header>

         <FormGroup>
            <Label>제목</Label>
            <StyledTextField variant="outlined" placeholder="제목을 입력해주세요. (최대 100자)" value={title} onChange={handleTitleChange} error={titleError} />
            {titleError && (
               <Typography color="error" sx={{ mt: 1 }}>
                  100자까지만 입력 가능합니다.
               </Typography>
            )}
         </FormGroup>

         <FormGroup>
            <Label>내용</Label>
            <StyledTextField variant="outlined" placeholder="내용을 입력해주세요." multiline rows={15} value={content} onChange={(e) => setContent(e.target.value)} />
            <UploadButton>
               <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
               이미지 업로드
            </UploadButton>
         </FormGroup>

         {/* ✅ 기존 이미지 표시 및 삭제 기능 */}
         <UploadContainer>
            {images
               .filter((image) => typeof image === 'object' && image?.path)
               .map((image) => (
                  <ImagePreview key={image.id}>
                     <img src={`http://localhost:8000/${image.path}`} alt="기존 이미지" />
                     <DeleteButton onClick={() => handleRemoveImage(image.id)}>삭제</DeleteButton>
                  </ImagePreview>
               ))}
         </UploadContainer>

         <ButtonContainer>
            <UploadContainer>
               {images
                  .filter((image) => typeof image === 'string')
                  .map((preview, index) => (
                     <ImagePreview key={preview}>
                        <img src={preview} alt="미리보기" />
                        <DeleteButton onClick={() => handleRemoveImage(preview)}>삭제</DeleteButton>
                     </ImagePreview>
                  ))}
            </UploadContainer>
         </ButtonContainer>
         <SubmitButton onClick={handleSubmit}>{initialValues ? '수정하기' : '글쓰기'}</SubmitButton>
         <BackButton onClick={() => navigate(-1)}>← 뒤로가기</BackButton>
      </Container>
   )
}

export default BoardCreate

//
// Styled Components (BoardList와 동일한 스타일 적용)
//
const Container = styled.div`
   width: 100%;
   padding: 70px 70px 0 70px;
   background-color: #fff;
   display: flex;
   flex-direction: column;
`

const Header = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding-bottom: 10px;
   border-bottom: 2px solid #ff7a00;
   margin-bottom: 20px;
`

const Title = styled.h2`
   font-weight: 300;
   font-size: 32px;
`

const FormGroup = styled.div`
   display: flex;
   flex-direction: column;
   width: 100%;
   margin-bottom: 16px;
`

const Label = styled.label`
   font-size: 18px;
   font-weight: bold;
   margin-bottom: 5px;
`

const StyledTextField = styled(TextField)`
   && {
      background-color: #fff;
      width: 100%;
   }
`

const ButtonContainer = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   width: 100%;
   padding: 10px 0;
`

const UploadContainer = styled.div`
   display: flex;
   flex-wrap: wrap; /* ✅ 넘치면 자동으로 줄바꿈 */
   justify-content: flex-start;
   align-items: center;
   gap: 10px; /* 이미지 간 간격 */
   width: 100%;
   max-width: 100%; /* 부모 컨테이너를 넘지 않도록 설정 */
`

const UploadButton = styled.label`
   margin-top: 20px;
   display: inline-block;
   padding: 10px 15px;
   font-size: 14px;
   color: #555;
   border: 1px solid #ccc;
   border-radius: 20px;
   cursor: pointer;
   text-align: center;
   width: 110px;

   input {
      display: none;
   }

   &:hover {
      background-color: #f8f8f8;
   }
`

const SubmitButton = styled(Button).attrs({
   variant: 'contained',
})`
   && {
      background-color: #ff7a00;
      color: white;
      font-weight: bold;
      padding: 10px 20px;
      border-radius: 20px;
      width: 110px;
      margin: 10px auto 100px auto;
      &:hover {
         background-color: #e66a00;
      }
   }
`

const BackButton = styled(Button)`
   && {
      margin-bottom: 50px;
      background-color: #ddd;
      color: #333;
      font-weight: 400;
      padding: 5px 20px;
      border-radius: 20px;
      width: 50%;
      align-self: center;

      &:hover {
         background-color: #ccc;
      }
   }
`

// ✅ 기존 스타일 컴포넌트 아래에 추가
const ImagePreview = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   width: calc(25% - 10px); /* ✅ 한 줄에 4개 배치, 10px 간격 고려 */
   max-width: 150px; /* ✅ 이미지 크기 제한 */
   margin: 10px;

   img {
      width: 100%;
      height: auto;
      border-radius: 5px;
   }
`

const DeleteButton = styled.button`
   margin-top: 5px;
   background: red;
   color: white;
   border: none;
   padding: 5px;
   cursor: pointer;
   border-radius: 5px;
   font-size: 12px;
   &:hover {
      background: darkred;
   }
`
