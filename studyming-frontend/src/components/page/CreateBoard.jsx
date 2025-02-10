import React, { useState } from 'react'
import styled from 'styled-components'
import { TextField, Button } from '@mui/material'

const CreateBoard = ({ setIsWriting }) => {
   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')
   const [image, setImage] = useState(null)

   // ✅ 이미지 업로드 핸들러
   const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
         setImage(URL.createObjectURL(file)) // 미리보기용 URL 생성
      }
   }

   // ✅ 글쓰기 버튼 클릭 시 동작
   const handleSubmit = () => {
      if (!title.trim() || !content.trim()) {
         alert('제목과 내용을 입력해주세요!')
         return
      }

      // 여기에 API 연동 코드 추가 가능 (예: 백엔드에 데이터 전송)
      console.log({
         title,
         content,
         image,
      })

      alert('게시글이 등록되었습니다!')
   }

   return (
      <Container>
         {/* 제목 */}
         <FormGroup>
            <Label>제목</Label>
            <StyledTextField variant="outlined" placeholder="제목을 입력해주세요." value={title} onChange={(e) => setTitle(e.target.value)} />
         </FormGroup>

         {/* 내용 */}
         <FormGroup>
            <Label>내용</Label>
            <StyledTextField variant="outlined" placeholder="내용을 입력해주세요." multiline rows={8} value={content} onChange={(e) => setContent(e.target.value)} />
         </FormGroup>

         {/* 이미지 업로드 */}
         <UploadContainer>
            <UploadButton>
               <input type="file" accept="image/*" onChange={handleImageUpload} />
               이미지 업로드
            </UploadButton>
         </UploadContainer>
         <Button onClick={() => setIsWriting(false)}>← 뒤로가기</Button>
         {/* 글쓰기 버튼 */}
         <SubmitButton onClick={handleSubmit}>글쓰기</SubmitButton>
      </Container>
   )
}

export default CreateBoard

// ⭐ Styled Components
const Container = styled.div`
   max-width: 800px;
   margin: 100px auto;
   display: flex;
   flex-direction: column;
   gap: 20px;
`

const FormGroup = styled.div`
   display: flex;
   flex-direction: column;
   gap: 5px;
`

const Label = styled.label`
   font-size: 18px;
   font-weight: bold;
`

const StyledTextField = styled(TextField)`
   && {
      background-color: #fff;
   }
`

const UploadContainer = styled.div`
   display: flex;
   justify-content: flex-start;
`

const UploadButton = styled.label`
   display: inline-block;
   padding: 10px 15px;
   font-size: 14px;
   color: #555;
   border: 1px solid #ccc;
   border-radius: 5px;
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
      position: absolute;
      bottom: 30px;
      right: 30px;
      padding: 10px 20px;
      border-radius: 20px;

      &:hover {
         background-color: #e66a00;
      }
   }
`
