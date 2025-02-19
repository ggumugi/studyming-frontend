// import React, { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import styled from 'styled-components'
// import { format, addDays, startOfWeek, subWeeks, addWeeks } from 'date-fns'
// import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

// import { fetchGoals, addGoalAsync, updateGoalAsync, deleteGoalAsync } from '../../features/goalsSlice'

// const DAYS = ['sunGoal', 'monGoal', 'tueGoal', 'wedGoal', 'thuGoal', 'friGoal', 'satGoal']

// const MAX_LENGTH = 10
// const MAX_SCHEDULES = 3

// const WeeklyCalendar = () => {
//    const dispatch = useDispatch()
//    const { goals, loading, error } = useSelector((state) => state.goals || { goals: [] })

//    useEffect(() => {
//       dispatch(fetchGoals())
//    }, [dispatch])

//    const [currentWeek, setCurrentWeek] = useState(new Date())
//    const [selectedDate, setSelectedDate] = useState(new Date())
//    const [tempSchedule, setTempSchedule] = useState('')
//    const [errorMsg, setErrorMsg] = useState('')

//    const startWeek = startOfWeek(currentWeek, { weekStartsOn: 0 })
//    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i))

//    const selectedDayKey = DAYS[selectedDate.getDay()]
//    const selectedDayGoals = goals.filter((goal) => goal[selectedDayKey])
//    const currentSchedules = selectedDayGoals.map((goal) => goal[selectedDayKey])

//    const handleSaveSchedule = () => {
//       if (!tempSchedule.trim()) return

//       if (tempSchedule.length > MAX_LENGTH) {
//          setErrorMsg(`최대 ${MAX_LENGTH}자까지 입력 가능합니다.`)
//          return
//       }

//       if (currentSchedules.length >= MAX_SCHEDULES) {
//          setErrorMsg(`하루에 최대 ${MAX_SCHEDULES}개까지 입력 가능합니다.`)
//          return
//       }

//       const newGoal = { date: format(selectedDate, 'yyyy-MM-dd'), [selectedDayKey]: tempSchedule }

//       if (selectedDayGoals.length > 0) {
//          dispatch(updateGoalAsync({ id: selectedDayGoals[0].id, updatedGoal: newGoal }))
//       } else {
//          dispatch(addGoalAsync(newGoal))
//       }

//       setTempSchedule('')
//       setErrorMsg('')
//    }

//    const handleDeleteSchedule = (id) => {
//       dispatch(deleteGoalAsync(id))
//    }

//    return (
//       <Container>
//          <Header>
//             <Button onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
//                <StyledLeftIcon />
//             </Button>
//             <h3>
//                {format(startWeek, 'yyyy년 MM월 dd일')} ~ {format(addDays(startWeek, 6), 'MM월 dd일')}
//             </h3>
//             <Button onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
//                <StyledRightIcon />
//             </Button>
//          </Header>

//          <WeekContainer>
//             {weekDays.map((day) => {
//                const dateKey = format(day, 'yyyy-MM-dd')
//                const isSelected = dateKey === format(selectedDate, 'yyyy-MM-dd')

//                return (
//                   <DayBox key={dateKey} selected={isSelected} onClick={() => setSelectedDate(day)}>
//                      {format(day, 'EEE')} <br />
//                      {format(day, 'dd')}
//                      <ScheduleList>
//                         {selectedDayGoals.map((goal) => (
//                            <ScheduleItem key={goal.id}>
//                               {goal[selectedDayKey]}
//                               <DeleteButton onClick={() => handleDeleteSchedule(goal.id)}>X</DeleteButton>
//                            </ScheduleItem>
//                         ))}
//                      </ScheduleList>
//                   </DayBox>
//                )
//             })}
//          </WeekContainer>

//          <ScheduleInputSection>
//             <Input
//                type="text"
//                placeholder="일정 입력 (최대 10자)"
//                value={tempSchedule}
//                maxLength={MAX_LENGTH}
//                onChange={(e) => {
//                   setTempSchedule(e.target.value)
//                   setErrorMsg('')
//                }}
//                onKeyDown={(e) => e.key === 'Enter' && handleSaveSchedule()}
//             />
//             <SaveButton onClick={handleSaveSchedule}>등록</SaveButton>
//          </ScheduleInputSection>
//          {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
//       </Container>
//    )
// }

// // 스타일 유지
// const Container = styled.div`
//    width: 94%;
//    text-align: center;
//    padding: 15px 20px;
//    background: white;
//    border: 1px solid #eaeaea;
//    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.07);
//    border-radius: 8px;
// `

// const Header = styled.div`
//    display: flex;
//    justify-content: space-between;
//    align-items: center;
//    margin-bottom: 30px;
// `

// const Button = styled.button`
//    background: white;
//    color: black;
//    border: none;
//    padding: 5px 10px;
//    cursor: pointer;
//    border-radius: 5px;
//    &:hover {
//       color: #ff7a00;
//    }
// `

