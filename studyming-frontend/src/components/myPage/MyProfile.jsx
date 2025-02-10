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
                  <NicknameInput type="text" defaultValue="햄버거" maxLength={6} />
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
                  <EditLabel /> {/* 빈 라벨 영역으로 정렬 유지 */}
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
                  <EditLabel /> {/* 빈 라벨 영역으로 정렬 유지 */}
                  <SelectWrapper>
                     <Select>
                        <option>기타</option>
                        <option>미술</option>
                     </Select>
                     {/* 기존 Select를 TextInput으로 대체 */}
                     <TextInput type="text" placeholder="직접 입력" />
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

// 기존 Input 스타일
const Input = styled.input`
   padding: 10px;
   font-size: 16px;
   border: 1px solid #ddd;
   border-radius: 5px;
   width: 80%;
`

// 닉네임 전용 입력창 (Input 확장)
// width 취향에 따라 더 길게 해두 됨
const NicknameInput = styled(Input)`
   width: 25%;
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
   width: 80%;
   justify-content: flex-start;
`

// 기존 Select: 남은 공간을 동일하게 분할
const Select = styled.select`
   flex: 1;
   padding: 10px;
   font-size: 16px;
   border: 1px solid #ddd;
   border-radius: 5px;
`

// 새로 추가된 TextInput: flex: 1로 Select와 동일한 레이아웃 적용
const TextInput = styled.input`
   flex: 1;
   padding: 10px;
   font-size: 16px;
   border: 1px solid #ddd;
   border-radius: 5px;
`

const SubmitButton = styled.button`
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
