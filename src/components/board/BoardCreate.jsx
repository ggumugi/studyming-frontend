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

   useEffect(() => {
      console.log('images 상태:', images) // ✅ 현재 상태 확인
   }, [images])

   // 기존 게시글이 있다면 (수정 모드), 초기값 설정
   useEffect(() => {
      if (initialValues) {
         setTitle(initialValues.title)
         setContent(initialValues.content)
         setImages(initialValues.Images || [])
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
      console.log('업로드된 파일:', files)

      if (files.length > 0) {
         setImageFiles((prev) => [...prev, ...files]) // ✅ 이전 상태 보존
         const previews = files.map((file) => URL.createObjectURL(file)).filter(Boolean) // ✅ undefined 값 제거
         setImages((prev) => [...prev.filter(Boolean), ...previews]) // ✅ undefined 값 제거 후 추가
      }
   }

   // ✅ 기존 이미지 삭제
   const handleRemoveImage = (imageId) => {
      setImages(images.filter((image) => image.id !== imageId)) // ✅ 화면에서 제거
      setRemovedImages([...removedImages, imageId]) // ✅ 삭제할 이미지 ID 저장
   }

   const handleSubmit = useCallback(() => {
      if (!title.trim() || !content.trim()) {
         alert('제목과 내용을 입력해주세요!')
         return
      }
      console.log('📌 현재 입력된 값 확인')
      console.log('제목:', title)
      console.log('내용:', content)
      console.log('삭제할 이미지 목록:', removedImages)
      console.log('새로 추가한 이미지 목록:', imageFiles)

      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('category', category)
      /*  imageFiles.forEach((file) => {
         formData.append('images', file)
      }) */

      // formData가 제대로 값이 들어가는지 확인
      console.log('🚀 formData 확인')
      console.log('formData title:', formData.get('title'))
      console.log('formData content:', formData.get('content'))

      // ✅ 삭제할 이미지 리스트 추가
      if (removedImages.length > 0) {
         formData.append('removeImageIds', JSON.stringify(removedImages))
      }

      // ✅ 새 이미지 추가 (imageFiles가 존재하는 경우만 추가)
      if (imageFiles.length > 0) {
         imageFiles.forEach((file) => {
            formData.append('images', file)
         })
      }
      console.log('🚀 최종 formData:', formData)

      if (initialValues) {
         // ✅ 게시글 수정 모드
         dispatch(updatePostThunk({ id: initialValues.id, postData: formData, imagesToRemove: removedImages }))
            .unwrap()
            .then(() => {
               alert('게시글이 수정되었습니다!')
               navigate(`/board/detail/${initialValues.id}`)
            })
            .catch((error) => {
               console.error('게시글 수정 실패:', error)
               alert(`게시글 수정 실패: ${error?.message || '알 수 없는 오류'}`)
            })
      } else {
         // 새 게시글 작성 모드
         onSubmit(formData)
      }
   }, [title, content, category, imageFiles, onSubmit, initialValues, dispatch, navigate])

   return (
      <Container>
         <Header>
            <Title>{category} 게시판</Title>
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
         </FormGroup>

         {/* ✅ 기존 이미지 표시 및 삭제 기능 */}
         <UploadContainer>
            {/* ✅ 기존 이미지 표시 (undefined 값 체크 후 필터링) */}
            {initialValues?.Images?.filter((image) => image?.path)?.map((image) => (
               <ImagePreview key={image.id || image.path}>
                  <img
                     src={`http://localhost:8000/${image.path}`}
                     alt="기존 이미지"
                     onError={(e) => (e.target.style.display = 'none')} // ✅ 깨진 이미지 숨김
                  />
                  <DeleteButton onClick={() => handleRemoveImage(image.id)}>삭제</DeleteButton>
               </ImagePreview>
            ))}
         </UploadContainer>

         <ButtonContainer>
            <UploadContainer>
               <UploadButton>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                  이미지 업로드
               </UploadButton>
               {imageFiles.length > 0 &&
                  imageFiles.map((file, index) => {
                     const previewURL = URL.createObjectURL(file)
                     return (
                        <ImagePreview key={index}>
                           <img src={previewURL} alt="미리보기" style={{ width: '100px', marginLeft: '10px' }} />
                           <DeleteButton onClick={() => handleRemoveImage(index)}>삭제</DeleteButton>
                        </ImagePreview>
                     )
                  })}
            </UploadContainer>

            <SubmitButton onClick={handleSubmit}>{initialValues ? '수정하기' : '글쓰기'}</SubmitButton>
         </ButtonContainer>

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
   gap: 20px;
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
   justify-content: flex-start;
   margin-left: 120px;
`

const UploadButton = styled.label`
   display: inline-block;
   padding: 10px 15px;
   font-size: 14px;
   color: #555;
   border: 1px solid #ccc;
   border-radius: 20px;
   cursor: pointer;
   text-align: center;
   width: 150px;

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

      &:hover {
         background-color: #e66a00;
      }
   }
`

const BackButton = styled(Button)`
   && {
      background-color: #ddd;
      color: #333;
      font-weight: bold;
      padding: 10px 20px;
      border-radius: 20px;
      width: 150px;
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
   margin: 10px;

   img {
      width: 100px;
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
