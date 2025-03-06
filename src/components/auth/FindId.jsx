import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendCodeThunk, verifyCodeThunk } from '../../features/authSlice'
import { TextField, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import '../../styles/authFind.css' // ✅ 공통 CSS 적용

const FindIdPage = () => {
   const dispatch = useDispatch()
   const { loading, successMessage, error, loginId } = useSelector((state) => state.auth)

   const [email, setEmail] = useState('')
   const [inputCode, setInputCode] = useState('')
   const [step, setStep] = useState(1)

   const handleSendCode = () => {
      if (!email) {
         alert('이메일을 입력해주세요.')
         return
      }

      dispatch(sendCodeThunk(email))
         .unwrap()
         .then(() => {
            alert('이메일로 인증번호가 전송되었습니다.')
            setStep(2) // ✅ 성공한 경우에만 실행
         })
         .catch((err) => {
            // console.log('🚨 [DEBUG] 이메일 인증 오류 응답:', err) // ✅ 오류 데이터 확인
            alert(err?.message || err?.error || JSON.stringify(err) || '이메일 인증 요청 중 오류가 발생했습니다.')
         })
   }

   const handleVerifyCode = () => {
      if (!inputCode) {
         alert('인증 코드를 입력해주세요.')
         return
      }
      dispatch(verifyCodeThunk({ email, verificationCode: inputCode }))
         .unwrap()
         .then(() => {
            alert('아이디 찾기 성공! 아이디를 확인하세요.')
            setStep(3) // ✅ 성공한 경우에만 실행
         })
         .catch((err) => {
            // console.log('🚨 [DEBUG] 인증 코드 오류 응답:', err) // ✅ 오류 데이터 확인
            alert(err?.message || err?.error || JSON.stringify(err) || '인증 코드 확인 중 오류가 발생했습니다.')
         })
   }
   return (
      <div className="wrapper">
         <div className="form-container">
            <h2 className="title">아이디 찾기</h2>
            <div className="styled-divider"></div>

            {step === 1 && (
               <>
                  <TextField className="styled-textfield" label="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                  <p className="small-text">가입하신 이메일을 입력해주세요</p>
                  <Button className="styled-button" onClick={handleSendCode} disabled={loading}>
                     확인
                  </Button>
               </>
            )}

            {step === 2 && (
               <>
                  <TextField className="styled-textfield" label="인증번호 입력" type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value)} disabled={loading} />
                  <p className="small-text">이메일로 발송하신 인증번호를 입력해주세요</p>
                  <Button className="styled-button" onClick={handleVerifyCode}>
                     확인
                  </Button>
               </>
            )}

            {step === 3 && (
               <>
                  <p className="found-id-text">
                     아이디 찾기 성공! {email}님의 가입된 아이디는: <span className="highlighted-id">{loginId}</span> 입니다.
                  </p>
               </>
            )}

            <p className="link-text">
               <Link to="/login">로그인</Link> | <Link to="/signup">회원가입</Link>
            </p>
         </div>
      </div>
   )
}

export default FindIdPage

/* 아이디찾기 비밀번호찾기 스타일 중복되어서
외부 css파일에 저장해뒀어요
*/
