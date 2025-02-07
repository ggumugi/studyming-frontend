import React, { useState } from 'react'
import styled from 'styled-components'
import { TextField, Button } from '@mui/material'
import { Google } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const SignupPage = () => {
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

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!validate()) return

      // 회원가입 성공 시 프로필 설정 페이지로 이동 (임시)
      alert('회원가입에 성공하였습니다. 프로필을 입력해주세요.')
      navigate('/profile-setup')
   }

   return (
      <Wrapper>
         <FormContainer>
            <Title>회원가입</Title>
            <StyledDivider /> {/* 주황색 구분선 */}
            <InputWrapper>
               <StyledTextField label="이름" name="name" value={formData.name} onChange={handleChange} helperText="주민등록상 실명을 입력해주세요" />
               <StyledTextField label="닉네임" name="nickname" value={formData.nickname} onChange={handleChange} helperText={errors.nickname || ''} />
               <StyledTextField label="이메일" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email || ''} />
               <StyledTextField label="아이디" name="id" value={formData.id} onChange={handleChange} helperText={errors.id || ''} />
               <StyledTextField label="비밀번호" name="password" type="password" value={formData.password} onChange={handleChange} helperText="비밀번호는 최소 8자 이상, 영문/숫자/특수문자를 포함해야 합니다." />
               <StyledTextField label="비밀번호 확인" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword || ''} />
            </InputWrapper>
            <StyledButton onClick={handleSubmit}>회원가입</StyledButton>
            <SNSWrapper>
               <StyledDividerText>
                  <Line /> SNS로 시작하기 <Line />
               </StyledDividerText>
               <SNSLogin startIcon={<Google />}>구글로 시작하기</SNSLogin>
               <KakaoButton>카카오로 시작하기</KakaoButton>
            </SNSWrapper>
         </FormContainer>
      </Wrapper>
   )
}

export default SignupPage

// ⭐ Styled Components
const Wrapper = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   height: 100vh;
`

const FormContainer = styled.div`
   width: 650px;
   padding: 40px;
   text-align: center;
`

const Title = styled.h2`
   font-weight: bold;
   text-align: left;
   color: black; /* ✅ 회원가입 문구 하얀색 적용 */
`

const StyledDivider = styled.div`
   width: 100%;
   height: 3px;
   background-color: #ff7a00;
   margin: 10px 0 30px 0;
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

const StyledButton = styled(Button)`
   width: 100%;
   background-color: #ff7a00 !important;
   color: white;
   font-size: 16px;
   padding: 10px;
   margin-top: 30px; /* ✅ 비밀번호 확인 필드와 회원가입 버튼 사이 margin 추가 */
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
   margin: 20px 0;
`

const Line = styled.div`
   flex: 1;
   height: 1px;
   background-color: lightgray;
`

const SNSLogin = styled(Button)`
   width: 100%;
   border: 1px solid #ddd !important;
   border-radius: 50px !important;
   color: #000 !important;
   background: white !important;
   font-weight: bold;
`

const KakaoButton = styled(Button)`
   width: 100%;
   background-color: #fee500 !important;
   color: black !important;
   font-weight: bold;
   border-radius: 50px !important;
`
