import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudygroupByIdThunk } from '../../features/studygroupSlice'
import { createGroupMemberThunk, fetchGroupMembersThunk, participateInGroupThunk } from '../../features/groupmemberSlice'

const StudyDetail = ({ isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams() // URL에서 스터디 그룹 ID 추출

   // Redux에서 스터디 그룹 데이터 가져오기
   const { studygroup } = useSelector((state) => state.studygroups)
   const { groupmembers } = useSelector((state) => state.groupmembers.groupmember) // 그룹 멤버 데이터
   const [isMember, setIsMember] = useState(false) // 멤버 여부 상태

   // 스터디 그룹 데이터 불러오기
   useEffect(() => {
      if (!isAuthenticated) {
         alert('로그인이 필요합니다.')
         navigate('/login')
         return
      }
      dispatch(fetchStudygroupByIdThunk(id))
      dispatch(fetchGroupMembersThunk(id))
   }, [dispatch, id, isAuthenticated])

   useEffect(() => {
      if (groupmembers?.length > 0) {
         const memberExists = groupmembers.some((member) => member.userId === user.id)

         setIsMember(memberExists)
      }
   }, [groupmembers, user])

   // 스터디 수정 버튼 클릭 시 이동
   const handleStudyEditClick = () => {
      navigate(`/study/edit/${id}`)
   }

   const handleStudyJoinClick = () => {
      if (!isAuthenticated) {
         alert('로그인이 필요합니다.')
         navigate('/login')
         return
      }

      dispatch(createGroupMemberThunk({ groupId: id })) // API 요청
         .unwrap()
         .then(() => {
            alert('스터디에 성공적으로 가입했습니다.')
            window.location.reload()
         })
         .catch((err) => {
            console.error('스터디 그룹 가입 실패 : ', err)
            alert('스터디 그룹에 가입할 수 없습니다.')
         })
   }

   // 스터디 입장 버튼 클릭 시
   const handleStudyEnterClick = () => {
      if (!isAuthenticated) {
         alert('로그인이 필요합니다.')
         navigate('/login')
         return
      }

      dispatch(participateInGroupThunk({ groupId: id, status: 'on' })) // 참여 상태 업데이트 API 요청
         .unwrap()
         .then(() => navigate(`/studygroup/${id}`))
         .catch((err) => {
            console.error('스터디 참여 실패: ', err)
            alert('스터디에 참여할 수 없습니다.')
         })
   }

   return (
      <>
         {studygroup && groupmembers && (
            <Wrapper>
               <TitleContainer>
                  <Title>스터디 상세</Title>
                  <StyledDivider />
               </TitleContainer>

               <Content>
                  <DetailRow>
                     <LabelText>스터디 이름</LabelText>
                     <DetailText>{studygroup.name}</DetailText>
                  </DetailRow>

                  <DetailRow>
                     <LabelText>인원</LabelText>
                     <DetailText>
                        {studygroup.countMembers} / {studygroup.maxMembers}
                     </DetailText>
                  </DetailRow>

                  <DetailRow>
                     <LabelText>공개여부</LabelText>
                     <DetailText>{studygroup.open ? '공개' : '비공개'}</DetailText>
                  </DetailRow>

                  <DetailRow>
                     <LabelText>해시태그</LabelText>
                     <TagContainer>
                        {studygroup.Hashtaged?.map((tag, index) => (
                           <Tag key={index}>#{tag.name}</Tag>
                        ))}
                     </TagContainer>
                  </DetailRow>

                  <DetailRow>
                     <LabelText>기간</LabelText>
                     <DetailText>{studygroup.startDate && studygroup.endDate ? `${studygroup.startDate} ~ ${studygroup.endDate}` : '미정'}</DetailText>
                  </DetailRow>

                  <DetailRow>
                     <LabelText>목표 시간</LabelText>
                     <DetailText>{studygroup.timeGoal !== 0 ? `${studygroup.timeGoal}시간` : '없음'}</DetailText>
                  </DetailRow>

                  <DetailRow>
                     <LabelText>접속 시간대</LabelText>
                     <DetailText>{studygroup.startTime && studygroup.endTime ? `${studygroup.startTime} ~ ${studygroup.endTime}` : '자유'}</DetailText>
                  </DetailRow>

                  <DetailRow>
                     <LabelText>상벌점 기능</LabelText>
                     <DetailText>{studygroup.reward ? '적용' : '미적용'}</DetailText>
                  </DetailRow>

                  <DetailRow>
                     <LabelText>스터디 설명</LabelText>
                     <EtiquetteText>{studygroup.description}</EtiquetteText>
                  </DetailRow>
               </Content>

               {/* 조건부 렌더링: 가입 상태에 따라 다른 버튼 표시 */}
               {/* 예시로 가입 전 상태만 표시 */}
               {/* 조건부 렌더링: 가입 상태에 따라 다른 버튼 표시 */}
               {isMember ? (
                  <SubmitButton onClick={handleStudyEnterClick}>스터디 입장하기</SubmitButton>
               ) : (
                  <SubmitButton onClick={handleStudyJoinClick} disabled={studygroup.countMembers == studygroup.maxMembers}>
                     스터디 가입하기
                  </SubmitButton>
               )}
               {studygroup.createdBy === user?.id && <SubmitButton2 onClick={handleStudyEditClick}>스터디 정보 수정하기</SubmitButton2>}
            </Wrapper>
         )}
      </>
   )
}

export default StudyDetail

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center; /* 중앙 정렬 */
   align-items: center;
   min-height: 100vh;
   padding: 40px;
   width: 100%;
   max-width: 800px; /* 적절한 최대 너비 유지 */
   margin: 0 auto; /* 좌우 중앙 정렬 */

   @media (max-width: 768px) {
      padding: 20px;
      width: 95%;
   }
`

const TitleContainer = styled.div`
   width: 100%;
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   margin-bottom: 30px; /* 제목과 내용 사이 간격 추가 */
`

const Title = styled.h2`
   font-size: 32px;
   margin-bottom: 10px;
`

const StyledDivider = styled.div`
   width: 100%;
   height: 3px;
   background-color: #ff7a00;
   margin-bottom: 20px;
`

const Content = styled.div`
   width: 100%;
   display: flex;
   flex-direction: column;
   gap: 20px;
`

const DetailRow = styled.div`
   display: flex;
   justify-content: flex-start; /* 기존 space-between에서 변경 */
   align-items: center;
   gap: 20px;
   width: 100%;
   margin-bottom: 20px; /* 항목 간 간격 추가 */

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
   }
