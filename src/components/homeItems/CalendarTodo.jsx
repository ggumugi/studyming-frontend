/* 화살표 사용 해서 일주일(월~일)까지만 넘길 수 있게  */

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { format, addDays, subDays } from 'date-fns'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai' // ⬅️ 아이콘 추가
import { FiX } from 'react-icons/fi'

import { fetchGoals, addGoalAsync, updateGoalAsync, deleteGoalAsync } from '../../features/goalsSlice'

const MAX_LENGTH = 10 // 일정 최대 글자 수
const MAX_TODOS = 4 // 하루 최대 일정 개수

const DAYS = ['sunGoal', 'monGoal', 'tueGoal', 'wedGoal', 'thuGoal', 'friGoal', 'satGoal']

const CalendarTodo = () => {
   const dispatch = useDispatch()
   const { goals, loading, error } = useSelector((state) => state.goals || { goals: [] })

   const [selectedDate, setSelectedDate] = useState(new Date())
   const [input, setInput] = useState('')
   const [errorMsg, setErrorMsg] = useState('')

   useEffect(() => {
      dispatch(fetchGoals()) // ✅ 서버에서 목표 데이터 가져오기
   }, [dispatch])

   const currentDayIndex = selectedDate.getDay() // 0: 일요일, 1: 월요일, ..., 6: 토요일
   const currentDayGoalKey = DAYS[currentDayIndex] // ex) 월요일이면 'monGoal'
   const todayGoal = goals.filter((goal) => goal[currentDayGoalKey]) // ✅ 해당 요일 목표 전체 가져오기
   const currentTodos = todayGoal.map((goal) => goal[currentDayGoalKey]) // ✅ 여러 개의 목표 리스트로 변환

   const handleAddTodo = () => {
      if (!input.trim()) return

      if (input.length > MAX_LENGTH) {
         setErrorMsg('최대 10자까지 입력 가능합니다.')
         return
      }

      if (currentTodos.length >= MAX_TODOS) {
         setErrorMsg(`하루에 최대 ${MAX_TODOS}개까지 입력 가능합니다.`)
         return
      }

      const newGoal = { [currentDayGoalKey]: input } // ✅ 요일별 필드만 포함

      if (todayGoal && todayGoal.id) {
         dispatch(updateGoalAsync({ id: todayGoal.id, updatedGoal: newGoal })) // ✅ 기존 목표 업데이트
      } else {
         dispatch(addGoalAsync(newGoal)) // ✅ 목표가 없으면 새로 추가
      }

      setInput('')
      setErrorMsg('')
   }

   const handleToggleTodo = (id) => {
      const updatedGoal = todayGoal.find((goal) => goal.id === id)

      if (!updatedGoal) return

      const newGoal = {
         ...updatedGoal,
         completed: !updatedGoal.completed, // ✅ 완료 상태 토글
      }

      dispatch(updateGoalAsync({ id, updatedGoal: newGoal }))
   }

   const handleDeleteTodo = (id) => {
      dispatch(deleteGoalAsync(id)) // ✅ 특정 목표만 삭제하도록 수정
   }

   return (
      <Container>
         <DateNavigation>
            <NavButton onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
               <AiOutlineLeft />
            </NavButton>
            <DateDisplay>
               {format(selectedDate, 'yyyy년 MM월 dd일')} ({['일', '월', '화', '수', '목', '금', '토'][currentDayIndex]})
            </DateDisplay>
            <NavButton onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
               <AiOutlineRight />
            </NavButton>
         </DateNavigation>

         <InputSection>
            <InputWrapper>
               <Input
                  type="text"
                  placeholder="할 일 입력 (최대 10자)"
                  value={input}
                  maxLength={MAX_LENGTH}
                  onChange={(e) => {
                     const value = e.target.value
                     if (value.length > MAX_LENGTH) {
                        setErrorMsg(`최대 ${MAX_LENGTH}자까지만 입력할 수 있습니다.`)
                        return
                     }
                     setInput(value)
                     setErrorMsg('')
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
               />
               {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
            </InputWrapper>
            <AddButton onClick={handleAddTodo}>추가</AddButton>
         </InputSection>

         {loading && <p>로딩 중...</p>}
         {error && <p>에러 발생: {error}</p>}

         <List>
            {currentTodos.length > 0 ? (
               todayGoal.map((goal) => (
                  <TodoItem key={goal.id}>
                     <TodoText onClick={() => handleToggleTodo(goal.id)} $completed={goal.completed}>
                        {goal[currentDayGoalKey]}
                     </TodoText>

                     <DeleteButton onClick={() => handleDeleteTodo(goal.id)}>
                        <FiX />
                     </DeleteButton>
                  </TodoItem>
               ))
            ) : (
               <p>데이터가 없습니다.</p>
            )}
         </List>
      </Container>
   )
}

// 🎨 Styled Components
const Container = styled.div`
   // max-width: 400px;
   width: 75%;
   margin: auto;
   padding: 20px 20px 10px 20px;
   background: white;
   border: 1px solid #eaeaea;
   box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.07);
   border-radius: 10px;
   text-align: center;
`

const DateNavigation = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 20px;
`

const NavButton = styled.button`
   background: white;
   color: black;
   border: none;
   font-size: 24px; /* ⬅️ 아이콘 크기 조정 */
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;
   &:hover {
      color: #ff7a00;
   }
`

const DateDisplay = styled.h3`
   margin: 0;

   font-size: clamp(14px, 2vw, 20px);
   font-weight: 300;
`

const InputSection = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 10px;
   width: 100%;
`

const InputWrapper = styled.div`
   display: flex;
   flex-direction: column;
   position: relative;
   width: 100%;
`

const Input = styled.input`
   width: 100%;
   padding: 10px;
   border: 1px solid #ddd;
   border-radius: 5px;
   outline: none;

   &:focus {
      border-color: #ff7a00; /* 포커스 시 테두리 색 변경 */
   }
`

const AddButton = styled.button`
   margin-top: 15px;
   background: #ff7a00;
   width: 100%;
   color: white;
   border: none;
   padding: 10px 15px;
   border-radius: 5px;
   cursor: pointer;
   white-space: nowrap; /* ⬅️ 버튼이 세로로 줄 바꿈되지 않도록 설정 */

   &:hover {
      background: #e66900;
   }
`

const List = styled.ul`
   list-style: none;
   padding: 0;
   margin-top: 20px;
`

const TodoItem = styled.li`
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 10px;
   background: #f9f9f9;
   border-radius: 5px;
   margin-bottom: 5px;
`

const TodoText = styled.span`
   cursor: pointer;
   text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
   color: ${({ $completed }) => ($completed ? '#888' : '#333')};
   transition: all 0.2s ease-in-out;
`

const DeleteButton = styled.button`
   background: none;
   border: none; /* ⬅️ 기본 테두리 제거 */
   outline: none; /* ⬅️ 포커스 시 생기는 테두리 제거 */
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;
   color: #e66900;
   font-size: 18px;
`

const ErrorText = styled.p`
   color: red;
   font-size: 12px;
   margin-top: 5px;

   position: absolute;
   bottom: -18px; /* 입력창 바로 아래에 표시 */
   left: 5px;
`
/* 글자수 초과 오류문구 가끔 안뜨는데 계속 그러면 코드 수정하겟음다.LEE  */

export default CalendarTodo
