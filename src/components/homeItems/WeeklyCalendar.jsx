import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { format, addDays, startOfWeek, subWeeks, addWeeks } from 'date-fns'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { fetchGoals, addGoalAsync, updateGoalAsync, deleteGoalAsync } from '../../features/goalsSlice'

const DAYS = ['sunGoal', 'monGoal', 'tueGoal', 'wedGoal', 'thuGoal', 'friGoal', 'satGoal']
const MAX_LENGTH = 10
const MAX_SCHEDULES = 4

const WeeklyCalendar = () => {
   const dispatch = useDispatch()
   const { goals } = useSelector((state) => state.goals || { goals: [] })

   const [currentWeek] = useState(new Date())
   const [selectedDate, setSelectedDate] = useState(new Date())
   // const [tempSchedule, setTempSchedule] = useState('')
   const [editingGoalId, setEditingGoalId] = useState(null)
   const [errorMsg, setErrorMsg] = useState('')
   const [weeklyGoals, setWeeklyGoals] = useState({}) // :압정: 요일별 목표 리스트
   // 수정된 코드 부분 (상단 상태 추가)
   const [justSaved, setJustSaved] = useState(false)

   useEffect(() => {
      dispatch(fetchGoals())
   }, [dispatch])

   // 주간 목표 구조 개선 (useEffect 내부 수정)
   useEffect(() => {
      if (goals.length > 0) {
         const organizedGoals = DAYS.reduce((acc, day) => {
            acc[day] = goals
               .filter((goal) => goal[day]) // null 값 사전 필수링
               .map((goal) => ({
                  id: goal.id,
                  text: goal[day],
                  date: goal.date, // 날짜 정보 추가
               }))
            return acc
         }, {})

         setWeeklyGoals(organizedGoals)
      }
   }, [goals])

   const startWeek = startOfWeek(currentWeek, { weekStartsOn: 0 })
   const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i))

   // 새로운 로컬 상태 추가
   const [localSchedule, setLocalSchedule] = useState('')

   // 입력값 동기화 핸들러
   const syncInputWithSelection = () => {
      const selectedDayKey = DAYS[selectedDate.getDay()]
      const goal = weeklyGoals[selectedDayKey]?.find((g) => g.date === format(selectedDate, 'yyyy-MM-dd'))
      setLocalSchedule(goal?.text || '')
   }

   // 선택 날짜 변경 시 동기화
   useEffect(() => {
      if (!editingGoalId) syncInputWithSelection()
   }, [selectedDate])

   // 주간 목표 업데이트 시 동기화
   useEffect(() => {
      if (!editingGoalId) syncInputWithSelection()
   }, [weeklyGoals])

   // 수정된 useEffect (justSaved 상태가 변경될 때마다 실행)
   useEffect(() => {
      if (justSaved) {
         const timer = setTimeout(() => setJustSaved(false), 300) // 300ms로 변경
         return () => clearTimeout(timer)
      }
   }, [justSaved])

   // 2. 저장 로직 개선 (handleSaveSchedule 함수 전체 수정)
   const handleSaveSchedule = () => {
      const trimmed = localSchedule.trim()
      if (!trimmed) return

      if (trimmed.length > MAX_LENGTH) {
         setErrorMsg(`최대 ${MAX_LENGTH}자까지 입력 가능합니다.`)
         return
      }

      const selectedDayKey = DAYS[selectedDate.getDay()]
      const selectedDateFormatted = format(selectedDate, 'yyyy-MM-dd')

      const existingSchedules = weeklyGoals[selectedDayKey] || []

      if (!editingGoalId && existingSchedules.length >= MAX_SCHEDULES) {
         setErrorMsg(`하루 최대 ${MAX_SCHEDULES}개까지 입력 가능합니다.`)
         return
      }

      // 저장 즉시 초기화
      setLocalSchedule('')
      setEditingGoalId(null)

      const newGoal = {
         date: selectedDateFormatted,
         [selectedDayKey]: trimmed,
      }

      if (editingGoalId) {
         dispatch(updateGoalAsync({ id: editingGoalId, updatedGoal: newGoal })).then(() => {
            dispatch(fetchGoals()) // 데이터 최신화
         })
      } else {
         dispatch(addGoalAsync(newGoal)).then(() => {
            dispatch(fetchGoals()) // 데이터 최신화
         })
      }
   }

   // 일정 클릭 핸들러 수정
   const handleEditSchedule = (goal, day) => {
      setLocalSchedule(goal.text) // localSchedule로 변경
      setSelectedDate(day)
      setEditingGoalId(goal.id)
   }
   const handleDeleteSchedule = (id, dayKey) => {
      dispatch(deleteGoalAsync(id))

      // ✅ 삭제 후 weeklyGoals 업데이트
      setWeeklyGoals((prev) => ({
         ...prev,
         [dayKey]: (prev[dayKey] || []).filter((goal) => goal.id !== id), // undefined일 경우 빈 배열로 처리
      }))
   }

   return (
      <Container>
         <Header>
            <h3 style={{ fontSize: '20px', fontWeight: '300' }}>
               {format(startWeek, 'yyyy년 MM월 dd일')} ~ {format(addDays(startWeek, 6), 'MM월 dd일')}
            </h3>
         </Header>

         <WeekContainer>
            {weekDays.map((day) => {
               const dateKey = format(day, 'yyyy-MM-dd')
               const isSelected = dateKey === format(selectedDate, 'yyyy-MM-dd')
               const dayKey = DAYS[day.getDay()]
               const dayGoals = goals.filter((goal) => goal[dayKey])

               return (
                  <DayBox key={dateKey} selected={isSelected} onClick={() => setSelectedDate(day)}>
                     {format(day, 'EEE')} <br />
                     {format(day, 'dd')}
                     <ScheduleList>
                        {dayGoals.map((goal) => (
                           <ScheduleItem
                              key={goal.id}
                              isEditing={editingGoalId === goal.id} // 수정 중인 일정인지 확인
                              onClick={() => handleEditSchedule(goal, day)}
                           >
                              <span>{goal[dayKey]}</span>
                              <DeleteButton
                                 onClick={(e) => {
                                    e.stopPropagation() // 삭제 버튼 클릭 시 일정 수정 방지
                                    handleDeleteSchedule(goal.id)
                                 }}
                              >
                                 X
                              </DeleteButton>
                           </ScheduleItem>
                        ))}
                     </ScheduleList>
                  </DayBox>
               )
            })}
         </WeekContainer>

         <ScheduleInputSection>
            <Input
               type="text"
               placeholder="일정 입력 (최대 10자)"
               value={localSchedule} // localSchedule로 변경
               maxLength={MAX_LENGTH}
               onChange={(e) => {
                  setLocalSchedule(e.target.value)
                  setErrorMsg('')
               }}
               onKeyDown={(e) => e.key === 'Enter' && handleSaveSchedule()}
            />
            <SaveButton onClick={handleSaveSchedule}>{editingGoalId ? '수정' : '등록'}</SaveButton>
         </ScheduleInputSection>
         {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
      </Container>
   )
}

