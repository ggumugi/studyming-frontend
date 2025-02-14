import React, { useState } from 'react'
import { TextField, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import '../../styles/authFind.css'

const FindPwquestion = () => {
   const [step, setStep] = useState(1)
   const [id, setId] = useState('')
   const [email, setEmail] = useState('')
   const [verificationCode, setVerificationCode] = useState('')
   const [inputCode, setInputCode] = useState('')
   const [newPassword, setNewPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [isPasswordMatch, setIsPasswordMatch] = useState(true)

   const handleSubmit = () => {
      if (step === 1) {
         if (!id) {
            alert('아이디를 입력해주세요.')
         } else {
            setStep(2)
            alert('아이디 확인 완료.')
         }
      } else if (step === 2) {
         if (!email) {
            alert('이메일을 입력해주세요.')
         } else {
            setVerificationCode('1234')
            setStep(3)
            alert('이메일로 인증번호가 전송되었습니다.')
         }
      } else if (step === 3) {
         if (inputCode !== verificationCode) {
            alert('인증번호가 일치하지 않습니다.')
         } else {
            setStep(4)
            alert('인증 완료! 새로운 비밀번호를 설정해주세요.')
         }
      } else if (step === 4) {
         if (!newPassword || !confirmPassword) {
            alert('새로운 비밀번호와 확인 비밀번호를 입력해주세요.')
         } else if (newPassword !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.')
         } else {
            alert('비밀번호가 성공적으로 재설정되었습니다.')
         }
      }
   }

   return (
      <div className="wrapper">
         <div className="form-container">
            <h2 className="title">비밀번호 찾기</h2>
            <div className="styled-divider"></div>

            {step === 1 && (
               <>
                  <TextField className="styled-textfield" label="아이디" type="text" value={id} onChange={(e) => setId(e.target.value)} />
                  <p className="small-text">가입하신 아이디를 입력해주세요</p>
                  <Button className="styled-button" onClick={handleSubmit}>
                     확인
                  </Button>
               </>
            )}

            {step === 2 && (
               <>
                  <TextField className="styled-textfield" label="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <p className="small-text">가입하신 이메일을 입력해주세요</p>
                  <Button className="styled-button" onClick={handleSubmit}>
                     확인
                  </Button>
               </>
            )}

            {step === 3 && (
               <>
                  <TextField className="styled-textfield" label="인증번호 입력" type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value)} />
                  <p className="small-text">이메일로 발송하신 인증번호를 입력해주세요</p>
                  <Button className="styled-button" onClick={handleSubmit}>
                     인증 완료
                  </Button>
               </>
            )}

            {step === 4 && (
               <>
                  <TextField className="styled-textfield" label="새 비밀번호" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <p className="small-text">비밀번호는 최소 8자 이상, 영어 / 숫자 / 특수문자(!@#$%^&*)를 포함해야 합니다.</p>

                  <TextField className="styled-textfield" label="비밀번호 확인" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  {!isPasswordMatch && <p className="error-text">비밀번호가 일치하지 않습니다.</p>}

                  <Button className="styled-button" onClick={handleSubmit}>
                     비밀번호 재설정
                  </Button>
               </>
            )}

            <p className="link-text">
               <Link to="/login">로그인</Link> | <Link to="/signup">회원가입</Link>
            </p>
         </div>
      </div>
   )
}

export default FindPwquestion

/* 아이디찾기 비밀번호찾기 스타일 중복되어서
외부 css파일에 저장해뒀어요
*/
