import React, { useState } from 'react'
import styled from 'styled-components'

const Mindset = () => {
   const [promises, setPromises] = useState([])
   const [promiseInput, setPromiseInput] = useState('')
   const [isPromiseModalOpen, setIsPromiseModalOpen] = useState(false)
   const [editingIndex, setEditingIndex] = useState(null) // ✅ 수정 중인 항목 저장
   const [tempValue, setTempValue] = useState('') // ✅ 임시 저장 값
   const [errorMessage, setErrorMessage] = useState('') // ✅ 초과 글자수 경고 메시지

   const handleAddPromise = () => {
      if (promiseInput.trim() === '') {
         setErrorMessage('다짐을 입력하세요!')
         return
      }

      if (promiseInput.length > 100) {
         setErrorMessage('다짐은 최대 100자까지 입력 가능합니다.')
         return
      }

      if (promises.length < 3) {
         setPromises([...promises, promiseInput])
         setPromiseInput('')
         setErrorMessage('')
         setIsPromiseModalOpen(false)
      }
   }

   // ✅ 3개 입력 후 추가 버튼 클릭 시 알림 표시
   const handleOpenModal = () => {
      if (promises.length >= 3) {
         alert('다짐은 최대 3개까지 입력 가능합니다.') // ✅ 알림창 표시
         return
      }
      setIsPromiseModalOpen(true)
   }

   // ✅ 수정 시작
   const handleEditStart = (index) => {
      setEditingIndex(index)
      setTempValue(promises[index]) // 기존 값 저장
   }

   // ✅ 수정 완료
   const handleEditSave = (index) => {
      if (tempValue.trim() === '') {
         // ✅ 빈 값이면 삭제
         setPromises(promises.filter((_, i) => i !== index))
      } else {
         const updatedPromises = [...promises]
         updatedPromises[index] = tempValue
         setPromises(updatedPromises)
      }
      setEditingIndex(null) // 수정 종료
   }

   return (
      <Box>
         <Title>
            다짐 <AddButton onClick={handleOpenModal}>+</AddButton> {/* ✅ 3개 초과 시 알림 기능 추가 */}
         </Title>
         <Line />
         <List>
            {promises.map((promise, index) => (
               <Item key={index}>
                  {editingIndex === index ? (
                     <EditInput type="text" value={tempValue} onChange={(e) => setTempValue(e.target.value)} onBlur={() => handleEditSave(index)} onKeyDown={(e) => e.key === 'Enter' && handleEditSave(index)} autoFocus />
                  ) : (
                     <Text onClick={() => handleEditStart(index)}>{promise}</Text>
                  )}
               </Item>
            ))}
         </List>

         {isPromiseModalOpen && (
            <Modal>
               <ModalContent>
                  <h3>다짐 추가</h3>
                  <TextAreaWrapper>
                     <TextArea
                        placeholder="다짐을 입력하세요 (최대 100자)"
                        value={promiseInput}
                        onChange={(e) => {
                           const inputText = e.target.value
                           if (inputText.length > 100) {
                              setErrorMessage('다짐은 최대 100자까지 입력 가능합니다.')
                           } else {
                              setErrorMessage('')
                           }
                           setPromiseInput(inputText.slice(0, 100))
                        }}
                     />
                     {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                  </TextAreaWrapper>
                  <ButtonWrapper>
                     <ModalButton onClick={() => setIsPromiseModalOpen(false)} style={{ backgroundColor: '#888' }}>
                        취소
                     </ModalButton>
                     <ModalButton onClick={handleAddPromise}>추가</ModalButton>
                  </ButtonWrapper>
               </ModalContent>
            </Modal>
         )}
      </Box>
   )
}

// ✅ Styled Components (기존 코드 유지)
const Box = styled.div`
   margin: auto;
   width: 88%;
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
   padding: 5px 0;
   display: flex;
   align-items: center;
   justify-content: space-between;
   cursor: pointer;
`

const Text = styled.span`
   cursor: pointer;
   &:hover {
      text-decoration: underline;
   }
`

const EditInput = styled.input`
   width: 100%;
   padding: 5px;
   font-size: 14px;
   border: 1px solid #ddd;
   border-radius: 5px;
   text-align: left;
   outline: none;
   &:focus {
      border-color: orange;
   }
`

const ModalContent = styled.div`
   background: white;
   padding: 20px;
   border-radius: 10px;
   text-align: center;
   width: 300px;
`

const TextAreaWrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   width: 100%;
`

const TextArea = styled.textarea`
   width: 100%;
   height: 120px;
   padding: 10px;
   margin-top: 10px;
   border: 1px solid #ddd;
   border-radius: 5px;
   resize: none;
   font-size: 14px;
   font-family: inherit;
   overflow-y: hidden;
`

const ErrorText = styled.p`
   color: red;
   font-size: 12px;
   margin-top: 5px;
`

const ButtonWrapper = styled.div`
   display: flex;
   justify-content: space-between;
   margin-top: 15px;
`

const ModalButton = styled.button`
   padding: 10px 15px;
   border: none;
   background-color: orange;
   color: white;
   cursor: pointer;
   border-radius: 5px;
   width: 48%;

   &:hover {
      background-color: darkorange;
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
/* 수정 시 글자수 제한 걸기 */
export default Mindset