`

const LabelText = styled.span`
   flex: 0 0 150px;
   font-size: 16px;
   font-weight: bold;
   text-align: left;
`

const DetailText = styled.span`
   font-size: 16px;
   color: #333;
   text-align: left;
   flex: 1;
`

const TagContainer = styled.div`
   display: flex;
   gap: 10px;
`

const Tag = styled.span`
   background-color: #f3f3f3;
   padding: 5px 10px;
   border-radius: 5px;
   font-size: 14px;
   color: #555;
`

const EtiquetteText = styled.p`
   font-size: 14px;
   line-height: 1.5;
   color: #666;

   padding: 10px;
   border-radius: 5px;
`

const SubmitButton = styled.button`
   padding: 12px 20px;
   background-color: #ff7a00;
   color: white;
   font-size: 16px;
   border: none;
   border-radius: 5px;
   cursor: pointer;
   margin-top: 30px; /* 버튼과 마지막 항목 사이 간격 추가 */
   width: 70%;

   &:hover {
      background-color: #e66e00;
   }
`

const SubmitButton2 = styled.button`
   padding: 12px 20px;
   background-color: #3498db;
   color: white;
   font-size: 16px;
   border: none;
   border-radius: 5px;
   cursor: pointer;
   margin-top: 30px; /* 버튼과 마지막 항목 사이 간격 추가 */
   width: 70%;

   &:hover {
      background-color: #2980b9;
   }
`