// const WeekContainer = styled.div`
//    display: flex;
//    justify-content: space-between;
//    margin-bottom: 30px;
// `

// const DayBox = styled.div`
//    flex: 1;
//    padding: 13px;
//    border-radius: 5px;
//    cursor: pointer;
//    text-align: center;
//    background: ${({ selected }) => (selected ? '#e66900' : '#f9f9f9')};
//    color: ${({ selected }) => (selected ? 'white' : '#666')};
//    &:hover {
//       background: #ffa654;
//    }
// `

// const ScheduleList = styled.div`
//    margin-top: 10px;
//    display: flex;
//    flex-direction: column;
//    gap: 4px;
// `

// const ScheduleItem = styled.div`
//    display: flex;
//    justify-content: space-between;
//    padding: 5px;
//    background: #f9f9f9;
//    border-radius: 5px;
// `

// const DeleteButton = styled.button`
//    background: none;
//    border: none;
//    color: red;
//    cursor: pointer;
//    font-size: 12px;
// `

// const ScheduleInputSection = styled.div`
//    margin-top: 10px;
//    display: flex;
//    align-items: center;
//    justify-content: center;
//    gap: 10px;
// `

// const Input = styled.input`
//    flex: 0.3;
//    padding: 8px;
//    border: 1px solid #ddd;
//    border-radius: 5px;
//    outline: none;
//    &:focus {
//       border-color: #ff7a00;
//    }
// `

// const SaveButton = styled.button`
//    background: #ff7a00;
//    color: white;
//    border: none;
//    padding: 8px 12px;
//    border-radius: 5px;
//    cursor: pointer;
//    &:hover {
//       background: #ffa654;
//    }
// `

// const ErrorText = styled.p`
//    color: red;
//    font-size: 12px;
//    margin-top: 10px;
// `

// const StyledLeftIcon = styled(AiOutlineLeft)`
//    font-size: 24px;
// `

// const StyledRightIcon = styled(AiOutlineRight)`
//    font-size: 24px;
// `

// export default WeeklyCalendar

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
   const { goals, loading, error } = useSelector((state) => state.goals || { goals: [] })

   const [currentWeek, setCurrentWeek] = useState(new Date())
   const [selectedDate, setSelectedDate] = useState(new Date())
   const [tempSchedule, setTempSchedule] = useState('')
   const [errorMsg, setErrorMsg] = useState('')
   const [weeklyGoals, setWeeklyGoals] = useState({}) // 📌 요일별 목표 리스트

   useEffect(() => {
      dispatch(fetchGoals())
   }, [dispatch])

   useEffect(() => {
      if (goals.length > 0) {
         const organizedGoals = DAYS.reduce((acc, day) => {
            acc[day] = goals.map((goal) => ({ id: goal.id, text: goal[day] })).filter((goal) => goal.text) // null 값 제거
            return acc
         }, {})
         setWeeklyGoals(organizedGoals)
      }
   }, [goals])

   const startWeek = startOfWeek(currentWeek, { weekStartsOn: 0 })
   const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i))

   const handleSaveSchedule = () => {
      if (!tempSchedule.trim()) return

      if (tempSchedule.length > MAX_LENGTH) {
         setErrorMsg(`최대 ${MAX_LENGTH}자까지 입력 가능합니다.`)
         return
      }

      const selectedDayKey = DAYS[selectedDate.getDay()]

      if (weeklyGoals[selectedDayKey]?.length >= MAX_SCHEDULES) {
         setErrorMsg(`하루에 최대 ${MAX_SCHEDULES}개까지 입력 가능합니다.`)
         return
      }

      const newGoal = { [selectedDayKey]: tempSchedule }
      dispatch(addGoalAsync(newGoal))

      setTempSchedule('')
      setErrorMsg('')
   }

   const handleDeleteSchedule = (dayKey, id) => {
      dispatch(deleteGoalAsync(id))
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
               const dayKey = DAYS[day.getDay()]
               const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')

               return (
                  <DayBox key={dayKey} selected={isSelected} onClick={() => setSelectedDate(day)}>
                     {format(day, 'EEE')} <br />
                     {format(day, 'dd')}
                     <ScheduleList>
                        {weeklyGoals[dayKey]?.map((goal) => (
                           <ScheduleItem key={goal.id}>
                              {goal.text}
                              <DeleteButton onClick={() => handleDeleteSchedule(dayKey, goal.id)}>X</DeleteButton>
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
               value={tempSchedule}
               maxLength={MAX_LENGTH}
               onChange={(e) => {
                  setTempSchedule(e.target.value)
                  setErrorMsg('')
               }}
               onKeyDown={(e) => e.key === 'Enter' && handleSaveSchedule()}
            />
            <SaveButton onClick={handleSaveSchedule}>등록</SaveButton>
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
   background: #f9f9f9;
   border-radius: 5px;
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
