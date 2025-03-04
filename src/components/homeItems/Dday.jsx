/* 경희 */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDdays, addDdayAsync, updateDdayAsync, deleteDdayAsync } from '../../features/dDaySlice'

const Dday = () => {
   const dispatch = useDispatch()
   const { dDays = [], loading } = useSelector((state) => state.dDay || { dDays: [] }) // Redux에서 D-day 목록 가져오기

   const [ddayTitle, setDdayTitle] = useState('')
   const [ddayDate, setDdayDate] = useState('')
   const [isDdayModalOpen, setIsDdayModalOpen] = useState(false)
   const [editingIndex, setEditingIndex] = useState(null)
   const [tempValue, setTempValue] = useState('')

   // ✅ D-day 목록 가져오기 (Redux 사용)
   useEffect(() => {
      dispatch(fetchDdays())
   }, [dispatch])

   // ✅ D-day 추가
   const handleAddDday = async () => {
      if (!ddayTitle.trim() || !ddayDate) {
         alert('모든 입력 필드를 채워주세요!')
         return
      }

      if (dDays.length >= 5) {
         alert('D-day는 최대 5개까지 입력 가능합니다.')
         return
      }

      dispatch(addDdayAsync({ dName: ddayTitle, dDay: ddayDate }))
      setDdayTitle('')
      setDdayDate('')
      setIsDdayModalOpen(false)
   }

   // ✅ D-day 수정 및 삭제 (Redux 사용)
   const handleEditSave = async (index, field) => {
      const ddayId = dDays[index].id // ✅ ID 가져오기

      if (tempValue.trim() === '') {
         dispatch(deleteDdayAsync(ddayId)) // ✅ Redux에서 삭제
      } else {
         // ✅ 수정되지 않은 값도 포함하여 기존 데이터를 유지
         const updatedDday = {
            id: ddayId,
            dName: field === 'title' ? tempValue : dDays[index].dName, // ✅ 제목 유지
            dDay: field === 'date' ? tempValue : dDays[index].dDay, // ✅ 날짜 유지
         }

         dispatch(updateDdayAsync({ id: ddayId, updatedDday })) // ✅ Redux에서 수정
      }

      setEditingIndex(null) // ✅ 수정 종료
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

   // 🔥 수정 시작 (제목 또는 날짜 클릭 시)
   const handleEditStart = (index, field, value) => {
      setEditingIndex(`${index}-${field}`)
      setTempValue(value)
   }

   return (
      <Box>
         <Title>
            D-day <AddButton onClick={() => (dDays.length < 5 ? setIsDdayModalOpen(true) : alert('D-day는 최대 5개까지 입력 가능합니다.'))}>+</AddButton>
         </Title>
         <Line />
         <List>
            {loading ? (
               <p>로딩 중...</p>
            ) : dDays.length > 0 ? (
               dDays.map((dday, index) => (
                  <Item key={index}>
                     {/* 🔥 제목 수정 가능 */}
                     {editingIndex === `${index}-title` ? (
                        <EditInput type="text" value={tempValue} onChange={(e) => setTempValue(e.target.value)} onBlur={() => handleEditSave(index, 'title')} onKeyDown={(e) => e.key === 'Enter' && handleEditSave(index, 'title')} autoFocus />
                     ) : (
                        <DdayLeft onClick={() => handleEditStart(index, 'title', dday.dName)} title={dday.dName}>
                           {dday.dName}
                        </DdayLeft>
                     )}

                     {/* 🔥 날짜 수정 가능 */}
                     {editingIndex === `${index}-date` ? (
                        <EditInput type="date" value={tempValue} onChange={(e) => setTempValue(e.target.value)} onBlur={() => handleEditSave(index, 'date')} onKeyDown={(e) => e.key === 'Enter' && handleEditSave(index, 'date')} autoFocus />
                     ) : (
                        <DdayMiddle onClick={() => handleEditStart(index, 'date', dday.dDay)}>{dday.dDay}</DdayMiddle>
                     )}

                     {/* ✅ D-day 값 계산 후 출력 */}
                     <DdayRight>{calculateDday(dday.dDay)}</DdayRight>
                  </Item>
               ))
            ) : (
               <p>D-day가 없습니다.</p>
            )}
         </List>

         {isDdayModalOpen && (
            <Modal>
               <ModalContent>
                  <ModalTitle>D-day 추가</ModalTitle>
                  <Input type="text" placeholder="D-day 제목 입력" value={ddayTitle} onChange={(e) => setDdayTitle(e.target.value)} />
                  <Input type="date" value={ddayDate} onChange={(e) => setDdayDate(e.target.value)} />

                  <ModalButtonWrapper>
                     <ModalButton onClick={() => setIsDdayModalOpen(false)} $cancel>
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
   font-size: clamp(14px, 2vw, 20px);
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
   grid-template-columns: auto 1fr auto;
   align-items: center;
   gap: 10px;
   justify-content: space-between;
   text-align: center;
`

const DdayLeft = styled.div`
   text-align: left;
   cursor: pointer;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
   max-width: 150px; /* 🔥 말줄임표가 적용될 최대 너비 설정 */
`

const DdayMiddle = styled.div`
   text-align: center;
   font-weight: bold;
   cursor: pointer;
`

const DdayRight = styled.div`
   text-align: right;
   color: orange;
   font-weight: bold;
   cursor: default;
`

const EditInput = styled.input`
   width: 100%;
   padding: 5px;
   font-size: 14px;
   border: 1px solid #ddd;
   border-radius: 5px;
   text-align: center;
   outline: none;
   &:focus {
      border-color: orange;
   }
`
const Modal = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background: rgba(0, 0, 0, 0.3);
   backdrop-filter: blur(2px);
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1000;
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
   background-color: ${(props) => (props.$cancel ? '#888' : 'orange')};
   color: white;

   &:hover {
      background-color: ${(props) => (props.$cancel ? '#666' : 'darkorange')};
   }
`

const Input = styled.input`
   width: 90%;
   padding: 10px;
   border: 1px solid #ddd;
   border-radius: 5px;
   font-size: 14px;
   background-color: white !important;
   color: black !important;
   pointer-events: auto;
   &:focus {
      border-color: orange;
      background-color: white;
   }
`

export default Dday
