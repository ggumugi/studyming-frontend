import React, { useState } from 'react'
import styled from 'styled-components'
import { TextField, Button } from '@mui/material'
import { Google } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const MyInfo = ({ isAuthenticated, user }) => {
   const [confirmPassword, setConfirmPassword] = useState(false)
   const [editing, setEditing] = useState(false)
   const [password, setPassword] = useState('')
   const [googleToken, setGoogleToken] = useState(true) // 구글 연동 더미 데이터
   const [kakaoToken, setKakaoToken] = useState(true) // 카카오 연동 더미 데이터

   const navigate = useNavigate()
   const [formData, setFormData] = useState({
      name: '',
      nickname: '',
      email: '',
      id: '',
      password: '',
      confirmPassword: '',
   })

   const [errors, setErrors] = useState({})

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
   }

   const validate = () => {
      let newErrors = {}

      // 이메일 형식 검사
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
         newErrors.email = '올바른 이메일 형식에 맞춰서 작성해주세요.'
      }

      // 비밀번호 확인
      if (formData.password !== formData.confirmPassword) {
         newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const handlePasswordChange = (event) => {
      setPassword(event.target.value)
   }

   const handlePasswordConfirm = (event) => {
      event.preventDefault()
      setConfirmPassword(true)
   }

   return (
      <InfoContainer>
         {!confirmPassword && (
            <PasswordContainer>
               <PasswordForm>
                  <PasswordInput type="password" placeholder="비밀번호" value={password} onChange={handlePasswordChange} required />
                  <InfoText>내 정보를 수정 및 열람하기 위해서는 비밀번호 인증이 필요합니다.</InfoText>
                  <EditButton onClick={() => setConfirmPassword(true)}>확인</EditButton>
               </PasswordForm>
            </PasswordContainer>
         )}
         {confirmPassword && !editing && (
            <InfoDetails>
               <InfoRow>
                  <Label>이름</Label>
                  <Value>이경희</Value>
               </InfoRow>
               <InfoRow>
                  <Label>이메일</Label>
                  <Value>rudgml2931@naver.com</Value>
               </InfoRow>
               <InfoRow>
                  <Label>비밀번호</Label>
                  <Value>ab******g!</Value>
               </InfoRow>
               <InfoRow>
                  <Label>카카오연동</Label>
                  <Value>X</Value>
               </InfoRow>
               <InfoRow>
                  <Label>구글연동</Label>
                  <Value>X</Value>
               </InfoRow>
               <EditButton
                  onClick={() => {
                     setEditing(true)
                  }}
               >
                  정보 수정
               </EditButton>
            </InfoDetails>
         )}

         {confirmPassword && editing && (
            <InfoForm>
               <InputWrapper>
                  <StyledTextField label="이름" name="name" value={formData.name} onChange={handleChange} helperText="주민등록상 실명을 입력해주세요" />
                  {formData.email && <StyledTextField label="이메일" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email || ''} />}

                  <StyledTextField label="비밀번호" name="password" type="password" value={formData.password} onChange={handleChange} helperText="비밀번호는 최소 8자 이상, 영문/숫자/특수문자를 포함해야 합니다." />
                  <StyledTextField label="비밀번호 확인" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword || ''} />
               </InputWrapper>
               <SNSWrapper>
                  <StyledDividerText>
                     <Line /> SNS 연동 <Line />
                  </StyledDividerText>
                  {googleToken && <SNSLoginOn startIcon={<Google sx={{ color: '#2E61B2' }} />}>구글 연동 완료</SNSLoginOn>}
                  {!googleToken && <SNSLogin startIcon={<Google sx={{ color: '#4285F4' }} />}>구글로 시작하기</SNSLogin>}

                  {kakaoToken && <KakaoButtonOn>카카오 연동 완료</KakaoButtonOn>}
                  {!kakaoToken && <KakaoButton>카카오로 시작하기</KakaoButton>}
               </SNSWrapper>
               <StyledButton
                  onClick={() => {
                     setEditing(false)
                  }}
               >
                  정보 설정 완료
               </StyledButton>
            </InfoForm>
         )}
      </InfoContainer>
   )
}

