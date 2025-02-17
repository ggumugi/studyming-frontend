import React, { useState } from 'react'
import styled from 'styled-components'

const Mindset = () => {
   const [promises, setPromises] = useState([])
   const [promiseInput, setPromiseInput] = useState('')
   const [isPromiseModalOpen, setIsPromiseModalOpen] = useState(false)
   const [editingIndex, setEditingIndex] = useState(null)
   const [tempValue, setTempValue] = useState('')
   const [errorMessage, setErrorMessage] = useState('')

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

   const handleOpenModal = () => {
      if (promises.length >= 3) {
         alert('다짐은 최대 3개까지 입력 가능합니다.')
         return
      }
      setIsPromiseModalOpen(true)
   }

   const handleEditStart = (index) => {
      setEditingIndex(index)
      setTempValue(promises[index])
   }

   const handleEditChange = (e) => {
      const value = e.target.value
      if (value.length <= 100) {
         setTempValue(value)
         setErrorMessage('')
      } else {
         setErrorMessage('다짐은 최대 100자까지 입력 가능합니다.')
      }
   }

   const handleEditSave = (index) => {
      if (tempValue.trim() === '') {
         setPromises(promises.filter((_, i) => i !== index))
      } else {
         const updatedPromises = [...promises]
         updatedPromises[index] = tempValue
         setPromises(updatedPromises)
      }
      setEditingIndex(null)
      setErrorMessage('')
   }

   return (
      <Box>
         <Title>
            다짐 <AddButton onClick={handleOpenModal}>+</AddButton>
         </Title>
         <Line />
         <List>
            {promises.map((promise, index) => (
               <Item key={index}>
                  {editingIndex === index ? (
                     <InputWrapper>
                        <EditInput type="text" value={tempValue} onChange={handleEditChange} onBlur={() => handleEditSave(index)} onKeyDown={(e) => e.key === 'Enter' && handleEditSave(index)} autoFocus />
                        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                     </InputWrapper>
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

// ✅ Styled Components
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

const InputWrapper = styled.div`
   display: flex;
   flex-direction: column;
   width: 100%;
   gap: 5px; /* 입력창과 에러 메시지 간격 */
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
   margin: 5px 0 0 0;
   text-align: left;
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
/* vw 변동시 글자수가 박스 넘치는 문제  */
export default Mindset
