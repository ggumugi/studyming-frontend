/*!!! 디자인 꼭 다듬기 !! */

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { fetchPostsThunk, deletePostThunk, fetchPostByIdThunk } from '../../features/postSlice'
import CommentItem from '../comment/CommentItem'

const BoardDetail = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams() // ✅ URL에서 postId 가져오기
   const post = useSelector((state) => state.posts.post)

   useEffect(() => {
      if (id) {
         dispatch(fetchPostByIdThunk(id))
      }
   }, [dispatch, id])

   useEffect(() => {
      if (post) {
         console.log('불러온 게시글 데이터:', post) // ✅ post 데이터 확인
      }
   }, [post])

   if (!post) return <p>게시글을 불러오는 중...</p>

   // 삭제 버튼
   const handleDelete = () => {
      if (window.confirm('정말 삭제하시겠습니까?')) {
         dispatch(deletePostThunk(post.id))
            .unwrap()
            .then(() => {
               alert('게시글이 삭제되었습니다!')
               navigate('/board') // ✅ 삭제 후 게시판 목록으로 이동
            })
            .catch((error) => {
               console.error('게시글 삭제 실패:', error)
               alert(`게시글 삭제 실패: ${error?.message || '알 수 없는 오류'}`)
            })
      }
   }

   // // ✅ 댓글 추가 기능
   // const handleAddComment = () => {
   //    if (!newComment.trim()) return
   //    const newEntry = {
   //       id: comments.length + 1,
   //       author: '익명',
   //       text: newComment,
   //       date: new Date().toISOString().replace('T', ' ').slice(0, 16),
   //    }
   //    setComments([...comments, newEntry])
   //    setNewComment('') // 입력 필드 초기화
   // }

   // ✅ 댓글 삭제 기능
   // const handleDeleteComment = (id) => {
   //    setComments(comments.filter((comment) => comment.id !== id))
   // }

   return (
      <Container>
         <Header>
            <Title>{}게시판</Title>
         </Header>
         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Label>{post.title}</Label>
            <SubInfo>
               <ButtonGroup>
                  <EditButton onClick={() => navigate(`/board/edit/${post.id}`)}>수정</EditButton>

                  <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
               </ButtonGroup>
               작성자: {post?.User?.nickname} | {new Date(post.createdAt).toLocaleDateString()}
            </SubInfo>
         </div>

         <Content>{post.content}</Content>

         {post.Images && post.Images.length > 0 && (
            <ImageContainer>
               {post.Images.map((image) => {
                  const imagePath = `http://localhost:8000/${image.path}`
                  console.log('이미지 최종 경로:', imagePath) // ✅ 최종 경로 확인
                  return <Image key={image.id} src={imagePath} alt="게시글 이미지" />
               })}
            </ImageContainer>
         )}

         <CommentItem />

         <ButtonWrapper>
            <BackButton onClick={() => navigate('/board')}>목록</BackButton>
         </ButtonWrapper>
      </Container>
   )
}

export default BoardDetail

// Styled Components 적용
//
const Container = styled.div`
   width: 100%;
   padding: 70px 70px 0 70px;
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
const Label = styled.h2`
   font-weight: 300;
   font-size: 20px;
`

const ButtonGroup = styled.div`
   gap: 10px;
`

const EditButton = styled.button`
   background-color: #ffcc99;
   color: white;
   padding: 8px 15px;
   border-radius: 20px;
   border: none;
   cursor: pointer;
   &:hover {
      background-color: #ffb266;
   }
`

const DeleteButton = styled.button`
   background-color: #ff5733;
   color: white;
   padding: 8px 15px;
   border-radius: 20px;
   border: none;
   cursor: pointer;
   &:hover {
      background-color: #e74c3c;
   }
`

const SubInfo = styled.div`
   text-align: right;
   color: #666;
   font-size: 14px;
`

/* const Divider = styled.hr`
   margin: 20px 0;
   border: 0;
   height: 1px;
   background: #ff7a00;
` */

const Content = styled.p`
   font-size: 16px;
   line-height: 1.5;
`

const CommentSection = styled.div`
   display: flex;
   align-items: center;
   margin-top: 20px;
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

const CommentAuthor = styled.p`
   font-weight: bold;
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

const ReportButton = styled.button`
   background: none;
   color: red;
   border: none;
   cursor: pointer;
`

const SmallDeleteButton = styled.button`
   background: none;
   color: red;
   border: none;
   cursor: pointer;
`

const ButtonWrapper = styled.div`
   display: flex;
   justify-content: center;
   margin-top: 20px;
`

const BackButton = styled.button`
   background-color: #ddd;
   color: #333;
   padding: 10px 20px;
   border-radius: 20px;
   border: none;
   cursor: pointer;
   &:hover {
      background-color: #ccc;
   }
`

const ImageContainer = styled.div`
   display: flex;
   flex-wrap: wrap;
   gap: 10px; /* 이미지 간 간격 */
   justify-content: center; /* 가운데 정렬 */
   max-width: 100%; /* 부모 컨테이너를 넘지 않도록 설정 */
   overflow: hidden; /* 넘치는 이미지 숨김 */
`

const Image = styled.img`
   max-width: 100%; /* 부모 요소 내에서 넘치지 않도록 */
   height: auto; /* 가로 비율 유지 */
   object-fit: contain; /* 비율 유지하면서 크기 조절 */
`
