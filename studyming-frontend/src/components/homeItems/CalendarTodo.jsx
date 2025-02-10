import React, { useState } from 'react'
import styled from 'styled-components'
import { format, addDays, subDays } from 'date-fns'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai' // ⬅️ 아이콘 추가
import { FiX } from 'react-icons/fi'

const MAX_LENGTH = 10 // ⬅️ 일정 최대 글자 수
const MAX_TODOS = 4 // ⬅️ 하루 최대 일정 개수

const CalendarTodo = () => {
   const [selectedDate, setSelectedDate] = useState(new Date())
   const [todos, setTodos] = useState({})
   const [input, setInput] = useState('')
   const [error, setError] = useState('')

   const dateKey = format(selectedDate, 'yyyy-MM-dd')

   const handleAddTodo = () => {
      if (!input.trim()) return

      if (input.length > MAX_LENGTH) {
         setError('최대 10자까지 입력 가능합니다.') // ⬅️ 글자 수 초과 경고
         return
      }

      const currentTodos = todos[dateKey] || []
      if (currentTodos.length >= MAX_TODOS) {
         setError(`하루에 최대 ${MAX_TODOS}개까지 입력 가능합니다.`)
         return
      }

      setTodos({
         ...todos,
         [dateKey]: [...currentTodos, { text: input, completed: false }],
      })
      setInput('')
      setError('')
   }

   const handleToggleTodo = (index) => {
      const updatedTodos = todos[dateKey].map((todo, i) => (i === index ? { ...todo, completed: !todo.completed } : todo))
      setTodos({ ...todos, [dateKey]: updatedTodos })
   }

   const handleDeleteTodo = (index) => {
      const updatedTodos = todos[dateKey].filter((_, i) => i !== index)
      setTodos({ ...todos, [dateKey]: updatedTodos })
   }

   return (
      <Container>
         <DateNavigation>
            <NavButton onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
               <AiOutlineLeft />
            </NavButton>
            <DateDisplay>{format(selectedDate, 'yyyy년 MM월 dd일')}</DateDisplay>
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
                     setInput(e.target.value)
                     if (e.target.value.length > MAX_LENGTH) {
                        setError('최대 10자까지 입력 가능합니다.') // ⬅️ 글자 수 초과 시 경고
                     } else {
                        setError('') // 정상 입력 시 오류 초기화
                     }
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
               />
               {error && <ErrorText>{error}</ErrorText>} {/* ⬅️ 빨간색 경고 문구 표시 */}
            </InputWrapper>
            <AddButton onClick={handleAddTodo}>추가</AddButton>
         </InputSection>

         <List>
            {(todos[dateKey] || []).map((todo, index) => (
               <TodoItem key={index}>
                  <TodoText onClick={() => handleToggleTodo(index)} completed={todo.completed}>
                     {todo.text}
                  </TodoText>
                  <DeleteButton onClick={() => handleDeleteTodo(index)}>
                     {' '}
                     <FiX />
                  </DeleteButton>
               </TodoItem>
            ))}
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

   font-size: 20px;
   font-weight: 300;
`

const InputSection = styled.div`
   display: flex;
   align-items: center;
   gap: 10px;
   width: 100%;
`

const InputWrapper = styled.div`
   display: flex;
   flex-direction: column;
   position: relative;
   flex: 1; /* ⬅️ 입력창이 버튼과 함께 가로 정렬되도록 설정 */
`

const Input = styled.input`
   flex: 1;
   padding: 10px;
   border: 1px solid #ddd;
   border-radius: 5px;
   outline: none;

   &:focus {
      border-color: #ff7a00; /* 포커스 시 테두리 색 변경 */
   }
`

const AddButton = styled.button`
   background: #ff7a00;
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
   text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
   color: ${({ completed }) => (completed ? '#888' : '#333')};
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

export default CalendarTodo
