// 로그인
import React, { useState } from 'react'
import styled from 'styled-components'
import { TextField, Button, Divider, Checkbox, FormControlLabel } from '@mui/material'
import { Google } from '@mui/icons-material'
import { Link } from 'react-router-dom'

//ui툴만 구현.

const Login = () => {
   const [formData, setFormData] = useState({
      id: '',
      password: '',
   })

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
   }

   const handleSubmit = (e) => {
      e.preventDefault()
      console.log('로그인 데이터:', formData)
   }

   return (
      <Wrapper>
         <FormContainer>
            <Title>로그인</Title>
            <StyledDivider />

            <InputWrapper>
               <StyledTextField label="아이디" name="id" value={formData.id} onChange={handleChange} />
               <StyledTextField label="비밀번호" name="password" type="password" value={formData.password} onChange={handleChange} />
            </InputWrapper>

            <RememberMeWrapper>
               <FormControlLabel control={<Checkbox />} label="아이디 저장" />
            </RememberMeWrapper>

            <StyledButton onClick={handleSubmit}>로그인</StyledButton>

            {/* 아이디 찾기, 비밀번호 찾기, 회원가입 */}
            <FindLinks>
               <LinkText to="/find-id">아이디 찾기</LinkText> |<LinkText to="/find-password">비밀번호 찾기</LinkText> |<LinkText to="/signup">회원가입</LinkText>
            </FindLinks>

            {/* SNS 로그인 */}
            <StyledDividerText>
               <Line /> SNS 로그인 <Line />
            </StyledDividerText>

            <SNSWrapper>
               <KakaoButton>카카오 로그인</KakaoButton>
               <SNSLogin startIcon={<Google />}>구글 로그인</SNSLogin>
            </SNSWrapper>
         </FormContainer>
      </Wrapper>
   )
}

export default Login

// 🔥 Styled Components
const Wrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100vh;
   background-color: transparent; /* 배경색 제거 */
`

const FormContainer = styled.div`
   width: 650px;
   padding: 30px;
   display: flex;
   flex-direction: column;
`

const Title = styled.h2`
   font-size: 32px;
   margin-bottom: 30px;
   color: black; /* 검정색으로 변경 */
`

const StyledDivider = styled.div`
   width: 100%;
   height: 3px;
   background-color: #ff7a00;
   display: flex; /* Flex 적용 */
   min-height: 3px; /* 최소 높이 강제 적용 */
   margin-top: 10px; /* 로그인 제목과의 간격 */
   margin-bottom: 40px; /* 주황색 줄과 입력 필드 간 간격 증가 */
`

const InputWrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 40px; /* 입력 필드 사이 간격 강제 적용 */
   width: 100%;
   max-width: 650px;
`

const StyledTextField = styled(TextField)`
   width: 100%;
   max-width: 650px;
   height: 60px !important;
   margin-bottom: 0 !important; /* 🔥 입력 필드 간 간격을 줄임 */
   margin-top: 0 !important;
   padding: 0 !important;
`

const RememberMeWrapper = styled.div`
   align-self: flex-start;
   margin-bottom: 40px; /* 체크박스와 로그인 버튼 간 간격 추가 */
`

const StyledButton = styled(Button)`
   width: 100%;
   max-width: 650px;
   height: 60px;
   background-color: #ff7a00 !important;
   color: white !important;
   font-size: 18px;
   padding: 10px;
   margin-bottom: 30px; /* 🔥 로그인 버튼과 아이디 찾기 간 간격 조정 */
   border-radius: 10px !important;
   align-self: center;
`

const FindLinks = styled.div`
   display: flex;
   justify-content: center;
   gap: 20px; /* 🔥 각 항목 간 간격 증가 */
   margin-top: 60px;
   margin-bottom: 30px; /* 🔥 SNS 로그인과의 간격 조정 */
   font-size: 16px;
`

const LinkText = styled(Link)`
   color: black;
   text-decoration: none;
   &:hover {
      text-decoration: underline;
   }
`
const StyledDividerText = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   width: 100%;
   max-width: 650px;
   margin: 40px 0 30px; /* SNS 로그인 선 간격 조정 */
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

const SNSWrapper = styled.div`
   width: 100%;
   max-width: 650px;
   display: flex;
   flex-direction: column;
   gap: 12px;
   margin-bottom: 120px; /* SNS 로그인과 푸터 사이 간격 증가 */
`

const KakaoButton = styled(Button)`
   width: 100%;
   max-width: 650px;
   height: 60px;
   background-color: #fee500 !important;
   color: black !important;
   font-weight: bold;
   border-radius: 50px !important;
`

const SNSLogin = styled(Button)`
   width: 100%;
   max-width: 650px;
   height: 60px;
   display: flex;
   align-items: center;
   justify-content: flex-start;
   padding-left: 20px;
   border: 1px solid #ddd !important;
   border-radius: 50px !important;
   color: #000 !important;
   background: white !important;
   font-weight: bold;
`
