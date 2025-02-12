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
            <Label style={{ marginTop: '16.5px' }}>제목</Label>
            <StyledTextField variant="outlined" placeholder="제목을 입력해주세요." value={title} onChange={(e) => setTitle(e.target.value)} />
         </FormGroup>
         {/* 내용 */}
         <FormGroup>
            <Label style={{ marginTop: '16.5px' }}>내용</Label>
            <StyledTextField variant="outlined" placeholder="내용을 입력해주세요." multiline rows={15} value={content} onChange={(e) => setContent(e.target.value)} />
         </FormGroup>
         {/* 이미지 업로드 */}
         <ButtonContainer>
            <UploadContainer>
               <UploadButton>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  이미지 업로드
               </UploadButton>
            </UploadContainer>

            {/* 글쓰기 버튼 */}
            <SubmitButton onClick={handleSubmit}>글쓰기</SubmitButton>
         </ButtonContainer>
         <Button onClick={() => setIsWriting(false)}>← 뒤로가기</Button> {/*뒤로가기는 지워도됨*/}
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
