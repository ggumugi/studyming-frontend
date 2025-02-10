import React, { useState } from 'react'
import styled from 'styled-components'
import { TextField, Button } from '@mui/material'
import { Link } from 'react-router-dom'

//이메일-인증번호-아이디입력 흐름 나타내는 ui 작성(더미데이터로)

//후에 백엔드 연결해서 데이터베이스에서 이메일이랑 아이디 가져오기

const FindIdPage = () => {
   const [email, setEmail] = useState('') // 이메일 상태 관리
   const [isVerified, setIsVerified] = useState(false) // 인증 여부 관리
   const [verificationCode, setVerificationCode] = useState('') // 인증번호 저장
   const [inputCode, setInputCode] = useState('') // 사용자가 입력한 인증번호
   const [foundId, setFoundId] = useState('') // 찾은 아이디
   const [step, setStep] = useState(1) // 페이지 단계 관리

   // 이메일 입력 시 상태 변경
   const handleEmailChange = (e) => {
      setEmail(e.target.value)
   }

   // 인증번호 입력 필드 상태 관리
   const handleCodeChange = (e) => {
      setInputCode(e.target.value)
   }

   // 확인 버튼 클릭 시 동작
   const handleSubmit = () => {
      if (email) {
         alert('이메일로 인증번호가 전송되었습니다.')
         setVerificationCode('1234') // 임시 인증번호
         setStep(2) // 인증번호 입력 페이지로 넘어감
      } else {
         alert('이메일을 입력해주세요.')
      }
   }

   // 인증번호 확인 버튼 클릭 시
   const handleVerifyCode = () => {
      if (inputCode === verificationCode) {
         // 아이디 찾기 성공 시 더미 아이디 설정
         setFoundId('lee1003')
         alert('아이디 찾기 성공! 아이디를 확인하세요.')
         setStep(3) // 아이디 표시 단계로 넘어감
      } else {
         alert('인증번호가 일치하지 않습니다.')
      }
   }

   return (
      <Wrapper>
         <FormContainer>
            <Title>아이디 찾기</Title>
            <StyledDivider />

            {/* 이메일 입력 */}
            {step === 1 && (
               <>
                  <StyledTextField label="이메일" name="email" type="email" value={email} onChange={handleEmailChange} />
                  <SmallText>가입하신 이메일을 입력해주세요</SmallText>
                  <StyledButton onClick={handleSubmit}>확인</StyledButton>
               </>
            )}

            {/* 인증번호 입력 */}
            {step === 2 && (
               <>
                  <StyledTextField label="인증번호 입력" name="verificationCode" type="text" value={inputCode} onChange={handleCodeChange} />
                  <SmallText>이메일로 발송하신 인증번호를 입력해주세요</SmallText>
                  <StyledButton onClick={handleVerifyCode}>확인</StyledButton>
               </>
            )}
            {/* 아이디 찾기 성공 메시지 */}
            {step === 3 && (
               <>
                  <FoundIdText>
                     아이디 찾기 성공! {email}님의 가입된 아이디는: <HighlightedId>{foundId}</HighlightedId> 입니다.
                  </FoundIdText>
               </>
            )}

            <LinkText>
               <Link to="/login">로그인</Link> | <Link to="/signup">회원가입</Link>
            </LinkText>
         </FormContainer>
      </Wrapper>
   )
}

export default FindIdPage

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

const FoundIdText = styled.p`
   font-size: 16px;
   color: gray;
   margin-top: 20px;
   text-align: left;
`

const HighlightedId = styled.span`
   color: #ff7a00; /* 주황색 */
   font-size: 18px; /* 폰트 크기 약간 증가 */
   font-weight: bold; /* 강조 효과 */
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
