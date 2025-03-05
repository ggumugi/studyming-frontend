// src/components/myPage/PasswordAuthModal.jsx
import React, { useState } from 'react'
import styled from 'styled-components'
import { CircularProgress } from '@mui/material'
import { useDispatch } from 'react-redux'
import { verifyPasswordThunk } from '../../features/authSlice'

const PasswordAuthModal = ({ isOpen, onClose, onSuccess }) => {
   const dispatch = useDispatch()
   const [password, setPassword] = useState('')
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')

   const handlePasswordChange = (e) => {
      setPassword(e.target.value)
      setError('')
   }

   const handleSubmit = (e) => {
      e.preventDefault()
      if (!password.trim()) {
         setError('비밀번호를 입력해주세요')
         return
      }

      setLoading(true)
      dispatch(verifyPasswordThunk(password))
         .unwrap()
         .then(() => {
            setLoading(false)
            onSuccess() // 인증 성공 시 콜백 호출
            setPassword('')
            onClose() // 모달 닫기
         })
         .catch((errorMessage) => {
            setLoading(false)
            setError(errorMessage || '비밀번호가 일치하지 않습니다.')
         })
   }

   if (!isOpen) return null

   return (
      <ModalOverlay>
         <ModalContainer>
            <ModalHeader>
               <h3>비밀번호 인증</h3>
            </ModalHeader>
            <ModalBody>
               <InfoText>내 정보를 열람하기 위해서는 비밀번호 인증이 필요합니다.</InfoText>
               <PasswordForm onSubmit={handleSubmit}>
                  <PasswordInput type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={handlePasswordChange} autoFocus autoComplete="new-password" />
                  {error && <ErrorMessage>{error}</ErrorMessage>}
                  <ButtonGroup>
                     <CancelButton type="button" onClick={onClose}>
                        취소
                     </CancelButton>
                     <SubmitButton type="submit" disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : '확인'}
                     </SubmitButton>
                  </ButtonGroup>
               </PasswordForm>
            </ModalBody>
         </ModalContainer>
      </ModalOverlay>
   )
}

export default PasswordAuthModal

// Styled Components
const ModalOverlay = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: rgba(0, 0, 0, 0.5);
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 1000;
`

const ModalContainer = styled.div`
   background-color: white;
   border-radius: 8px;
   width: 90%;
   max-width: 450px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   overflow: hidden;
`

const ModalHeader = styled.div`
   padding: 20px;
   border-bottom: 1px solid #eee;

   h3 {
      margin: 0;
      color: #333;
      font-size: 20px;
   }
`

const ModalBody = styled.div`
   padding: 20px;
`

const InfoText = styled.p`
   margin-bottom: 20px;
   color: #666;
   font-size: 14px;
   text-align: center;
`

const PasswordForm = styled.form`
   display: flex;
   flex-direction: column;
   gap: 20px;
`

const PasswordInput = styled.input`
   width: 100%;
   padding: 12px;
   border: 1px solid #ddd;
   border-radius: 4px;
   font-size: 16px;

   &:focus {
      outline: none;
      border-color: #ff7a00;
   }
`

const ErrorMessage = styled.div`
   color: #d32f2f;
   font-size: 14px;
   margin-top: -10px;
`

const ButtonGroup = styled.div`
   display: flex;
   justify-content: flex-end;
   gap: 10px;
   margin-top: 10px;
`

const BaseButton = styled.button`
   padding: 10px 20px;
   border-radius: 4px;
   font-size: 16px;
   cursor: pointer;
   border: none;
   font-weight: 500;
   transition: background-color 0.3s;
`

const CancelButton = styled(BaseButton)`
   background-color: #f5f5f5;
   color: #333;

   &:hover {
      background-color: #e0e0e0;
   }
`

const SubmitButton = styled(BaseButton)`
   background-color: #ff7a00;
   color: white;

   &:hover {
      background-color: #e56e00;
   }

   &:disabled {
      background-color: #ffb980;
      cursor: not-allowed;
   }
`
