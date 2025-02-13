import React, { useState } from 'react'
import styled from 'styled-components'

const Mindset = () => {
   const [promises, setPromises] = useState([])
   const [promiseInput, setPromiseInput] = useState('')
   const [isPromiseModalOpen, setIsPromiseModalOpen] = useState(false)
   const [errorMessage, setErrorMessage] = useState('') // ✅ 초과 글자수 경고 메시지

   const handleAddPromise = () => {
      if (promiseInput.trim() === '') {
         setErrorMessage('다짐을 입력하세요!') // ✅ 빈 입력 경고
         return
      }

      if (promiseInput.length > 100) {
         setErrorMessage('다짐은 최대 100자까지 입력 가능합니다.') // ✅ 100자 초과 경고
         return
      }

      if (promises.length < 3) {
         setPromises([...promises, promiseInput])
         setPromiseInput('')
         setErrorMessage('') // ✅ 정상 입력 시 경고 제거
         setIsPromiseModalOpen(false)
      }
   }

   return (
      <Box>
         <Title>
            다짐 <AddButton onClick={() => setIsPromiseModalOpen(true)}>+</AddButton>
         </Title>
         <Line />
         <List>
            {promises.map((promise, index) => (
               <Item key={index}>{promise}</Item>
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
                              setErrorMessage('다짐은 최대 100자까지 입력 가능합니다.') // ✅ 초과 경고
                           } else {
                              setErrorMessage('')
                           }
                           setPromiseInput(inputText.slice(0, 100)) // ✅ 초과 입력 방지
                        }}
                     />
                     {errorMessage && <ErrorText>{errorMessage}</ErrorText>} {/* ✅ 경고 메시지 표시 */}
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
`

/* ✅ 모달창 스타일 */

const ModalContent = styled.div`
   background: white;
   padding: 20px;
   border-radius: 10px;
   text-align: center;
   width: 300px;
`

/* ✅ 입력창과 오류 메시지를 감싸는 컨테이너 */
const TextAreaWrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   width: 100%;
`

/* ✅ 입력창 높이 증가 (스크롤바 없이) */
const TextArea = styled.textarea`
   width: 100%;
   height: 120px; /* ✅ 높이 증가 */
   padding: 10px;
   margin-top: 10px;
   border: 1px solid #ddd;
   border-radius: 5px;
   resize: none;
   font-size: 14px;
   font-family: inherit;
   overflow-y: hidden; /* ✅ 스크롤바 제거 */
`

/* ✅ 초과 입력 시 빨간색 메시지 표시 */
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

export default Mindset
