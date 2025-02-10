import React, { useState } from 'react'
import styled from 'styled-components'
import { format, addDays, startOfWeek, subWeeks, addWeeks } from 'date-fns'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai' // ⬅️ 아이콘 추가
const MAX_LENGTH = 10 // ⬅️ 개별 일정 최대 글자 수 제한
const MAX_SCHEDULES = 3 // ⬅️ 하루에 최대 3개 일정

const WeeklyCalendar = () => {
   const [currentWeek, setCurrentWeek] = useState(new Date())
   const [selectedDate, setSelectedDate] = useState(new Date())
   const [schedule, setSchedule] = useState({})
   const [tempSchedule, setTempSchedule] = useState('')
   const [editingIndex, setEditingIndex] = useState(null)
   const [error, setError] = useState('')

   const startWeek = startOfWeek(currentWeek, { weekStartsOn: 0 })
   const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i))

   const handleSaveSchedule = () => {
      const dateKey = format(selectedDate, 'yyyy-MM-dd')
      const currentSchedules = schedule[dateKey] || []

      if (tempSchedule.trim().length > MAX_LENGTH) {
         setError(`각 일정은 최대 ${MAX_LENGTH}자까지 입력 가능합니다.`)
         return
      }

      if (!tempSchedule.trim()) return

      if (currentSchedules.length >= MAX_SCHEDULES) {
         setError(`하루에 최대 ${MAX_SCHEDULES}개까지 입력 가능합니다.`)
         return
      }

      setSchedule({
         ...schedule,
         [dateKey]: [...currentSchedules, tempSchedule], // 기존 일정 유지
      })

      setTempSchedule('')
      setError('')
   }

   const handleInputChange = (e) => {
      const value = e.target.value
      if (value.length > MAX_LENGTH) {
         setError(`각 일정은 최대 ${MAX_LENGTH}자까지 입력 가능합니다.`)
      } else {
         setTempSchedule(value)
         setError('')
      }
   }

   const handleEditSchedule = (dateKey, index, value) => {
      if (value.length > MAX_LENGTH) return
      const updatedSchedules = [...schedule[dateKey]]
      updatedSchedules[index] = value

      if (value.trim() === '') {
         updatedSchedules.splice(index, 1) // 빈 값이면 삭제
      }

      setSchedule({ ...schedule, [dateKey]: updatedSchedules })
   }

   return (
      <Container>
         <Header>
            <Button onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
               <StyledLeftIcon />
            </Button>
            <h3>
               {format(startWeek, 'yyyy년 MM월 dd일')} ~ {format(addDays(startWeek, 6), 'MM월 dd일')}
            </h3>
            <Button onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
               <StyledRightIcon />
            </Button>
         </Header>

         <WeekContainer>
            {weekDays.map((day) => {
               const dateKey = format(day, 'yyyy-MM-dd')
               const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')

               return (
                  <DayBox key={dateKey} selected={isSelected} onClick={() => setSelectedDate(day)}>
                     {format(day, 'EEE')}
                     <br />
                     {format(day, 'dd')}
                     <ScheduleList>
                        {(schedule[dateKey] || []).map((item, index) => (
                           <ScheduleItem key={index} selected={isSelected}>
                              {editingIndex === `${dateKey}-${index}` ? (
                                 <ScheduleInput type="text" value={item} maxLength={MAX_LENGTH} autoFocus onChange={(e) => handleEditSchedule(dateKey, index, e.target.value)} onBlur={() => setEditingIndex(null)} onKeyDown={(e) => e.key === 'Enter' && setEditingIndex(null)} />
                              ) : (
                                 <ScheduleText onClick={() => setEditingIndex(`${dateKey}-${index}`)}>{item}</ScheduleText>
                              )}
                           </ScheduleItem>
                        ))}
                     </ScheduleList>
                  </DayBox>
               )
            })}
         </WeekContainer>

         <ScheduleInputSection>
            <Input type="text" placeholder="일정 입력 (최대 10자, 1일 3개)" value={tempSchedule} maxLength={MAX_LENGTH} onChange={handleInputChange} onKeyDown={(e) => e.key === 'Enter' && handleSaveSchedule()} />
            <SaveButton onClick={handleSaveSchedule}>등록</SaveButton>
         </ScheduleInputSection>
         {error && <ErrorText>{error}</ErrorText>}
      </Container>
   )
}

// 🎨 Styled Components
const Container = styled.div`
   // max-width: 1150px;
   width: 94%;
   text-align: center;
   padding: 15px 20px 20px 20px;
   background: white;
   box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.07);
   border-radius: 8px;
`

const Header = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 30px;
   h3 {
      font-size: 20px;
      font-weight: 300;
   }
`

const Button = styled.button`
   background: white;
   color: black;
   border: none;
   padding: 5px 10px;
   cursor: pointer;
   border-radius: 5px;
   &:hover {
      color: #ff7a00;
   }
`

const WeekContainer = styled.div`
   display: flex;
   justify-content: space-between;
   margin-bottom: 30px;
`

const DayBox = styled.div`
   flex: 1;
   padding: 13px;
   border-radius: 5px;
   cursor: pointer;
   text-align: center;
   background: ${({ selected }) => (selected ? '#e66900' : '#f9f9f9')};
   color: ${({ selected }) => (selected ? 'white' : '#666')};

   &:hover {
      background: #ffa654;
   }
`

const ScheduleList = styled.div`
   margin-top: 10px;
   display: flex;
   flex-direction: column;
   gap: 4px;
`

const ScheduleItem = styled.div`
   font-size: 12px;
   color: ${({ selected }) => (selected ? 'white' : 'black')};
`

const ScheduleText = styled.span`
   cursor: pointer;
   padding: 2px 4px;
   border-radius: 3px;
   &:hover {
      background: rgba(0, 0, 0, 0.1);
   }
`

const ScheduleInput = styled.input`
   font-size: 12px;
   padding: 2px;
   border: none;
   border-radius: 3px;
   outline: none;
   width: 100%;
`

const ScheduleInputSection = styled.div`
   margin-top: 10px;
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 10px;
`

const Input = styled.input`
   flex: 0.5;
   padding: 8px;
   border: 1px solid #ddd;
   border-radius: 5px;
`

const SaveButton = styled.button`
   background: #ff7a00;
   color: white;
   border: none;
   padding: 8px 12px;
   border-radius: 5px;
   cursor: pointer;
   &:hover {
      background: #ffa654;
   }
`

const ErrorText = styled.p`
   color: red;
   font-size: 12px;
   margin-top: 10px;
`

const StyledLeftIcon = styled(AiOutlineLeft)`
   font-size: 24px; /* 원하는 크기로 설정 */
`

const StyledRightIcon = styled(AiOutlineRight)`
   font-size: 24px;
`

export default WeeklyCalendar
