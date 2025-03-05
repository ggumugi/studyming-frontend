import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { verifyPasswordThunk, deleteAccountThunk } from '../../features/authSlice'
import { CircularProgress } from '@mui/material'

const AccountDelete = () => {
   const dispatch = useDispatch()
   const { loading, error } = useSelector((state) => state.auth)
   const [step, setStep] = useState(1) // 1: 초기화면, 2: 비밀번호 입력, 3: 탈퇴 완료
   const [showModal, setShowModal] = useState(false)
   const [password, setPassword] = useState('')
   const navigate = useNavigate()

   const handlePasswordChange = (event) => {
      setPassword(event.target.value)
   }

   // 비밀번호 검증 함수
   const handlePasswordVerify = async () => {
      if (!password.trim()) {
         alert('비밀번호를 입력해주세요.')
         return
      }

      try {
         // 비밀번호 검증 요청
         await dispatch(verifyPasswordThunk(password)).unwrap()
         // 검증 성공 - 모달 표시
         setShowModal(true)
      } catch (error) {
         // 검증 실패
         alert(error || '비밀번호가 일치하지 않습니다.')
      }
   }

   const handleDelete = async () => {
      try {
         // 회원 탈퇴 요청
         await dispatch(deleteAccountThunk()).unwrap()
         // 탈퇴 성공
         setShowModal(false)
         setStep(3) // 성공 화면으로 전환
         // 로컬 스토리지 및 세션 스토리지 정리
         localStorage.clear()
         sessionStorage.clear()
      } catch (error) {
         // 탈퇴 실패
         alert(`회원 탈퇴 실패: ${error || '오류가 발생했습니다.'}`)
         setShowModal(false)
      }
   }

   return (
      <Container>
         {loading && (
            <LoadingOverlay>
               <CircularProgress />
            </LoadingOverlay>
         )}

         {step === 1 && (
            <>
               <Description>
                  회원 탈퇴 시, 고객님의 소중한 정보는 전부 안전하게 삭제됩니다.
                  <br />
                  모아두신 잔여포인트, 결제 내역, 채팅 기록 등 모든 관련 데이터는 복구 불가능하게 처리되오니 이 점 유의해 주시기 바랍니다.
                  <br />
                  서비스 이용에 대한 모든 기록이 제거되며, 탈퇴 후에는 다시 <Strong>복구가 불가능</Strong>하니 신중하게 결정해 주세요.
               </Description>
               <DeleteButton onClick={() => setStep(2)}>탈퇴하기</DeleteButton>
            </>
         )}

         {step === 2 && (
            <>
               <Description>
                  회원 탈퇴를 진행하시려면, 보안을 위해 현재 사용 중인 비밀번호를 입력해 주셔야 합니다.
                  <br />
                  이는 고객님의 개인정보 보호를 위한 절차이므로, 정확한 비밀번호 입력 후 탈퇴가 완료됩니다.
               </Description>
               <PasswordInputContainer>
                  <PasswordInput type="password" placeholder="비밀번호" value={password} onChange={handlePasswordChange} required autoFocus />
               </PasswordInputContainer>
               <ButtonContainer>
                  <CancelButtonSmall onClick={() => setStep(1)}>취소</CancelButtonSmall>
                  <DeleteButton onClick={handlePasswordVerify} disabled={loading}>
                     {loading ? '확인 중...' : '확인'}
                  </DeleteButton>
               </ButtonContainer>
            </>
         )}

         {showModal && (
            <ModalOverlay>
               <ModalContent>
                  <ModalTitle>회원 탈퇴 확인</ModalTitle>
                  <ModalDescription>
                     정말로 탈퇴하시겠습니까?
                     <br />
                     모든 데이터가 영구적으로 삭제됩니다.
                  </ModalDescription>
                  <ButtonContainer>
                     <CancelButton onClick={() => setShowModal(false)}>아니요</CancelButton>
                     <ConfirmButton onClick={handleDelete} disabled={loading}>
                        {loading ? <SmallSpinner size={20} /> : '예'}
                     </ConfirmButton>
                  </ButtonContainer>
               </ModalContent>
            </ModalOverlay>
         )}

         {step === 3 && (
            <>
               <SuccessMessage>
                  <SuccessIcon>✓</SuccessIcon>
                  <h3>탈퇴가 완료되었습니다.</h3>
                  <p>그동안 서비스를 이용해 주셔서 감사합니다.</p>
               </SuccessMessage>
               <DeleteButton onClick={() => navigate('/')}>홈화면으로 이동</DeleteButton>
            </>
         )}
      </Container>
   )
}

