import React, { useState } from 'react'
import styled from 'styled-components'
import { TextField, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { createPostThunk } from '../../features/postSlice'

const CreateBoard = ({ setIsWriting, user }) => {
   const dispatch = useDispatch()
   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')
   const [images, setImages] = useState([])
   const [imageFiles, setImageFiles] = useState([])

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
      if (!user || !user.id) {
         alert('로그인이 필요합니다.')
         return
      }

      if (!title.trim() || !content.trim()) {
         alert('제목과 내용을 입력해주세요!')
         return
      }

      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('category', 'free')
      formData.append('userId', user.id)
      imageFiles.forEach((file) => {
         formData.append('images', file)
      })

      console.log(formData, '크리에이트보드')

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

   return (
      <Container>
         <FormGroup>
            <Label>제목</Label>
            <StyledTextField variant="outlined" placeholder="제목을 입력해주세요." value={title} onChange={(e) => setTitle(e.target.value)} />
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

            <SubmitButton onClick={handleSubmit} disabled={!user}>
               {user ? '글쓰기' : '로그인이 필요합니다'}
            </SubmitButton>
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
   display: flex;
   align-items: flex-start; // Label을 위쪽으로 정렬
   justify-content: center; // 중앙 정렬
   width: 100%; // 적절한 너비 조정
   gap: 20px; // 제목과 입력 필드 간격 조정
   margin: 0 auto; // 전체적으로 가운데 정렬
`

const Label = styled.label`
   font-size: 18px;
   font-weight: bold;

   width: 100px; // 고정 너비로 정렬
`

const StyledTextField = styled(TextField)`
   && {
      background-color: #fff;
      flex: 1; // 남은 공간을 차지하도록 설정
   }
`

const ButtonContainer = styled.div`
   display: flex;
   justify-content: space-between; // 양쪽 끝 정렬
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
