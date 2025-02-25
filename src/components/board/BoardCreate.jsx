/* 사이드바 눌렀을때 각각의 리스트로 가야함 */
import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { TextField, Button, Typography } from '@mui/material'
import { createPostThunk, updatePostThunk } from '../../features/postSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const BoardCreate = ({ user, category, onSubmit, post = null }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')
   const [images, setImages] = useState([])

   const [imageFiles, setImageFiles] = useState([])
   const [titleError, setTitleError] = useState(false)

   useEffect(() => {
      console.log('images 상태:', images) // ✅ 현재 상태 확인
   }, [images])

   // 기존 게시글이 있다면 (수정 모드), 초기값 설정
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

   const handleImageUpload = (e) => {
      const files = Array.from(e.target.files)
      console.log('업로드된 파일:', files)

      if (files.length > 0) {
         setImageFiles(files)
         const previews = files.slice(0, 3).map((file) => URL.createObjectURL(file))

         console.log('미리보기 이미지:', previews)
         setImages(previews) // ✅ 반드시 배열로 저장
      }
   }

   const handleSubmit = useCallback(() => {
      console.log('최종 카테고리 값:', category)

      if (!title.trim() || !content.trim()) {
         alert('제목과 내용을 입력해주세요!')
         return
      }

      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('category', category)
      imageFiles.forEach((file) => {
         formData.append('images', file)
      })
      console.log('최종 FormData 카테고리 값:', formData.get('category'))

      if (post) {
         // 게시글 수정 모드
         dispatch(updatePostThunk({ id: post.id, postData: formData }))
            .unwrap()
            .then(() => {
               alert('게시글이 수정되었습니다!')
               navigate(`/board/detail/${post.id}`)
            })
            .catch((error) => {
               console.error('게시글 수정 실패:', error)
               alert(`게시글 수정 실패: ${error?.message || '알 수 없는 오류'}`)
            })
      } else {
         // 새 게시글 작성 모드
         onSubmit(formData)
      }
   }, [title, content, category, imageFiles, onSubmit, post, dispatch, navigate])

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

         <ButtonContainer>
            <UploadContainer>
               <UploadButton>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                  이미지 업로드
               </UploadButton>
               {Array.isArray(images) ? images.map((src, index) => <img key={index} src={src} alt="미리보기" style={{ width: '100px', marginLeft: '10px' }} />) : [...images.values()].map((src, index) => <img key={index} src={src} alt="미리보기" style={{ width: '100px', marginLeft: '10px' }} />)}
            </UploadContainer>

            <SubmitButton onClick={handleSubmit}>{post ? '수정하기' : '글쓰기'}</SubmitButton>
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
