import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'

const AccountDelete = () => {
   const [confirmPassword, setConfirmPassword] = useState(false)

   return (
      <Container>
         {!confirmPassword && (
            <>
               <Description>
                  회원 탈퇴 시, 고객님의 소중한 정보는 전부 안전하게 삭제됩니다.
                  <br />
                  모아두신 잔여포인트, 결제 내역, 채팅 기록 등 모든 관련 데이터는 복구 불가능하게 처리되오니 이 점 유의해 주시기 바랍니다.
                  <br />
                  서비스 이용에 대한 모든 기록이 제거되며, 탈퇴 후에는 다시 <Strong>복구가 불가능</Strong>하니 신중하게 결정해 주세요.
               </Description>
               <DeleteButton onClick={() => setConfirmPassword(true)}>탈퇴하기</DeleteButton>
            </>
         )}
         {confirmPassword && (
            <>
               <Description>
                  회원 탈퇴를 진행하시려면, 보안을 위해 현재 사용 중인 비밀번호를 입력해 주셔야 합니다.
                  <br />
                  이는 고객님의 개인정보 보호를 위한 절차이므로, 정확한 비밀번호 입력 후 탈퇴가 완료됩니다.
               </Description>
               <DeleteButton onClick={() => setConfirmPassword(true)}>확인</DeleteButton>
            </>
         )}
      </Container>
   )
}

export default AccountDelete

// Styled Components
const Container = styled.div`
   padding: 50px;
   display: flex;
   justify-content: center; /* 수평 가운데 */
   text-align: center; /* 텍스트 가운데 정렬 */
   flex-direction: column; /* 세로로 배치 */
`
const Description = styled.p`
   font-size: 14px;
   color: #888;
   line-height: 1.6;
   margin-bottom: 40px;
`
const Strong = styled.strong`
   color: red;
`

const DeleteButton = styled.button`
   width: 100%;
   max-width: 500px;
   height: 50px;
   background-color: #ff7a00;
   color: white;
   font-size: 18px;
   border: none;
   cursor: pointer;
   border-radius: 5px;
   display: block;
   margin: 0 auto;
   &:hover {
      background-color: #e06b00;
   }
`
