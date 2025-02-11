//위임변경 신청 후 탈퇴 보류하는 컴포넌트
import React from 'react'
import styled from 'styled-components'

//ui 툴 구현 //반응형 수정해야함(다 깨짐;;)
//제목 반대편에 위임신청처리중 텍스트 하기(내일^^)

const StudyEdit = () => {
   return (
      <Wrapper>
         <TitleContainer>
            <Title>스터디 상세(탈퇴보류)</Title>
            <StyledDivider />
         </TitleContainer>

         <Form>
            <Label>
               <LabelText>스터디 이름</LabelText>
               <Studyname>스터디 빡쟁이</Studyname>
            </Label>

            <Label>
               <LabelText>공개여부</LabelText>
               <FlexContainer>
                  <RadioGroup>
                     <label>
                        <input type="radio" name="visibility" value="공개" /> 공개
                     </label>
                     <label>
                        <input type="radio" name="visibility" value="비공개" /> 비공개
                     </label>
                  </RadioGroup>
                  <LabelText2>참여시간</LabelText2>
                  <SmallInput type="text" placeholder="숫자 6자리" />
               </FlexContainer>
            </Label>

            <Label>
               <LabelText>해시태그</LabelText>
               <Input type="text" placeholder="해시태그를 입력하세요" />
            </Label>

            <Label>
               <LabelText>기간</LabelText>
               <FlexContainer>
                  <MediumInput type="text" placeholder="25.01.30" />
                  <Spacer>~</Spacer>
                  <MediumInput type="text" placeholder="25.02.30" />
               </FlexContainer>
            </Label>

            <Label>
               <LabelText>목표 시간</LabelText>
               <FlexContainer>
                  <SmallSelect>
                     <option>적용</option>
                     <option>미적용</option>
                  </SmallSelect>
                  <MediumInput type="text" placeholder="1시간" />
               </FlexContainer>
            </Label>

            <Label>
               <LabelText>접속 시간대</LabelText>
               <FlexContainer>
                  <SmallSelect>
                     <option>적용</option>
                     <option>미적용</option>
                  </SmallSelect>
                  <CustomTimeInput type="text" placeholder="09:00" />
                  <Spacer>~</Spacer>
                  <CustomTimeInput type="text" placeholder="20:00" />
               </FlexContainer>
            </Label>

            <Label>
               <LabelText>상벌점 기능</LabelText>
               <RadioGroup>
                  <label>
                     <input type="radio" name="punishment" value="적용" /> 적용
                  </label>
                  <label>
                     <input type="radio" name="punishment" value="미적용" /> 미적용
                  </label>
               </RadioGroup>
            </Label>

            <Label>
               <LabelText>스터디 설명</LabelText>
               <TextArea placeholder="스터디 설명을 입력하세요" />
            </Label>

            <SubmitButton>스터디 탈퇴취소</SubmitButton>
         </Form>
      </Wrapper>
   )
}

export default StudyEdit

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center; /* 화면 중앙 정렬 */
   align-items: center;
   min-height: 100vh; /* 화면 높이 전체 사용하여 중앙 배치 */
   padding: 40px;
   width: 100%; /* 화면 크기에 따라 자연스럽게 조정 */

   @media (max-width: 768px) {
      padding: 20px; /* 모바일에서는 여백을 줄여서 가독성 확보 */
      width: 95%; /* 더 좁은 화면에서는 비율 맞춰 조정 */
   }
`

const TitleContainer = styled.div`
   width: 100%;
   max-width: 800px;
   display: flex;
   flex-direction: column;
   align-items: flex-start; /* 제목 가운데 정렬 */
   text-align: center;
`

const Title = styled.h2`
   font-size: 32px;
   margin-bottom: 10px;
   text-align: center;
`

const StyledDivider = styled.div`
   width: 100%;
   max-width: 800px;
   height: 3px;
   background-color: #ff7a00;
   margin-bottom: 20px;
`

const Form = styled.form`
   display: flex;
   flex-direction: column;
   gap: 20px;
   width: 100%;
   max-width: 800px; /* 입력 필드가 너무 넓어지지 않도록 제한 */
   align-items: center; /* 폼 요소도 가운데 정렬 */
   text-align: center; /* 내부 요소도 가운데 정렬 */
`

const Label = styled.label`
   display: flex;
   align-items: center;
   gap: 20px;
   font-size: 16px;
   font-weight: bold;
   margin-bottom: 10px;
   width: 100%;
   justify-content: flex-start;
`

const LabelText = styled.span`
   flex: 0 0 150px; /* 고정 너비 설정 */
   text-align: left; /* 왼쪽 정렬 */
`

const LabelText2 = styled.span`
   flex: 0 0 150px; /* 고정 너비 설정 */
   text-align: right; /* 왼쪽 정렬 */
`

const FlexContainer = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 10px;
   flex: 1;
   width: 100%;
   max-width: 800px;
`
const Studyname = styled.text`
   padding: 12px;
   font-size: 16px;
   flex: 1; /* 남은 공간을 모두 차지 */
   min-width: 300px; /* 최소 너비 설정 */
   text-align: left;
`

const Input = styled.input`
   padding: 12px;
   font-size: 16px;
   border-radius: 4px;
   border: 1px solid #ccc;
   flex: 1; /* 남은 공간을 모두 차지 */
   min-width: 300px; /* 최소 너비 설정 */
   text-align: left;
`

const SmallInput = styled(Input)`
   padding: 8px;
   font-size: 14px;
   border-radius: 4px;
   border: 1px solid #ccc;
   width: 150px; /* 입력 필드 크기 고정 */
`

const MediumInput = styled(Input)`
   flex: 1;
   min-width: 120px;
   text-align: center;
`

const CustomTimeInput = styled(Input)`
   width: 120px;
   min-width: 100px;
   text-align: center;
`

const TextArea = styled.textarea`
   padding: 12px;
   font-size: 16px;
   border-radius: 4px;
   border: 1px solid #ccc;
   resize: vertical;
   min-height: 100px;
   width: 100%;
   max-width: 800px;
`

const SmallSelect = styled.select`
   padding: 12px;
   font-size: 16px;
   border-radius: 4px;
   border: 1px solid #ccc;
   width: 180px;
`

const RadioGroup = styled.div`
   display: flex;
   justify-content: flex-start; /* 라디오 버튼을 왼쪽 정렬 */
   gap: 20px;
   flex-wrap: wrap;
`

const Spacer = styled.span`
   font-size: 16px;
   font-weight: bold;
   text-align: center;
   min-width: 20px;
`

const SubmitButton = styled.button`
   padding: 12px 20px;
   background-color: #ff7a00;
   color: white;
   font-size: 16px;
   border: none;
   border-radius: 5px;
   cursor: pointer;
   margin-top: 20px;
   align-self: center;
   width: 70%;

   &:hover {
      background-color: #e66e00;
   }
`
