import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { TextField, Button, Typography } from '@mui/material'
import { createPostThunk, updatePostThunk } from '../../features/postSlice'

const CreateBoard = ({ setIsWriting, post = null }) => {
   const dispatch = useDispatch()
   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')
   const [images, setImages] = useState([])
   const [imageFiles, setImageFiles] = useState([])
   const [titleError, setTitleError] = useState(false)

   useEffect(() => {
      if (post) {
         setTitle(post.title)
         setContent(post.content)
         setImages(post.images || [])
      }
   }, [post])

   const handleTitleChange = (e) => {
      const inputValue = e.target.value
      if (inputValue.length > 100) {
         setTitleError(true)
      } else {
         setTitleError(false)
      }
      setTitle(inputValue.slice(0, 100))
   }

   const handleImageUpload = (event) => {
      const files = Array.from(event.target.files)
      if (files.length > 0) {
         setImageFiles(files)
         const previews = files.slice(0, 3).map((file) => URL.createObjectURL(file))
         setImages(previews)
      }
   }

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

      if (post) {
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
         {/* ✅ BoardList와 동일한 타이틀 스타일 적용 */}
         <Header>
            <Title>게시글 작성</Title>
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

            <SubmitButton onClick={handleSubmit}>{post ? '수정하기' : '글쓰기'}</SubmitButton>
         </ButtonContainer>

         <BackButton onClick={() => setIsWriting(false)}>← 뒤로가기</BackButton>
      </Container>
   )
}

export default CreateBoard

//
// Styled Components
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