export default MyInfo

// Styled Components
const InfoContainer = styled.div`
   padding: 50px;
   display: block;
`

const PasswordContainer = styled.div`
   width: 100%;
   text-align: center;
`

const PasswordForm = styled.form`
   display: flex;
   flex-direction: column;
   gap: 15px;
`

const PasswordInput = styled.input`
   width: 100%;
   max-width: 500px;
   height: 50px;
   padding: 10px;
   font-size: 16px;
   border: 1px solid #ddd;
   border-radius: 5px;
   margin: auto;
`

const InfoText = styled.p`
   font-size: 14px;
   color: #888;
   margin: 0;
`

const InfoDetails = styled.div`
   margin-bottom: 40px;
`

const InfoRow = styled.div`
   display: flex;
   margin-bottom: 70px;
   font-size: 18px;
   padding: 0 20px;
`

const Label = styled.div`
   font-weight: 500;
   margin-right: 20px;
   text-align: right;
   flex: 1;
`

const Value = styled.div`
   font-weight: 300;
   margin-left: 20px;
   text-align: left;
   flex: 1;
`

const EditButton = styled.button`
   width: 100%;
   max-width: 500px;
   height: 50px;
   background-color: #ff7a00;
   color: white;
   font-size: 18px;
   border: none;
   cursor: pointer;
   border-radius: 5px;
   margin: 20px auto 0;
   display: block;
`
const InfoForm = styled.div`
   max-width: 500px;
   margin: auto;
`
const InputWrapper = styled.div`
   display: flex;
   flex-direction: column;
   gap: 20px;
`
const StyledTextField = styled(TextField)`
   width: 100%;
   &.MuiTextField-root {
      margin-bottom: 20px; /* ✅ 필드 간격 조정 */
   }
`

const StyledButton = styled.button`
   width: 100%;
   max-width: 500px;
   height: 50px;
   background-color: #ff7a00;
   color: white;
   font-size: 18px;
   border: none;
   cursor: pointer;
   border-radius: 5px;
   margin: 20px auto 0;
   display: block;
`

const SNSWrapper = styled.div`
   display: flex;
   flex-direction: column;
   gap: 10px;
   margin-top: 40px;
`

const StyledDividerText = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 10px;
   color: gray;
   font-size: 14px;
   margin: 15px 0;
`

const Line = styled.div`
   flex: 1;
   height: 1px;
   background-color: lightgray;
`

const SNSLogin = styled(Button)`
   width: 100%;
   max-width: 500px;
   border: 1px solid #4285f4 !important;
   border-radius: 50px !important;
   color: #4285f4 !important;
   background: #fff !important;
   font-weight: bold;
`
const SNSLoginOn = styled(Button)`
   width: 100%;
   max-width: 500px;
   border: 1px solid #ddd !important;
   border-radius: 50px !important;
   color: #2e61b2 !important;
   background: #e9e9e9 !important;
   font-weight: bold;
   pointer-events: none !important; /* 클릭 및 모든 이벤트 차단 */
   box-shadow: none !important; /* 클릭 시 그림자 효과 제거 */
`

const KakaoButton = styled(Button)`
   width: 100%;
   max-width: 500px;
   background-color: #fee500 !important;
   color: black !important;
   font-weight: bold;
   border-radius: 50px !important;
`
const KakaoButtonOn = styled(Button)`
   width: 100%;
   max-width: 500px;
   background-color: #d1c100 !important;
   color: #8e5c2f !important;
   font-weight: bold;
   border-radius: 50px !important;
   pointer-events: none !important; /* 클릭 및 모든 이벤트 차단 */
   box-shadow: none !important; /* 클릭 시 그림자 효과 제거 */
`
