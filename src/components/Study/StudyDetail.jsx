import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudygroupByIdThunk } from '../../features/studygroupSlice'
import { createGroupMemberThunk, fetchGroupMembersThunk, participateInGroupThunk, deleteGroupMemberThunk } from '../../features/groupmemberSlice'

const StudyDetail = ({ isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams() // URL에서 스터디 그룹 ID 추출

   // Redux에서 스터디 그룹 데이터 가져오기
   const { studygroup } = useSelector((state) => state.studygroups)
   const { groupmembers } = useSelector((state) => state.groupmembers.groupmember) // 그룹 멤버 데이터
   const [isMember, setIsMember] = useState(false) // 멤버 여부 상태

   // 비밀번호 모달 관련 상태 추가
   const [showPasswordModal, setShowPasswordModal] = useState(false)
   const [password, setPassword] = useState('')
   const [passwordError, setPasswordError] = useState('')

   // 입장 주의사항 모달 상태 추가
   const [showEnterWarningModal, setShowEnterWarningModal] = useState(false)

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

   // 비밀번호 입력 핸들러
   const handlePasswordChange = (e) => {
      // 숫자만 입력 가능하도록 처리
      const value = e.target.value.replace(/[^0-9]/g, '')
      if (value.length <= 6) {
         setPassword(value)
      }
   }

   // 비밀번호 제출 핸들러
   const handlePasswordSubmit = () => {
      if (password.length !== 6) {
         setPasswordError('비밀번호는 6자리 숫자여야 합니다.')
         return
      }

      // 비밀번호 검증 후 가입 처리
      if (password === studygroup.password) {
         setShowPasswordModal(false)

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
      } else {
         setPasswordError('비밀번호가 일치하지 않습니다.')
      }
   }

   const handleStudyJoinClick = () => {
      if (!isAuthenticated) {
         alert('로그인이 필요합니다.')
         navigate('/login')
         return
      }

      // 비공개 스터디인 경우 비밀번호 모달 표시
      if (!studygroup.open) {
         setShowPasswordModal(true)
         return
      }

      // 공개 스터디인 경우 바로 가입 처리
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

   // 스터디 입장 버튼 클릭 시 - 주의사항 모달 표시
   const handleStudyEnterClick = () => {
      if (!isAuthenticated) {
         alert('로그인이 필요합니다.')
         navigate('/login')
         return
      }

      // 주의사항 모달 표시
      setShowEnterWarningModal(true)
   }

   // 주의사항 확인 후 입장 처리
   const handleConfirmEnter = () => {
      setShowEnterWarningModal(false)

      dispatch(participateInGroupThunk({ groupId: id, status: 'on' })) // 참여 상태 업데이트 API 요청
         .unwrap()
         .then(() => navigate(`/studygroup/${id}`, groupmembers))
         .catch((err) => {
            console.error('스터디 참여 실패: ', err)
            alert('스터디에 참여할 수 없습니다.')
         })
   }

   // 탈퇴 버튼 핸들러 추가
   const handleStudyLeaveClick = () => {
      if (studygroup.createdBy === user?.id) {
         alert('방장은 바로 탈퇴할 수 없습니다. 방장 위임을 먼저 진행하세요.')
         navigate(`/study/leader/transfer/${id}`, groupmembers) // 방장 위임 페이지로 이동
         return
      }

      if (window.confirm('정말로 스터디를 탈퇴하시겠습니까?')) {
         dispatch(deleteGroupMemberThunk({ groupId: id, userId: user.id }))
            .unwrap()
            .then(() => {
               alert('스터디에서 성공적으로 탈퇴하였습니다.')
               navigate('/study/list') // 탈퇴 후 홈 화면으로 이동
            })
            .catch((err) => {
               console.error('스터디 탈퇴 실패:', err)
               alert('스터디를 탈퇴할 수 없습니다.')
            })
      }
   }

   // 모달 닫기 핸들러
   const handleCloseModal = () => {
      setShowPasswordModal(false)
      setPassword('')
      setPasswordError('')
   }

   // 주의사항 모달 닫기
   const handleCloseWarningModal = () => {
      setShowEnterWarningModal(false)
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
                     <LabelText>방장</LabelText>
                     <DetailText>{studygroup.Groupmembers && studygroup.Groupmembers.length > 0 && studygroup.Groupmembers[0].User ? studygroup.Groupmembers[0].User.nickname : '정보 없음'}</DetailText>
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
               {isMember ? (
                  <SubmitButton onClick={handleStudyEnterClick}>스터디 입장하기</SubmitButton>
               ) : (
                  <SubmitButton onClick={handleStudyJoinClick} disabled={studygroup.countMembers == studygroup.maxMembers}>
                     스터디 가입하기
                  </SubmitButton>
               )}
               {studygroup.createdBy === user?.id && <SubmitButton2 onClick={handleStudyEditClick}>스터디 정보 수정하기</SubmitButton2>}

               {isMember && (
                  <ButtonWrapper>
                     <BackButton onClick={handleStudyLeaveClick}>스터디 탈퇴하기</BackButton>
                  </ButtonWrapper>
               )}

               {/* 비밀번호 입력 모달 */}
               {showPasswordModal && (
                  <ModalOverlay>
                     <ModalContent>
                        <ModalTitle>비밀번호 입력</ModalTitle>
                        <ModalDescription>이 스터디는 비공개 스터디입니다. 가입하려면 비밀번호를 입력하세요.</ModalDescription>

                        <PasswordInput type="text" placeholder="6자리 숫자 입력" value={password} onChange={handlePasswordChange} maxLength={6} />

                        {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}

                        <ModalButtonGroup>
                           <ModalCancelButton onClick={handleCloseModal}>취소</ModalCancelButton>
                           <ModalSubmitButton onClick={handlePasswordSubmit}>확인</ModalSubmitButton>
                        </ModalButtonGroup>
                     </ModalContent>
                  </ModalOverlay>
               )}

               {/* 스터디 입장 주의사항 모달 */}
               {showEnterWarningModal && (
                  <ModalOverlay>
                     <WarningModalContent>
                        <WarningIcon>⚠️</WarningIcon>
                        <ModalTitle>스터디 입장 시 주의사항</ModalTitle>
                        <WarningMessage>
                           나가기 버튼을 이용하지 않고 비정상적인 방법으로 그룹을 퇴장하실 경우
                           <HighlightText>타이머가 정상 작동하지 않을 수 있습니다.</HighlightText>
                        </WarningMessage>
                        <WarningSubMessage>
                           스터디룸을 떠날 때는 반드시 화면 우측 상단의 <HighlightText>나가기</HighlightText> 버튼을 사용해 주세요.
                        </WarningSubMessage>
                        <ModalButtonGroup>
                           <ModalCancelButton onClick={handleCloseWarningModal}>취소</ModalCancelButton>
                           <ModalSubmitButton onClick={handleConfirmEnter}>확인했습니다</ModalSubmitButton>
                        </ModalButtonGroup>
                     </WarningModalContent>
                  </ModalOverlay>
               )}
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
   padding: 0px 40px 40px 40px;
   width: 100%;
   max-width: 800px; /* 적절한 최대 너비 유지 */
   margin: 30px auto 0 auto; /* 좌우 중앙 정렬 */

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
   font-size: clamp(16px, 2vw, 20px);
   font-weight: 300;
   margin-bottom: 10px;
`

const StyledDivider = styled.div`
   width: 100%;
   height: 2px;
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
      gap: 0;
   }
`

const LabelText = styled.span`
   flex: 0 0 150px;
   font-size: clamp(14px, 2vw, 16px);
   font-weight: 300;
   text-align: left;
   @media (max-width: 768px) {
      flex: 0 0 25px;
   }
`

const DetailText = styled.span`
   font-size: clamp(14px, 2vw, 16px);
   color: #8e8e8e;
   font-weight: 300;
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
   font-weight: 300;
   line-height: 1.5;
   color: #8e8e8e;
   padding: 10px;
   border-radius: 5px;

   word-break: break-word; /* 긴 단어도 줄바꿈 */
   overflow-wrap: break-word; /* 자동 줄바꿈 */
   white-space: normal; /* 텍스트가 자동으로 여러 줄로 표시됨 */
`

const SubmitButton = styled.button`
   padding: 12px 20px;
   background-color: #ff7a00;
   color: white;
   font-size: clamp(14px, 2vw, 16px);
   border: none;
   border-radius: 5px;
   cursor: pointer;
   margin-top: 30px; /* 버튼과 마지막 항목 사이 간격 추가 */
   width: 100%;

   &:hover {
      background-color: #e66e00;
   }
`

const SubmitButton2 = styled.button`
   padding: 12px 20px;
   background-color: #3498db;
   color: white;
   font-size: clamp(14px, 2vw, 16px);
   border: none;
   border-radius: 5px;
   cursor: pointer;
   margin-top: 30px; /* 버튼과 마지막 항목 사이 간격 추가 */
   width: 100%;
   &:hover {
      background-color: #2980b9;
   }
`
const ButtonWrapper = styled.div`
   display: flex;
   justify-content: center;
   margin-top: 50px;
`

const BackButton = styled.button`
   background-color: transparent;
   color: #ffa654;
   text-decoration: underline;
   padding: 10px 20px;
   border: none;
   font-weight: 400;
   font-size: clamp(14px, 2vw, 16px);
   cursor: pointer;
`
const ModalOverlay = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(0, 0, 0, 0.5);
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 1000;
`

const ModalContent = styled.div`
   background-color: white;
   padding: 30px;
   border-radius: 10px;
   width: 90%;
   max-width: 400px;
   display: flex;
   flex-direction: column;
   align-items: center;
`

const ModalTitle = styled.h3`
   font-size: 18px;
   margin-bottom: 15px;
   font-weight: 500;
`

const ModalDescription = styled.p`
   font-size: 14px;
   color: #666;
   margin-bottom: 20px;
   text-align: center;
`

const PasswordInput = styled.input`
   width: 100%;
   padding: 12px 15px;
   border: 1px solid #ddd;
   border-radius: 5px;
   font-size: 16px;
   margin-bottom: 15px;
   text-align: center;
   letter-spacing: 5px;

   &:focus {
      border-color: #ff7a00;
      outline: none;
   }
`

const ErrorMessage = styled.p`
   color: #e74c3c;
   font-size: 14px;
   margin-bottom: 15px;
`

const ModalButtonGroup = styled.div`
   display: flex;
   justify-content: center;
   gap: 15px;
   width: 100%;
   margin-top: 10px;
`

const ModalCancelButton = styled.button`
   padding: 10px 20px;
   background-color: #f1f1f1;
   color: #333;
   border: none;
   border-radius: 5px;
   cursor: pointer;
   font-size: 14px;

   &:hover {
      background-color: #e1e1e1;
   }
`

const ModalSubmitButton = styled.button`
   padding: 10px 20px;
   background-color: #ff7a00;
   color: white;
   border: none;
   border-radius: 5px;
   cursor: pointer;
   font-size: 14px;

   &:hover {
      background-color: #e66e00;
   }
`

const WarningModalContent = styled(ModalContent)`
   max-width: 450px;
   padding: 35px;
`

const WarningIcon = styled.div`
   font-size: 40px;
   margin-bottom: 15px;
`

const WarningMessage = styled.p`
   font-size: 16px;
   line-height: 1.6;
   color: #333;
   margin-bottom: 15px;
   text-align: center;
`

const WarningSubMessage = styled.p`
   font-size: 14px;
   line-height: 1.5;
   color: #666;
   margin-bottom: 20px;
   text-align: center;
`

const HighlightText = styled.span`
   color: #ff5733;
   font-weight: 500;
`