// ✅ 스타일 유지
const Container = styled.div`
   width: 94%;
   text-align: center;
   padding: 15px 20px;
   background: white;
   border: 1px solid #eaeaea;
   box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.07);
   border-radius: 8px;
`

const Header = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 30px;
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
   background: ${({ selected }) => (selected ? '#e66900 !important' : '#f9f9f9')};
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
   color: #666 !important;
`

const ScheduleItem = styled.div`
   display: flex;
   justify-content: space-between;
   padding: 5px;
   background: ${({ isEditing }) => (isEditing ? '#ffe0b2' : '#f9f9f9')}; // 수정 중일 때 배경색 변경
   border-radius: 5px;
   transition: background 0.3s ease;
`

const DeleteButton = styled.button`
   background: none;
   border: none;
   color: red;
   cursor: pointer;
   font-size: 12px;
`

const ScheduleInputSection = styled.div`
   margin-top: 10px;
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 10px;
`

const Input = styled.input`
   flex: 0.3;
   padding: 8px;
   border: 1px solid #ddd;
   border-radius: 5px;
   outline: none;
   &:focus {
      border-color: #ff7a00;
   }
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
   font-size: 24px;
`

const StyledRightIcon = styled(AiOutlineRight)`
   font-size: 24px;
`

export default WeeklyCalendar
