import React, { useState } from 'react'
import styled from 'styled-components'
import { format, addDays, startOfWeek, subWeeks, addWeeks } from 'date-fns'

const MAX_LENGTH = 20 // ⬅️ 입력 글자수 제한

const WeeklyCalendar = () => {
   const [currentWeek, setCurrentWeek] = useState(new Date())
   const [selectedDate, setSelectedDate] = useState(new Date())
   const [schedule, setSchedule] = useState({})
   const [tempSchedule, setTempSchedule] = useState('')
   const [error, setError] = useState('') // ⬅️ 오류 메시지 상태 추가

   // 현재 주 시작일 계산
   const startWeek = startOfWeek(currentWeek, { weekStartsOn: 0 })

   // 주간 날짜 배열 생성
   const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i))

   // 일정 저장
   const handleSaveSchedule = () => {
      if (tempSchedule.trim().length > MAX_LENGTH) {
         setError(`최대 ${MAX_LENGTH}자까지 입력 가능합니다.`)
         return
      }

      const dateKey = format(selectedDate, 'yyyy-MM-dd')
      if (!tempSchedule.trim()) return // 입력값이 없으면 저장 안 함

      setSchedule({ ...schedule, [dateKey]: tempSchedule })
      setTempSchedule('') // 입력창 초기화
      setError('') // ⬅️ 저장 후 오류 메시지 초기화
   }

   // 입력값 변경 시 글자 수 제한 체크
   const handleInputChange = (e) => {
      const value = e.target.value
      if (value.length > MAX_LENGTH) {
         setError(`최대 ${MAX_LENGTH}자까지 입력 가능합니다.`)
      } else {
         setTempSchedule(value)
         setError('') // ⬅️ 정상 입력 시 오류 초기화
      }
   }

   return (
      <Container>
         {/* 주간 네비게이션 */}
         <Header>
            <Button onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>◀ 이전주</Button>
            <h3>
               {format(startWeek, 'yyyy년 MM월 dd일')} ~ {format(addDays(startWeek, 6), 'MM월 dd일')}
            </h3>
            <Button onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>다음주 ▶</Button>
         </Header>
         {/* 일주일 달력 (날짜별 일정 표시) */}
         <WeekContainer>
            {weekDays.map((day) => {
               const dateKey = format(day, 'yyyy-MM-dd')
               const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')

               return (
                  <DayBox key={dateKey} selected={isSelected} onClick={() => setSelectedDate(day)}>
                     {format(day, 'EEE')}
                     <br />
                     {format(day, 'dd')}
                     <ScheduleText selected={isSelected} hasSchedule={!!schedule[dateKey]}>
                        {schedule[dateKey] || ' '}
                     </ScheduleText>
                  </DayBox>
               )
            })}
         </WeekContainer>
         {/* 일정 입력 및 등록 */}
         <ScheduleInputSection>
            {/* <h3>{format(selectedDate, 'yyyy년 MM월 dd일')} 일정</h3> */}
            <Input
               type="text"
               placeholder="일정 입력 (최대 20자)"
               value={tempSchedule}
               maxLength={MAX_LENGTH} // ⬅️ 최대 글자 수 제한 추가
               onChange={handleInputChange}
            />
            <SaveButton onClick={handleSaveSchedule}>등록</SaveButton>
         </ScheduleInputSection>
         {error && <ErrorText>{error}</ErrorText>} {/* ⬅️ 오류 메시지 표시 */}
      </Container>
   )
}
/* FFA654 */
// 🎨 Styled Components
const Container = styled.div`
   max-width: 1150px;
   margin: auto;
   text-align: center;
   padding: 20px;
   background: white;
   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
   border-radius: 8px;
`

const Header = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 10px;
`

const Button = styled.button`
   background: #ff7a00;
   color: white;
   border: none;
   padding: 5px 10px;
   cursor: pointer;
   border-radius: 5px;
   &:hover {
      background: #e66900;
   }
`

const WeekContainer = styled.div`
   display: flex;
   justify-content: space-between;
   margin-bottom: 20px;
`

const DayBox = styled.div`
   flex: 1;
   padding: 10px;
   border-radius: 5px;
   cursor: pointer;
   text-align: center;
   background: ${({ selected }) => (selected ? '#FFA654' : '#f9f9f9')};
   color: ${({ selected }) => (selected ? 'white' : 'black')};

   &:hover {
      background: #e66900;
   }
`

const ScheduleText = styled.div`
   margin-top: 5px;
   font-size: 12px;
   color: ${({ selected }) => (selected ? 'white' : '#333')}; /* 선택된 날짜는 흰색, 나머지는 검정 */
`

const ScheduleInputSection = styled.div`
   margin-top: 10px;
   display: flex; /* flex로 가로 정렬 */
   align-items: center; /* 버튼과 입력 창 정렬 */
   justify-content: center;
   gap: 10px; /* 입력창과 버튼 사이 간격 */
`

const Input = styled.input`
   flex: 0.5; /* 입력 필드가 가변적으로 늘어나도록 설정 */
   padding: 8px;
   border: 1px solid #ddd;
   border-radius: 5px;
   white-space: nowrap; /* 입력값이 길어도 줄바꿈 방지 */
   overflow: hidden;
`

const SaveButton = styled.button`
   background: #ff7a00;
   color: white;
   border: none;
   padding: 8px 12px;
   border-radius: 5px;
   cursor: pointer;
   white-space: nowrap; /* 버튼 크기가 일정하게 유지되도록 */
   &:hover {
      background: #e66900;
   }
`

const ErrorText = styled.p`
   color: red;
   font-size: 12px;
   margin-top: 5px;
`

export default WeeklyCalendar

/* 경희 하고있음 (달력) */
