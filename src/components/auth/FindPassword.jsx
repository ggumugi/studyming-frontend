import React, { useState } from 'react'
import { TextField, Button, CircularProgress } from '@mui/material'
import { checkIdExistsThunk, checkEmailMatchesThunk, verifyCodepwThunk, updatePasswordThunk } from '../../features/authSlice' // Thunk 액션 불러오기
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import '../../styles/authFind.css'

const FindPassword = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const { loading, successMessage, error } = useSelector((state) => state.auth) // Redux 상태 가져오기

   // Step 상태 관리 (현재 단계를 나타내는 상태)
   const [step, setStep] = useState(1) // Step 1부터 시작

   const [id, setId] = useState('')
   const [email, setEmail] = useState('')
   const [inputCode, setInputCode] = useState('')
   const [verificationCode, setVerificationCode] = useState('') // 실제로 받은 코드
   const [newPassword, setNewPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [isPasswordMatch, setIsPasswordMatch] = useState(true)

   // 아이디 검증
   const handleIdCheck = () => {
      dispatch(checkIdExistsThunk(id))
         .unwrap()
         .then((result) => {
            if (result.success) {
               setStep(2) // 이메일 입력 필드로 이동
            }
         })
         .catch((error) => {
            alert(error.message || '아이디 확인 실패')
         })
   }

   // 이메일 및 아이디 검증 후 인증 코드 전송
   const handleEmailCheck = () => {
      dispatch(checkEmailMatchesThunk({ loginId: id, email }))
         .unwrap()
         .then((result) => {
            if (result.success) {
               setStep(3) // 인증 코드 입력 필드로 이동
            }
         })
         .catch((error) => {
            alert(error.message || '아이디와 이메일 검증 실패')
         })
   }

   // 인증 코드 검증
   const handleCodeVerify = () => {
      console.log('📡 인증 코드 검증 요청:', email, inputCode) // ✅ 디버깅 로그 추가

      dispatch(verifyCodepwThunk({ email, verificationCodepw: inputCode }))
         .unwrap()
         .then((result) => {
            if (result.success) {
               setStep(4) // 비밀번호 변경 페이지로 이동
            }
         })
         .catch((error) => {
            alert(error.message || '인증 코드 검증 실패')
         })
   }

   const handlePasswordUpdate = () => {
      if (!newPassword || !confirmPassword) {
         alert('새 비밀번호를 입력해주세요.')
         return
      }

      if (newPassword !== confirmPassword) {
         alert('비밀번호가 일치하지 않습니다.')
         return
      }

      console.log('📡 비밀번호 변경 요청:', { email, newPassword }) // ✅ 디버깅 로그 추가

      dispatch(updatePasswordThunk({ email: email, newPassword: newPassword })) // 🔥 중첩되지 않도록 수정!
         .unwrap()
         .then((result) => {
            if (result.success) {
               // ✅ 휴면 계정이 해제된 경우 메시지 추가
               if (result.message.includes('휴면 계정이 해제되었습니다')) {
                  alert('성공적으로 휴면 해제가 되었습니다. 다시 로그인해 주십시오.')
               } else {
                  alert('비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.')
               }
               setStep(5) // ✅ 비밀번호 변경 완료
               navigate('/login')
            }
         })
         .catch((error) => {
            alert(error.message || '비밀번호 변경 실패')
         })
   }

   return (
      <div className="wrapper">
         <div className="form-container">
            <h2 className="title">비밀번호 찾기</h2>
            <div className="styled-divider"></div>

            {/* Step 1: 아이디 확인 */}
            {step === 1 && (
               <>
                  <TextField className="styled-textfield" label="아이디" value={id} onChange={(e) => setId(e.target.value)} />
                  <p className="small-text">가입하신 아이디를 입력해주세요</p>
                  <Button className="styled-button" onClick={handleIdCheck} disabled={loading}>
                     확인
                  </Button>
               </>
            )}

            {/* Step 2: 이메일 입력 */}
            {step === 2 && (
               <>
                  <TextField className="styled-textfield" label="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <p className="small-text">가입하신 이메일을 입력해주세요</p>
                  <Button className="styled-button" onClick={handleEmailCheck} disabled={loading}>
                     확인
                  </Button>
               </>
            )}

            {/* Step 3: 인증 코드 입력 */}
            {step === 3 && (
               <>
                  <TextField className="styled-textfield" label="인증번호 입력" value={inputCode} onChange={(e) => setInputCode(e.target.value)} />
                  <p className="small-text">이메일로 발송하신 인증번호를 입력해주세요</p>
                  <Button className="styled-button" onClick={handleCodeVerify} disabled={loading}>
                     확인
                  </Button>
               </>
            )}

            {/* Step 4: 새 비밀번호 입력 */}
            {step === 4 && (
               <>
                  <TextField className="styled-textfield" label="새 비밀번호" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <p className="small-text">비밀번호는 최소 8자 이상, 영어 / 숫자 / 특수문자(!@#$%^&*)를 포함해야 합니다.</p>

                  <TextField className="styled-textfield" label="비밀번호 확인" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  {!isPasswordMatch && <p className="error-text">비밀번호가 일치하지 않습니다.</p>}

                  <Button className="styled-button" onClick={handlePasswordUpdate} disabled={loading}>
                     확인
                  </Button>

                  {/* 성공 또는 실패 메시지 */}
                  {successMessage && <div>{successMessage}</div>}
                  {error && <div>{error}</div>}
               </>
            )}

            <p className="link-text">
               <Link to="/login">로그인</Link> | <Link to="/signup">회원가입</Link>
            </p>
         </div>
      </div>
   )
}

export default FindPassword
