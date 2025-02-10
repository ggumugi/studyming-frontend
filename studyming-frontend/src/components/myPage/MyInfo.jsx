import React, { useState } from 'react'
import styled from 'styled-components'

const MyInfo = () => {
   const [confirmPassword, setConfirmPassword] = useState(false)
   const [editing, setEditing] = useState(false)
   const [password, setPassword] = useState('')

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
         {confirmPassword && (
            <ProfileDetails>
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
               <EditButton onClick={() => setConfirmPassword(false)}>정보 수정</EditButton>
            </ProfileDetails>
         )}
      </InfoContainer>
   )
}

export default MyInfo

// Styled Components
const InfoContainer = styled.div`
   padding: 50px;
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
   width: 500px;
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

const ProfileDetails = styled.div`
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
   width: 500px;
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
