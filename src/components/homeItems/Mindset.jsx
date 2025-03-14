import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMindsets, addMindsetAsync, updateMindsetAsync, deleteMindsetAsync } from '../../features/mindsetSlice'
import styled from 'styled-components'

const Mindset = () => {
   const dispatch = useDispatch()
   const { mindsets, loading, error } = useSelector((state) => state.mindset || { mindsets: [] })

   const [promiseInput, setPromiseInput] = useState('')
   const [isPromiseModalOpen, setIsPromiseModalOpen] = useState(false)
   const [editingIndex, setEditingIndex] = useState(null)
   const [tempValue, setTempValue] = useState('')
   const [errorMessage, setErrorMessage] = useState('')

   useEffect(() => {
      dispatch(fetchMindsets()) // 컴포넌트 마운트 시 데이터 로드
   }, [dispatch])

   // const handleAddPromise = () => {
   //    if (promiseInput.trim() === '') {
   //       setErrorMessage('다짐을 입력하세요!')
   //       return
   //    }
   //    if (promiseInput.length > 100) {
   //       setErrorMessage('다짐은 최대 100자까지 입력 가능합니다.')
   //       return
   //    }
   //    if (mindsets.length < 3) {
   //       dispatch(addMindsetAsync({ content: promiseInput }))
   //       setPromiseInput('')
   //       setErrorMessage('')
   //       setIsPromiseModalOpen(false)
   //    }
   // }
   const handleAddPromise = () => {
      if (promiseInput.trim() === '') {
         setErrorMessage('다짐을 입력하세요!')
         return
      }
      if (promiseInput.length > 100) {
         setErrorMessage('다짐은 최대 100자까지 입력 가능합니다.')
         return
      }
      if (mindsets.length < 3) {
         dispatch(addMindsetAsync({ mindset: promiseInput }))
            .unwrap() // unwrap을 사용하여 결과를 처리
            .then(() => {
               setPromiseInput('')
               setErrorMessage('')
               setIsPromiseModalOpen(false)
               dispatch(fetchMindsets()) // 추가된 데이터 다시 불러오기
            })
            .catch((error) => {
               // 오류 처리
               setErrorMessage(error.message || '다짐 추가 중 오류가 발생했습니다.')
            })
      }
   }

   const handleOpenModal = () => {
      if (mindsets.length >= 3) {
         alert('다짐은 최대 3개까지 입력 가능합니다.')
         return
      }
      setIsPromiseModalOpen(true)
   }

   const handleEditStart = (index) => {
      setEditingIndex(index)
      setTempValue(mindsets[index].mindset)
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

   const handleEditSave = (id) => {
      if (tempValue.trim() === '') {
         dispatch(deleteMindsetAsync(id))
      } else {
         dispatch(updateMindsetAsync({ id, updatedMindset: { mindset: tempValue } }))
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
            {loading ? (
               <p>로딩 중...</p>
            ) : mindsets.length > 0 ? (
               mindsets.map((mindset, index) => (
                  <Item key={mindset.id}>
                     {editingIndex === index ? (
                        <InputWrapper>
                           <EditInput type="text" value={tempValue} onChange={handleEditChange} onBlur={() => handleEditSave(mindset.id)} onKeyDown={(e) => e.key === 'Enter' && handleEditSave(mindset.id)} autoFocus />
                           {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                        </InputWrapper>
                     ) : (
                        <Text onClick={() => handleEditStart(index)}>{mindset.mindset}</Text>
                     )}
                  </Item>
               ))
            ) : (
               <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#777' }}>다짐이 없습니다.</p>
            )}
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
   padding: 5px 0;
   display: flex;
   align-items: center;
   justify-content: space-between;
   cursor: pointer;
`

const Text = styled.span`
   color: #69c6ec;
   cursor: pointer;
   font-size: clamp(14px, 2vw, 20px);
   font-weight: 700;
   &:hover {
      text-decoration: underline;
   }
   margin-bottom: 20px;
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
