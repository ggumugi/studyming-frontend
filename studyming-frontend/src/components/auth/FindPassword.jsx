import React, { useState } from 'react'
import styled from 'styled-components'
import { TextField, Button } from '@mui/material'
import { Link } from 'react-router-dom'

const FindPassword = () => {
   //ui 툴,아이디 입력->비밀번호 입력->인증코드 입력(임시 1234) -> 비밀번호 재설정하는 흐름 ui 구현
   //비밀번호 재설정 시 두 입력필드에 입력한 값이 다르면 빨간글씨로 일치하지않습니다 뜨게 하기
   //비밀번호 재설정하고 어디로 가는게 좋을까여 로그인창?

   const [step, setStep] = useState(1) // 단계 관리
   const [id, setId] = useState('') // 아이디 상태
   const [email, setEmail] = useState('') // 이메일 상태
   const [verificationCode, setVerificationCode] = useState('') // 인증번호 상태
   const [inputCode, setInputCode] = useState('') // 입력한 인증번호 상태
   const [newPassword, setNewPassword] = useState('') // 새 비밀번호 상태
   const [confirmPassword, setConfirmPassword] = useState('') // 비밀번호 확인 상태
   const [isPasswordMatch, setIsPasswordMatch] = useState(true) // 비밀번호 일치 여부

   const handleIdChange = (e) => setId(e.target.value)

   const handleEmailChange = (e) => setEmail(e.target.value)

   const handleCodeChange = (e) => setInputCode(e.target.value)

   const handlePasswordChange = (e) => setNewPassword(e.target.value)

   const handleConfirmPasswordChange = (e) => {
      setConfirmPassword(e.target.value)
      setIsPasswordMatch(e.target.value === newPassword) // 비밀번호 일치 여부 확인
   }

   const handleSubmit = () => {
      if (step === 1) {
         if (id) {
            alert('가입하신 이메일을 입력해주세요.')
            setStep(2)
         } else {
            alert('아이디를 입력해주세요.')
         }
      } else if (step === 2) {
         if (email) {
            alert('이메일로 인증번호가 전송되었습니다.')
            setVerificationCode('1234')
            setStep(3)
         } else {
            alert('이메일을 입력해주세요.')
         }
      } else if (step === 3) {
         if (inputCode === verificationCode) {
            alert('인증번호 확인 완료! 비밀번호를 재설정하세요.')
            setStep(4)
         } else {
            alert('인증번호가 일치하지 않습니다.')
         }
      } else if (step === 4) {
         if (newPassword && confirmPassword) {
            if (isPasswordMatch) {
               alert('비밀번호가 성공적으로 재설정되었습니다.')
            } else {
               alert('비밀번호가 일치하지 않습니다.')
            }
         } else {
            alert('새로운 비밀번호와 확인 비밀번호를 입력해주세요.')
         }
      }
   }

   return (
      <Wrapper>
         <FormContainer>
            <Title>비밀번호 찾기</Title>
            <StyledDivider />
            {/* 아이디 입력 */}
            {step === 1 && (
               <>
                  <StyledTextField label="아이디" name="id" type="text" value={id} onChange={handleIdChange} />
                  <SmallText>가입하신 아이디를 입력해주세요</SmallText>
                  <StyledButton onClick={handleSubmit}>확인</StyledButton>
               </>
            )}
            {/* 이메일 입력 */}
            {step === 2 && (
               <>
                  <StyledTextField label="이메일" name="email" type="email" value={email} onChange={handleEmailChange} />
                  <SmallText>가입하신 이메일을 입력해주세요</SmallText>
                  <StyledButton onClick={handleSubmit}>확인</StyledButton>
               </>
            )}
            {/* 인증번호 입력 */}
            {step === 3 && (
               <>
                  <StyledTextField label="인증번호 입력" name="verificationCode" type="text" value={inputCode} onChange={handleCodeChange} />
                  <SmallText>이메일로 발송하신 인증번호를 입력해주세요</SmallText>
                  <StyledButton onClick={handleSubmit}>아이디 확인</StyledButton>
               </>
            )}
            {/* 비밀번호 재설정 */}
            {step === 4 && (
               <>
                  <StyledTextField label="새 비밀번호" name="newPassword" type="password" value={newPassword} onChange={handlePasswordChange} />
                  <SmallText>비밀번호는 최소 8자 이상, 영어 / 숫자 / 특수문자(!@#$%^&*)를 포함해야 합니다.</SmallText>

                  <StyledTextField label="비밀번호 확인" name="PasswordCheck" type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                  {!isPasswordMatch && <ErrorText>비밀번호가 일치하지 않습니다.</ErrorText>}
                  <StyledButton onClick={handleSubmit} style={{ marginTop: '20px' }}>
                     비밀번호 재설정
                  </StyledButton>
               </>
            )}
            <LinkText>
               <Link to="/login">로그인</Link> | <Link to="/signup">회원가입</Link>
            </LinkText>
         </FormContainer>
      </Wrapper>
   )
}

export default FindPassword

// Styled Components
const Wrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100vh;
   background-color: transparent;
`

const FormContainer = styled.div`
   width: 650px;
   padding: 40px;
   text-align: center;
   background-color: transparent;
`

const Title = styled.h2`
   font-size: 32px;
   margin-bottom: 10px;
   color: black;
   text-align: left;
`

const StyledDivider = styled.div`
   border-top: 2px solid #ff7a00;
   margin: 15px 0;
`

const StyledTextField = styled(TextField)`
   width: 100%;
   margin-bottom: 30px;
`

const SmallText = styled.p`
   font-size: 12px;
   color: gray;
   margin: 10px 0;
   text-align: left;
`

const ErrorText = styled.p`
   font-size: 12px;
   color: red;
   margin-top: 10px;
   text-align: left;
`

const StyledButton = styled(Button)`
   width: 100%;
   height: 60px;
   background-color: #ff7a00 !important;
   border-radius: 10px !important;
   text-align: left;
   color: white !important;
   font-size: 16px;
   padding: 10px;
   margin: 40px 0;
`

const LinkText = styled.p`
   font-size: 14px;
   margin-top: 20px;
   text-align: center;
   color: gray;
   margin-bottom: 20px;
`
