import React, { useState } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'

const Dday = () => {
   const [ddays, setDdays] = useState([])
   const [ddayTitle, setDdayTitle] = useState('')
   const [ddayDate, setDdayDate] = useState('')
   const [isDdayModalOpen, setIsDdayModalOpen] = useState(false)
   const [editingIndex, setEditingIndex] = useState(null) // 🔥 현재 수정 중인 항목
   const [tempValue, setTempValue] = useState('') // 🔥 입력값 유지

   const handleAddDday = () => {
      if (!ddayTitle.trim() || !ddayDate) {
         alert('모든 입력 필드를 채워주세요!')
         return
      }

      if (ddays.length < 5) {
         setDdays([...ddays, { title: ddayTitle, date: ddayDate, text: calculateDday(ddayDate) }])
         setDdayTitle('')
         setDdayDate('')
         setIsDdayModalOpen(false)
      }
   }

   // 🔥 D-day 계산 함수
   const calculateDday = (targetDate) => {
      const today = dayjs().startOf('day')
      const target = dayjs(targetDate).startOf('day')
      const diff = target.diff(today, 'day')

      if (diff > 0) return `D - ${diff}`
      else if (diff < 0) return `D + ${Math.abs(diff)}`
      return `D`
   }

   return (
      <Box>
         <Title>
            D-day <AddButton onClick={() => setIsDdayModalOpen(true)}>+</AddButton>
         </Title>
         <Line />
         <List>
            {ddays.map((dday, index) => (
               <Item key={index}>
                  <DdayLeft>{dday.title}</DdayLeft>
                  <DdayMiddle>{dday.date}</DdayMiddle>
                  <DdayRight>{dday.text}</DdayRight>
               </Item>
            ))}
         </List>

         {isDdayModalOpen && (
            <Modal>
               <ModalContent>
                  <ModalTitle>D-day 추가</ModalTitle>
                  <Input type="text" placeholder="D-day 제목 입력" value={ddayTitle} onChange={(e) => setDdayTitle(e.target.value)} />
                  <Input type="date" value={ddayDate} onChange={(e) => setDdayDate(e.target.value)} />

                  {/* ✅ 버튼을 모달 너비에 맞게 정렬 */}
                  <ModalButtonWrapper>
                     <ModalButton onClick={() => setIsDdayModalOpen(false)} cancel>
                        취소
                     </ModalButton>
                     <ModalButton onClick={handleAddDday}>추가</ModalButton>
                  </ModalButtonWrapper>
               </ModalContent>
            </Modal>
         )}
      </Box>
   )
}

// ✅ Styled Components
const Box = styled.div`
   width: 87.5%;
   padding: 15px;
   border-radius: 10px;
   box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.07);
   border: 1px solid #eaeaea;
   background-color: white;
`

const Title = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   font-size: 20px;
   font-weight: 300;
`

const AddButton = styled.button`
   background: none;
   border: none;
   font-size: 28px;
   cursor: pointer;
   color: black;
`

const Line = styled.div`
   width: 100%;
   height: 2px;
   background-color: #ff7a00;
   margin-top: 5px;
`

const List = styled.ul`
   margin-top: 10px;
   list-style: none;
   padding: 0;
`

const Item = styled.li`
   font-size: 14px;
   padding: 8px 0;
   display: grid;
   grid-template-columns: 2fr 1fr 1fr;
   align-items: center;
   gap: 10px;
`

const DdayLeft = styled.div`
   text-align: left;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
`

const DdayMiddle = styled.div`
   text-align: center;
   font-weight: bold;
`

const DdayRight = styled.div`
   text-align: right;
   color: orange;
   font-weight: bold;
`

const ModalContent = styled.div`
   background: white;
   padding: 20px;
   border-radius: 10px;
   text-align: center;
   width: 350px;
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 10px;
`

const ModalTitle = styled.h3`
   font-size: 18px;
   font-weight: bold;
`

const ModalButtonWrapper = styled.div`
   display: flex;
   width: 90%;
   gap: 10px;
`

const ModalButton = styled.button`
   flex: 1;
   padding: 12px;
   border: none;
   border-radius: 5px;
   font-size: 16px;
   font-weight: bold;
   cursor: pointer;
   background-color: ${(props) => (props.cancel ? '#888' : 'orange')};
   color: white;

   &:hover {
      background-color: ${(props) => (props.cancel ? '#666' : 'darkorange')};
   }
`

const Modal = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background: rgba(0, 0, 0, 0.3); /* ✅ 배경 어둡게 */
   backdrop-filter: blur(2px); /* ✅ 흐림 효과 추가 */
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1000;
`

const Input = styled.input`
   width: 90%;
   padding: 10px;
   border: 1px solid #ddd;
   border-radius: 5px;
   font-size: 14px;
   background-color: white !important; /* ✅ 배경색 강제 적용 */
   color: black !important; /* ✅ 글씨 색상 강제 적용 */
   pointer-events: auto; /* ✅ 모달이 떠도 입력 가능 */
   &:focus {
      border-color: orange;
      background-color: white; /* ✅ 포커스 시 배경 유지 */
   }
`

export default Dday
