import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { TextField, Button, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { createPostThunk, updatePostThunk } from '../../features/postSlice'

const CreateBoard = ({ setIsWriting, user, post = null }) => {
   const dispatch = useDispatch()
   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')
   const [images, setImages] = useState([])
   const [imageFiles, setImageFiles] = useState([])
   const [titleError, setTitleError] = useState(false) // 제목 길이 초과 여부

   // ✅ 수정 모드일 경우 기존 데이터 로드
   useEffect(() => {
      if (post) {
         setTitle(post.title)
         setContent(post.content)
         setImages(post.images || [])
      }
   }, [post])

   // ✅ 제목 입력 핸들러
   const handleTitleChange = (e) => {
      const inputValue = e.target.value
      if (inputValue.length > 100) {
         setTitleError(true)
      } else {
         setTitleError(false)
      }
      setTitle(inputValue.slice(0, 100)) // 100자까지만 입력 가능
   }

   // ✅ 이미지 업로드 핸들러
   const handleImageUpload = (event) => {
      const files = Array.from(event.target.files)
      if (files.length > 0) {
         setImageFiles(files)
         const previews = files.slice(0, 3).map((file) => URL.createObjectURL(file))
         setImages(previews)
      }
   }

   // ✅ 글쓰기 버튼 클릭 시 API 요청
   const handleSubmit = async () => {
      if (!title.trim() || !content.trim()) {
         alert('제목과 내용을 입력해주세요!')
         return
      }

      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('category', 'free')
      imageFiles.forEach((file) => {
         formData.append('images', file)
      })

      console.log('🔥 FormData 확인:', [...formData.entries()])

      if (post) {
         // ✅ 수정 모드 (기존 게시글 수정)
         dispatch(updatePostThunk({ id: post.id, postData: formData }))
            .unwrap()
            .then(() => {
               alert('게시글이 수정되었습니다!')
               setIsWriting(false)
            })
            .catch((error) => {
               console.error('게시글 수정 실패:', error)
               alert(`게시글 수정 실패: ${error?.message || '알 수 없는 오류'}`)
            })
      } else {
         // ✅ 새 글 작성 모드
         dispatch(createPostThunk(formData))
            .unwrap()
            .then(() => {
               alert('게시글이 등록되었습니다!')
               setIsWriting(false)
            })
            .catch((error) => {
               console.error('게시글 등록 실패:', error)
               alert(`게시글 등록 실패: ${error?.message || '알 수 없는 오류'}`)
            })
      }
   }

   return (
      <Container>
         <FormGroup>
            <Label>제목</Label>
            <div style={{ width: '100%' }}>
               <StyledTextField
                  variant="outlined"
                  placeholder="제목을 입력해주세요. (최대 100자)"
                  value={title}
                  onChange={handleTitleChange}
                  error={titleError} // MUI 기본 오류 스타일 적용
               />
               {titleError && (
                  <Typography color="error" sx={{ mt: 1 }}>
                     100자까지만 입력 가능합니다.
                  </Typography>
               )}
            </div>
         </FormGroup>

         <FormGroup>
            <Label>내용</Label>
            <StyledTextField variant="outlined" placeholder="내용을 입력해주세요." multiline rows={15} value={content} onChange={(e) => setContent(e.target.value)} />
         </FormGroup>

         <ButtonContainer>
            <UploadContainer>
               <UploadButton>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                  이미지 업로드
               </UploadButton>
               {images.map((src, index) => (
                  <img key={index} src={src} alt="미리보기" style={{ width: '100px', marginLeft: '10px' }} />
               ))}
            </UploadContainer>

            <SubmitButton onClick={handleSubmit} /* disabled={!user} */>{post ? '수정하기' : '글쓰기'}</SubmitButton>
         </ButtonContainer>

         <Button onClick={() => setIsWriting(false)}>← 뒤로가기</Button>
      </Container>
   )
}

export default CreateBoard

// ⭐ Styled Components
const Container = styled.div`
   max-width: 100%;
   margin: 100px auto;
   display: flex;
   flex-direction: column;
   gap: 20px;
`

const FormGroup = styled.div`
   display: flex; // ✅ 가로 정렬 대신 블록 레이아웃으로 변경
   width: 100%;
   margin-bottom: 16px;
`

const Label = styled.label`
   font-size: 18px;
   font-weight: bold;
   width: 100px;
`

const StyledTextField = styled(TextField)`
   && {
      background-color: #fff;
      width: 100%; // ✅ 너비를 100%로 확장하여 꽉 차게 표시
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
