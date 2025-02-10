import React, { useState } from 'react'
import styled from 'styled-components'
import { TextField, Button } from '@mui/material'
import { Link } from 'react-router-dom'

const FindPasswordPage = () => {
   const [email, setEmail] = useState('')

   const handleSubmit = () => {
      alert('아이디 찾기 완료!')
   }

   return (
      <Wrapper>
         <FormContainer>
            <Title>비밀번호 찾기</Title>
            <StyledDivider /> {/* 주황색 선 추가 */}
            <StyledTextField label="아이디" name="id" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <SmallText>가입하신 아이디를 입력해주세요</SmallText> {/* 이메일 안내 문구 추가 */}
            <LinkText>
               <Link to="/login">로그인</Link> | <Link to="/signup">회원가입</Link>
            </LinkText>
            <StyledButton onClick={handleSubmit}>확인</StyledButton>
         </FormContainer>
      </Wrapper>
   )
}

export default FindPasswordPage

// Styled Components
const Wrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100vh;
   background-color: transparent; /* 배경색을 투명하게 설정 */
`

const FormContainer = styled.div`
   width: 650px;
   padding: 40px;
   text-align: center;
   background-color: transparent; /* 배경색을 투명하게 설정 */
`
const Title = styled.h2`
   font-size: 32px;
   margin-bottom: 10px;
   color: black;
   text-align: left;
`

// 주황색 선 추가
const StyledDivider = styled.div`
   border-top: 2px solid #ff7a00;
   margin: 15px 0;
`

const StyledTextField = styled(TextField)`
   width: 100%;
   margin-bottom: 30px;
`

// 문구 스타일 추가
const SmallText = styled.p`
   font-size: 12px;
   color: gray;
   margin-top: 5px; /* 입력 필드와 문구 간 간격 */
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
   margin-bottom: 40px;
`

const LinkText = styled.p`
   font-size: 14px;
   margin-top: 20px;
   text-align: center;
   color: gray;
   margin-bottom: 20px;
`
