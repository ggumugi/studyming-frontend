import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'
import { TextField, Button } from '@mui/material'

import { RiKakaoTalkFill } from 'react-icons/ri'
import { FcGoogle } from 'react-icons/fc'

//ui 툴 구상
//이메일 형식 검사(이상하게 입력 시 작성해달라고 글씨가 뜸),비밀번호확인과 비밀번호 입력필드 서로 다르면 안내문자 뜨기 구현

//백엔드 구현 후 닉네임 아이디 중복 검사기능 구현 -> 후에 버튼 눌렀을 시 중복된 닉네임,중복된 아이디입니다 입력필드 밑에 뜨게 구현

const Signup = () => {
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
         newErrors.email = '올바른 이메일 형식에 맞춰서 작성해주세요(예시:studyming@google.com).'
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
      navigate('/profile-setup') //MyProflie 컴포넌트로 가면 됨 후에 설정
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
            <StyledButton onClick={handleSubmit} style={{ marginTop: '30px' }}>
               회원가입
            </StyledButton>
            {/* SNS 로그인 */}
            <StyledDividerText>
               <Line /> SNS 로그인 <Line />
            </StyledDividerText>
            <SNSWrapper>
               <KakaoButton>
                  <RiKakaoTalkFill style={{ fontSize: '32px', transform: 'translateX(-600%)' }} />
                  카카오 로그인
               </KakaoButton>
               <SNSLogin>
                  <FcGoogle style={{ fontSize: '32px', transform: 'translateX(-620%)' }} />
                  구글 로그인
               </SNSLogin>
            </SNSWrapper>
         </FormContainer>
      </Wrapper>
   )
}

export default Signup

// ⭐ Styled Components
const Wrapper = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   height: 100%;
`

const FormContainer = styled.div`
   width: 650px;
   padding: 40px;
   text-align: center;
`

const Title = styled.h2`
   font-weight: bold;
   text-align: left;
   color: black; /* ✅ 회원가입 문구 검정색 적용 */
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
   height: 50px;
   color: white !important;
   font-size: 16px;
   padding: 10px;
   border-radius: 10px !important;
   margin-top: 30px; /* ✅ 비밀번호 확인 필드와 회원가입 버튼 사이 margin 추가 */
`

const SNSWrapper = styled.div`
   display: flex;
   flex-direction: column;
   gap: 10px;
   margin-top: 20px;
   margin-bottom: 170px;
`

const StyledDividerText = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   width: 100%;
   max-width: 650px;
   margin: 40px 0 0px; /* SNS 로그인 선 간격 조정 */
   color: gray;
   font-size: 14px;
   font-weight: 500;
   position: relative;
`

const Line = styled.div`
   flex-grow: 1;
   height: 1px;
   background-color: #ddd;
   margin: 0 15px;
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
