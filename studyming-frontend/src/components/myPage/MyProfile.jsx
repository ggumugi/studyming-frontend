import React, { useState } from 'react'
import styled from 'styled-components'

const MyProfile = () => {
   const [editing, setEditing] = useState(false)

   return (
      <>
         {!editing && (
            <ProfileContainer>
               <ProfileDetails>
                  <ProfileRow>
                     <Label>닉네임</Label>
                     <Value>햄버거</Value>
                  </ProfileRow>
                  <ProfileRow>
                     <Label>성별</Label>
                     <Value>여자</Value>
                  </ProfileRow>
                  <ProfileRow>
                     <Label>생년월일</Label>
                     <Value>1999년 06월 20일</Value>
                  </ProfileRow>
                  <ProfileRow>
                     <Label>관심분야</Label>
                     <Value>물리치료 국가고시</Value>
                  </ProfileRow>
               </ProfileDetails>
               <EditButton onClick={() => setEditing(true)}>프로필 수정</EditButton>
            </ProfileContainer>
         )}
         {editing && (
            <ProfileForm>
               <FormRow>
                  <EditLabel>닉네임</EditLabel>
                  <Input type="text" defaultValue="햄버거" maxLength={6} />
               </FormRow>
               <FormRow>
                  <EditLabel>성별</EditLabel>
                  <RadioGroup>
                     <label>
                        남자 <input type="radio" name="gender" value="남자" />
                     </label>
                     <label>
                        여자 <input type="radio" name="gender" value="여자" />
                     </label>
                     <label>
                        설정안함 <input type="radio" name="gender" value="설정안함" />
                     </label>
                  </RadioGroup>
               </FormRow>
               <FormRow>
                  <EditLabel>생년월일</EditLabel>
                  <Input type="date" />
               </FormRow>
               {/* 관심분야 */}
               <FormRow>
                  <EditLabel>관심분야</EditLabel>
                  <SelectWrapper>
                     <Select>
                        <option>초중고</option>
                        <option>대학(원)</option>
                     </Select>
                     <Select>
                        <option>공무원</option>
                        <option>전문직</option>
                     </Select>
                  </SelectWrapper>
               </FormRow>
               <FormRow>
                  <SelectWrapper>
                     <Select>
                        <option>의료</option>
                        <option>법률</option>
                     </Select>
                     <Select>
                        <option>기술</option>
                        <option>교육</option>
                     </Select>
                  </SelectWrapper>
               </FormRow>
               <FormRow>
                  <SelectWrapper>
                     <Select>
                        <option>사회복지</option>
                        <option>미술</option>
                     </Select>
                     <Select>
                        <option>음악</option>
                        <option>연구</option>
                     </Select>
                  </SelectWrapper>
               </FormRow>
               <SubmitButton onClick={() => setEditing(false)}>프로필 설정 완료</SubmitButton>
            </ProfileForm>
         )}
      </>
   )
}

export default MyProfile

// Styled Components
const ProfileContainer = styled.div`
   padding: 50px;
`

const ProfileDetails = styled.div`
   margin-bottom: 40px;
`

const ProfileRow = styled.div`
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

const ProfileForm = styled.div`
   padding: 50px;
   max-width: 700px;
   margin: auto;
`

const FormRow = styled.div`
   display: flex;
   align-items: center;
   margin-bottom: 70px;
`

const EditLabel = styled.div`
   flex-basis: 20%;
   font-weight: 500;
`

const Input = styled.input`
   padding: 10px;
   font-size: 16px;
   border: 1px solid #ddd;
   border-radius: 5px;
   width: 100%;
`

const RadioGroup = styled.div`
   flex-basis: 70%;
   display: flex;
   justify-content: space-between;
   label {
      margin-right: 10px;
      font-weight: 300;
   }
`

const SelectWrapper = styled.div`
   display: flex;
   flex-wrap: wrap;
   gap: 10px;
   width: 70%;
`

const Select = styled.select`
   flex-basis: 45%;
   padding: 10px;
   font-size: 16px;
   border: 1px solid #ddd;
   border-radius: 5px;
`

const SubmitButton = styled.button`
   width: 100%;
   padding: 15px;
   background-color: #ff7a00;
   color: white;
   font-size: 18px;
   border: none;
   cursor: pointer;
   border-radius: 5px;
   margin-top: 30px;
`
