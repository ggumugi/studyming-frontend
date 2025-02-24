import React, { useState, useEffect } from 'react' // React 훅 불러오기

import styled from 'styled-components'

const StudyCreate = ({ onSubmit, isAuthenticated, user, initialValues = {} }) => {
   // 상태 초기화 (initialValues가 있으면 해당 값으로 초기화)
   const [name, setName] = useState(initialValues.name || '')
   const [description, setDescription] = useState(initialValues.description || '')
   const [startDate, setStartDate] = useState(initialValues.startDate || '')
   const [endDate, setEndDate] = useState(initialValues.endDate || '')
   const [startTime, setStartTime] = useState(initialValues.startTime || '')
   const [endTime, setEndTime] = useState(initialValues.endTime || '')
   const [password, setPassword] = useState(initialValues.password || '')
   const [timegoal, setTimegoal] = useState(initialValues.timeGoal || '')
   const [capInterval, setCapInterval] = useState(initialValues.capInterval || '')
   const [dayZone, setDayZone] = useState(!!initialValues.startDate) // 기간 적용 여부
   const [timezone, setTimezone] = useState(!!initialValues.startTime) // 접속 시간대 적용 여부
   const [maxMembers, setMaxMembers] = useState(initialValues.maxMembers ?? 6)
   const countMembers = initialValues.countMembers ?? 1

   const [reward, setReward] = useState(initialValues.reward || false)
   const [open, setOpen] = useState(initialValues.open ?? true)

   const [errorMsg, setErrorMsg] = useState(null)
   const [capOnOff, setCapOnOff] = useState(!!initialValues.capInterval) // 보안 문자 간격 적용 여부
   const [goalOnOff, setGoalOnOff] = useState(!!initialValues.timeGoal) // 목표시간 적용 여부
   const [createdBy, setCreatedBy] = useState(null) // 생성자 ID

   // 해시태그 관련 상태
   const [inputValue, setInputValue] = useState('#')
   const [hashtags, setHashtags] = useState(initialValues.Hashtaged || [])

   // composition 처리용 상태
   const [isComposing, setIsComposing] = useState(false) // 조합 중 여부
   const [disableFormatting, setDisableFormatting] = useState(false) // 포매팅 비활성화 여부

   useEffect(() => {
      setCreatedBy(user?.id)

      // 수정 모드일 때 해시태그 초기화
      if (initialValues.id && initialValues.Hashtaged) {
         // initialValues.Hashtaged를 문자열로 변환
         const hashtagsString = initialValues.Hashtaged.map((tag) => `#${tag.name}`).join(' ')
         setInputValue(hashtagsString)

         // updateHashtags와 동일한 로직 적용
         const words = hashtagsString
            .replace(/#/g, '')
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0)
         setHashtags(words)
      }
   }, [user, initialValues.Hashtaged])

   const handleSubmit = (e) => {
      e.preventDefault()

      if (!user) {
         alert('로그인이 필요합니다.')
         return
      }

      const groupData = {
         name,
         description,
         startDate: dayZone ? startDate : null, // dayZone이 false면 null
         endDate: dayZone ? endDate : null, // dayZone이 false면 null
         startTime: timezone ? startTime : null, // timezone이 false면 null
         endTime: timezone ? endTime : null, // timezone이 false면 null
         maxMembers,
         reward,
         open,
         password: open ? '' : password,
         timeGoal: goalOnOff ? timegoal : 0, // timegoal이 false면 0
         capInterval: capInterval ? capInterval : null,
         createdBy,
         hashtags,
      }

      onSubmit(groupData) // onSubmit 호출
   }

   // 포맷팅 헬퍼 함수
   // - 맨 처음에 "#"이 없으면 추가하고
   // - disableFormatting 플래그가 false일 때만 공백 뒤에 자동 "#" 삽입
   const formatInput = (val) => {
      let formatted = val
      if (!formatted.startsWith('#')) {
         formatted = '#' + formatted
      }
      if (!disableFormatting) {
         formatted = formatted.replace(/(\s)(?!#)/g, '$1#')
      }
      return formatted
   }

   // 해시태그 배열 업데이트: 화면에 표시되는 포맷팅된 값에서 '#'를 제거하고 단어별로 분리
   const updateHashtags = (formattedVal) => {
      const words = formattedVal
         .replace(/#/g, '')
         .trim()
         .split(/\s+/)
         .filter((word) => word.length > 0)
      setHashtags(words)
   }

   // onChange: composition 중이 아니라면 포맷팅 적용
   const handleChange = (e) => {
      const newValue = e.target.value
      if (isComposing) {
         // 조합 중일 때는 포맷팅 없이 원시값 그대로 업데이트
         setInputValue(newValue)
         return
      }
      if (disableFormatting) {
         setInputValue(newValue)
         updateHashtags(newValue)
         setDisableFormatting(false)
      } else {
         const formatted = formatInput(newValue)
         setInputValue(formatted)
         updateHashtags(formatted)
      }
   }

   // composition 이벤트 처리
   const handleCompositionStart = () => {
      setIsComposing(true)
   }
   const handleCompositionEnd = (e) => {
      setIsComposing(false)
      const finalValue = e.target.value
      const formatted = formatInput(finalValue)
      setInputValue(formatted)
      updateHashtags(formatted)
   }

   // onKeyDown: Backspace가 눌렸을 때, 만약 커서가 끝에 있고 마지막 문자가 '#'이면 포맷팅 잠시 비활성화
   const handleKeyDown = (e) => {
      if (e.key === 'Backspace') {
         const target = e.target
         if (target.selectionStart === target.selectionEnd && target.selectionStart === inputValue.length && inputValue.endsWith('#')) {
            setDisableFormatting(true)
         }
      }
   }
   return (
      <Wrapper>
         <TitleContainer>
            <Title>{initialValues.id ? '스터디 수정하기' : '스터디 만들기'}</Title>
            <StyledDivider />
         </TitleContainer>

         <Form onSubmit={handleSubmit}>
            <Label>
               <LabelText>스터디 이름</LabelText>
               <NameLabel>
                  <Input type="text" placeholder="스터디 이름을 입력하세요" value={name} onChange={(e) => setName(e.target.value)} />
                  <SmallText>영문/한글로만 작성가능</SmallText>
               </NameLabel>
            </Label>

            <Label>
               <LabelText>최대 인원</LabelText>
               <SmallSelect value={maxMembers} onChange={(e) => setMaxMembers(parseInt(e.target.value))}>
                  {countMembers === 1
                     ? // countMembers가 1인 경우: 2부터 6까지 표시
                       Array.from({ length: 5 }, (_, i) => {
                          const value = 2 + i
                          return (
                             <option key={value} value={value}>
                                {value}
                             </option>
                          )
                       })
                     : // 그 외의 경우: countMembers부터 6까지 표시
                       Array.from({ length: 7 - (initialValues.countMembers || 0) }, (_, i) => {
                          const value = initialValues.countMembers + i
                          return (
                             <option key={value} value={value} disabled={value < initialValues.countMembers}>
                                {value}
                             </option>
                          )
                       })}
               </SmallSelect>
            </Label>

            <Label>
               <LabelText>공개여부</LabelText>
               <RadioGroup>
                  <label>
                     <input type="radio" name="visibility" value="공개" checked={open} onChange={() => setOpen(true)} /> 공개
                  </label>
                  <label>
                     <input type="radio" name="visibility" value="비공개" checked={!open} onChange={() => setOpen(false)} /> 비공개
                  </label>
               </RadioGroup>
            </Label>

            <Label>
               <LabelText>참여코드</LabelText>
               <NameLabel>
                  <SmallInput type="text" placeholder="참여코드 6자리" disabled={open} value={password} onChange={(e) => setPassword(e.target.value)} />
                  <SmallText>참여 가능한 코드입니다</SmallText>
               </NameLabel>
            </Label>

            <Label>
               <LabelText>해시태그</LabelText>
               <Input type="text" placeholder="해시태그를 입력하세요 (예: 국어 수학)" value={inputValue} onChange={handleChange} onCompositionStart={handleCompositionStart} onCompositionEnd={handleCompositionEnd} onKeyDown={handleKeyDown} />
            </Label>

            <Label>
               <LabelText>기간</LabelText>
               <FlexContainer>
                  <SmallSelect value={dayZone ? '적용' : '미적용'} onChange={(e) => setDayZone(e.target.value === '적용')}>
                     <option>적용</option>
                     <option>미적용</option>
                  </SmallSelect>
                  <MediumInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={!dayZone} />
                  <Spacer>~</Spacer>
                  <MediumInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={!dayZone} />
               </FlexContainer>
            </Label>

            <Label>
               <LabelText>목표 시간</LabelText>
               <FlexContainer>
                  <SmallSelect value={goalOnOff ? '적용' : '미적용'} onChange={(e) => setGoalOnOff(e.target.value === '적용')}>
                     <option>적용</option>
                     <option>미적용</option>
                  </SmallSelect>
                  <MediumInput type="number" placeholder="2시간" disabled={!goalOnOff} value={timegoal} onChange={(e) => setTimegoal(parseInt(e.target.value))} />
               </FlexContainer>
            </Label>

            <Label>
               <LabelText>접속 시간대</LabelText>
               <FlexContainer>
                  <SmallSelect value={timezone ? '적용' : '미적용'} onChange={(e) => setTimezone(e.target.value === '적용')}>
                     <option>적용</option>
                     <option>미적용</option>
                  </SmallSelect>
                  <CustomTimeInput type="time" placeholder="09:00" disabled={!timezone} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                  <Spacer>~</Spacer>
                  <CustomTimeInput type="time" placeholder="20:00" disabled={!timezone} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
               </FlexContainer>
            </Label>

            <Label>
               <LabelText>보안 문자 간격</LabelText>
               <FlexContainer>
                  <SmallSelect value={capOnOff ? '적용' : '미적용'} onChange={(e) => setCapOnOff(e.target.value === '적용')}>
                     <option>적용</option>
                     <option>미적용</option>
                  </SmallSelect>
                  <CustomTimeInput type="number" placeholder="10분(분 단위 입력)" disabled={!capOnOff} value={capInterval} onChange={(e) => setCapInterval(parseInt(e.target.value))} />
               </FlexContainer>
            </Label>

            <Label>
               <LabelText>상벌점 기능</LabelText>
               <RadioGroup>
                  <label>
                     <input type="radio" name="punishment" value="적용" checked={reward} onChange={() => setReward(true)} /> 적용
                  </label>
                  <label>
                     <input type="radio" name="punishment" value="미적용" checked={!reward} onChange={() => setReward(false)} /> 미적용
                  </label>
               </RadioGroup>
            </Label>

            <Label>
               <LabelText>스터디 설명</LabelText>
               <TextArea placeholder="스터디 설명을 입력하세요" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Label>

            <SubmitButton type="submit">{initialValues.id ? '스터디 수정하기' : '스터디 만들기'}</SubmitButton>
         </Form>
      </Wrapper>
   )
}

export default StudyCreate

//Studyedit랑 대부분 겹치는데 edit에 없는 부분 스타일도 있어서 오류날까봐 따로 파일은 안만들고 일단 컴포넌트 내에 스타일 작성했어용

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center; /* 화면 중앙 정렬 */
   align-items: center;
   min-height: 100vh; /* 화면 높이 전체 사용하여 중앙 배치 */
   padding: 40px;
   width: 100%; /* 화면 크기에 따라 자연스럽게 조정 */
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

const SmallText = styled.span`
   font-size: 10px;
   color: #999; /* 작은 글씨 색상 */
`

const StyledDivider = styled.div`
   width: 100%;
   max-width: 800px;
   height: 3px;
   background-color: #ff7a00;
   margin-bottom: 20px;
`
const NameLabel = styled.div`
   display: flex;
   flex-direction: column;
   gap: 5px;
   align-items: flex-start;
`

const Form = styled.form`
   display: flex;
   flex-direction: column;
   gap: 20px;
   width: 100%;
   max-width: 600px; /* 입력 필드가 너무 넓어지지 않도록 제한 */
   align-items: center; /* 폼 요소도 가운데 정렬 */
   text-align: left; /* 내부 요소도 가운데 정렬 */
   max-width: 800px; /* 🔹 폼 너비 제한 */
   align-items: flex-start; /* 🔹 좌측 정렬 */
   @media (max-width: 768px) {
      width: 100%;
      max-width: 600px;
   }
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

const FlexContainer = styled.div`
   display: flex;
   align-items: center;
   justify-content: flex-start; /* ✅ 왼쪽 정렬 */
   gap: 10px;
   flex-wrap: nowrap; /* ✅ 태블릿에서는 한 줄 유지 */
   width: 100%;
   max-width: 800px;
   overflow-x: auto; /* ✅ 너무 좁아지면 가로 스크롤 허용 */

   @media (max-width: 768px) {
      flex-wrap: wrap; /* ✅ 태블릿에서는 자동 줄바꿈 */
      flex-direction: row; /* ✅ 태블릿에서도 가로 유지 */
      justify-content: space-between;
   }

   @media (max-width: 480px) {
      flex-wrap: nowrap; /* ✅ 모바일에서도 줄바꿈 방지 */
      overflow-x: auto; /* ✅ 모바일에서도 가로 스크롤 허용 */
   }
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
   background-color: ${(props) => (props.disabled ? '#e0e0e0' : 'white')}; // 🔹 비활성화 시 회색 배경
   color: ${(props) => (props.disabled ? '#808080' : 'black')}; // 🔹 비활성화 시 글자 색 변경
   cursor: ${(props) => (props.disabled ? 'not-allowed' : 'text')}; // 🔹 입력 불가능 상태 마우스 변경
`

const MediumInput = styled(Input)`
   flex: 1;
   min-width: 120px;
   text-align: center;
   background-color: ${(props) => (props.disabled ? '#e0e0e0' : 'white')}; // 🔹 비활성화 시 회색 배경
   color: ${(props) => (props.disabled ? '#808080' : 'black')}; // 🔹 비활성화 시 흐린 글씨
   cursor: ${(props) => (props.disabled ? 'not-allowed' : 'text')}; // 🔹 비활성화 시 마우스 변경
`

const CustomTimeInput = styled(Input)`
   width: 120px;
   min-width: 100px;
   text-align: center;
   background-color: ${(props) => (props.disabled ? '#e0e0e0' : 'white')}; // 🔹 비활성화 시 회색 배경
   color: ${(props) => (props.disabled ? '#808080' : 'black')}; // 🔹 비활성화 시 흐린 글씨
   cursor: ${(props) => (props.disabled ? 'not-allowed' : 'text')}; // 🔹 비활성화 시 마우스 변경
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
   flex-direction: row; /* ✅ 기본적으로 가로 정렬 */
   gap: 20px;

   @media (max-width: 768px) {
      flex-direction: row; /* 태블릿에서도 가로 정렬 유지 */
   }

   @media (max-width: 480px) {
      flex-direction: column; /* 모바일에서는 세로 정렬 */
   }
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