export default AccountDelete

// Styled Components
const Container = styled.div`
   padding: 50px;
   display: flex;
   justify-content: center;
   text-align: center;
   flex-direction: column;
   position: relative;
`

const Description = styled.p`
   font-size: 14px;
   color: #888;
   line-height: 1.6;
   margin-bottom: 20px;
`

const Strong = styled.strong`
   color: red;
`

const DeleteButton = styled.button`
   width: 100%;
   max-width: 500px;
   height: 50px;
   background-color: #ff7a00;
   color: white;
   font-size: 18px;
   border: none;
   cursor: pointer;
   border-radius: 5px;
   display: block;
   margin: 0 auto;
   &:hover {
      background-color: #e06b00;
   }
   &:disabled {
      background-color: #ffb980;
      cursor: not-allowed;
   }
`

const PasswordInputContainer = styled.div`
   width: 100%;
   max-width: 500px;
   margin: 0 auto 20px;
   position: relative;
`

const PasswordInput = styled.input`
   width: 100%;
   height: 50px;
   padding: 10px;
   font-size: 16px;
   border: 1px solid #ddd;
   border-radius: 5px;
   &:focus {
      outline: none;
      border-color: #ff7a00;
   }
`

const ButtonContainer = styled.div`
   display: flex;
   justify-content: center;
   gap: 10px;
   margin-top: 20px;
   max-width: 500px;
   margin: 0 auto;
`

const CancelButtonSmall = styled.button`
   background-color: #ddd;
   color: black;
   width: 100px;
   height: 50px;
   border: none;
   cursor: pointer;
   border-radius: 5px;
   &:hover {
      background-color: #bbb;
   }
`

const ModalOverlay = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background: rgba(0, 0, 0, 0.5);
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 1000;
`

const ModalContent = styled.div`
   background: white;
   padding: 30px;
   border-radius: 10px;
   text-align: center;
   width: 400px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

const ModalTitle = styled.h3`
   margin-top: 0;
   color: #333;
   font-size: 20px;
   margin-bottom: 15px;
`

const ModalDescription = styled.p`
   margin-bottom: 25px;
   color: #666;
   line-height: 1.6;
`

const ConfirmButton = styled.button`
   background-color: #ff3b3b;
   color: white;
   width: 80px;
   padding: 10px 20px;
   border: none;
   cursor: pointer;
   border-radius: 5px;
   &:hover {
      background-color: #d32f2f;
   }
   &:disabled {
      background-color: #ff8080;
      cursor: not-allowed;
   }
`

const CancelButton = styled.button`
   background-color: #ddd;
   color: black;
   width: 80px;
   padding: 10px 20px;
   border: none;
   cursor: pointer;
   border-radius: 5px;
   &:hover {
      background-color: #bbb;
   }
`

const LoadingOverlay = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: rgba(255, 255, 255, 0.7);
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 1000;
`

const SmallSpinner = styled(CircularProgress)`
   && {
      width: ${(props) => props.size || 20}px;
      height: ${(props) => props.size || 20}px;
      color: white;
   }
`

const SuccessMessage = styled.div`
   margin: 30px 0;
   color: #333;

   h3 {
      margin: 15px 0;
      font-size: 22px;
   }

   p {
      color: #666;
   }
`

const SuccessIcon = styled.div`
   width: 60px;
   height: 60px;
   background-color: #4caf50;
   border-radius: 50%;
   display: flex;
   justify-content: center;
   align-items: center;
   margin: 0 auto 20px;
   color: white;
   font-size: 30px;
`
