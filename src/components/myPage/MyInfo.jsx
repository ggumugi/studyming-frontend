import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { TextField, Button, CircularProgress } from '@mui/material'
import { Google } from '@mui/icons-material'
import { RiKakaoTalkFill } from 'react-icons/ri'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { verifyPasswordThunk, checkNicknameDuplicateThunk, updateUserInfoThunk, googleLoginThunk, kakaoLoginThunk, fetchKakaoUserInfoThunk, connectSnsAccountThunk } from '../../features/authSlice'

const MyInfo = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const location = useLocation()

   // Redux 상태
   const { user, loading, error, successMessage } = useSelector((state) => state.auth)
   const isAuthenticated = !!user

   // 로컬 상태
   const [confirmPassword, setConfirmPassword] = useState(false)
   const [editing, setEditing] = useState(false)
   const [password, setPassword] = useState('')
   const [formData, setFormData] = useState({
      nickname: '',
      password: '',
      confirmPassword: '',
   })
   const [errors, setErrors] = useState({})
   const [successMessages, setSuccessMessages] = useState({})
   const [snsConnecting, setSnsConnecting] = useState(false)
   const [snsResult, setSnsResult] = useState({ success: false, message: '' })

   // 컴포넌트 마운트 또는 경로 변경 시 항상 비밀번호 인증 상태 초기화
   useEffect(() => {
      setConfirmPassword(false)
      setPassword('')
      setEditing(false)
      setErrors({})
      setSuccessMessages({})
      setSnsConnecting(false)
      setSnsResult({ success: false, message: '' })
   }, [location.pathname])

   // 카카오 SDK 초기화
   useEffect(() => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
         window.Kakao.init(process.env.REACT_APP_KAKAO_JS_KEY)
         console.log('카카오 SDK 초기화 완료')
      }
   }, [])
   useEffect(() => {
      console.log(user, 'tq')
   }, [])

   // user 정보가 변경될 때 폼 데이터 업데이트
   useEffect(() => {
      if (user) {
         setFormData((prev) => ({
            ...prev,
            nickname: user.nickname || '',
         }))
      }
   }, [user])

   // 성공 메시지 처리
   useEffect(() => {
      if (successMessage) {
         if (successMessage.includes('비밀번호가 확인되었습니다')) {
            setConfirmPassword(true)
         } else if (successMessage.includes('정보가 업데이트되었습니다')) {
            setEditing(false)
            alert('정보가 성공적으로 업데이트되었습니다.')
         } else if (successMessage.includes('계정이 성공적으로 연동되었습니다')) {
            setSnsConnecting(false)
            setSnsResult({
               success: true,
               message: successMessage,
            })
         }
      }
   }, [successMessage])

   // 오류 메시지 처리
   useEffect(() => {
      if (error) {
         if (error.includes('비밀번호가 일치하지 않습니다') || error.includes('비밀번호 확인')) {
            alert(error)
         }
         setSnsConnecting(false)
         if (error.includes('연동')) {
            setSnsResult({
               success: false,
               message: error,
            })
         }
      }
   }, [error])

   const handleChange = (e) => {
      const { name, value } = e.target
      setFormData({ ...formData, [name]: value })

      // 닉네임이 변경되면 자동으로 중복 검사 수행
      if (name === 'nickname') {
         setSuccessMessages((prev) => ({ ...prev, nickname: '' }))
         setErrors((prev) => ({ ...prev, nickname: '' }))

         // 기존 닉네임과 동일하면 중복 검사 필요 없음
         if (value === user.nickname) {
            setSuccessMessages((prev) => ({ ...prev, nickname: '현재 사용 중인 닉네임입니다.' }))
            return
         }

         // 닉네임이 비어있으면 중복 검사 하지 않음
         if (!value.trim()) {
            setErrors((prev) => ({ ...prev, nickname: '닉네임을 입력해주세요.' }))
            return
         }

         // 닉네임 중복 검사 - 타이핑 후 500ms 지연
         const timeoutId = setTimeout(() => {
            dispatch(checkNicknameDuplicateThunk(value))
               .unwrap()
               .then((response) => {
                  if (!response.success) {
                     setErrors((prev) => ({ ...prev, nickname: '중복된 닉네임입니다.' }))
                     setSuccessMessages((prev) => ({ ...prev, nickname: '' }))
                  } else {
                     setErrors((prev) => ({ ...prev, nickname: '' }))
                     setSuccessMessages((prev) => ({ ...prev, nickname: '사용할 수 있는 닉네임입니다.' }))
                  }
               })
               .catch(() => {
                  setErrors((prev) => ({ ...prev, nickname: '닉네임 중복 확인 실패' }))
               })
         }, 500)

         return () => clearTimeout(timeoutId)
      }
   }

   const validate = () => {
      let newErrors = {}
      let isValid = true

      // 닉네임 중복 확인 결과 검사
      if (formData.nickname !== user.nickname && !successMessages.nickname) {
         newErrors.nickname = '닉네임 중복 확인이 필요합니다.'
         alert('닉네임 중복 확인이 필요합니다.')
         isValid = false
      }

      if (formData.password) {
         // 비밀번호 형식 검사 (최소 8자, 영문/숫자/특수문자 포함)
         const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
         if (!passwordRegex.test(formData.password)) {
            newErrors.password = '비밀번호는 최소 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.'
            alert('비밀번호는 최소 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.')
            isValid = false
         }

         if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
            alert('비밀번호가 일치하지 않습니다.')
            isValid = false
         }
      }

      setErrors(newErrors)
      return isValid
   }

   const handlePasswordChange = (event) => {
      setPassword(event.target.value)
   }

   const handlePasswordConfirm = (event) => {
      event.preventDefault()
      if (!password.trim()) {
         alert('비밀번호를 입력해주세요')
         return
      }

      // 비밀번호 검증 요청
      dispatch(verifyPasswordThunk(password))
         .unwrap()
         .then(() => {
            setConfirmPassword(true)
         })
         .catch((errorMessage) => {
            alert(errorMessage || '비밀번호가 일치하지 않습니다.')
         })
   }

   const handleUpdateInfo = () => {
      if (validate()) {
         // 변경된 내용이 있는지 확인
         const hasChanges = formData.nickname !== user.nickname || formData.password.length > 0

         if (!hasChanges) {
            alert('변경된 내용이 없습니다.')
            setEditing(false)
            return
         }

         // 업데이트할 데이터 준비
         const updateData = {}

         // 닉네임이 변경된 경우만 포함
         if (formData.nickname !== user.nickname) {
            updateData.nickname = formData.nickname
         }

         // 비밀번호가 입력된 경우만 포함
         if (formData.password) {
            updateData.password = formData.password
         }

         // 사용자 정보 업데이트 요청
         dispatch(updateUserInfoThunk(updateData))
            .unwrap()
            .then(() => {
               alert('정보가 성공적으로 업데이트되었습니다.')
               setEditing(false)
            })
            .catch((error) => {
               alert(`정보 업데이트 실패: ${error}`)
            })
      }
   }

   // 구글 로그인 연동 처리
   const handleGoogleConnect = (credentialResponse) => {
      if (snsConnecting) return

      setSnsConnecting(true)
      const decoded = jwtDecode(credentialResponse.credential)
      const { email } = decoded

      // 이메일 일치 여부 확인
      if (email !== user.email) {
         setSnsResult({
            success: false,
            message: '연동하려는 구글 계정의 이메일이 현재 계정의 이메일과 일치하지 않습니다.',
         })
         alert('연동하려는 구글 계정의 이메일이 현재 계정의 이메일과 일치하지 않습니다.')
         setSnsConnecting(false)
         return
      }

      // 이미 연동된 경우
      if (user.google) {
         setSnsResult({
            success: false,
            message: '이미 구글 계정과 연동되어 있습니다.',
         })
         alert('이미 구글 계정과 연동되어 있습니다.')
         setSnsConnecting(false)
         return
      }

      // 구글 계정 연동 요청 - connectSnsAccountThunk 사용
      dispatch(connectSnsAccountThunk({ type: 'google' }))
         .unwrap()
         .then((response) => {
            setSnsResult({
               success: true,
               message: response.message || '구글 계정이 성공적으로 연동되었습니다.',
            })
            alert(response.message || '구글 계정이 성공적으로 연동되었습니다.')
            setSnsConnecting(false)
            // 연동 성공 후 페이지 새로고침
            window.location.reload()
         })
         .catch((error) => {
            setSnsResult({
               success: false,
               message: error || '구글 계정 연동 실패',
            })
            alert(error || '구글 계정 연동 실패')
            setSnsConnecting(false)
         })
   }

   // 카카오 로그인 연동 처리
   const handleKakaoConnect = () => {
      if (snsConnecting) return

      setSnsConnecting(true)

      try {
         if (!window.Kakao) {
            throw new Error('카카오 SDK가 로드되지 않았습니다.')
         }

         if (!window.Kakao.Auth) {
            throw new Error('카카오 Auth 모듈이 로드되지 않았습니다.')
         }

         window.Kakao.Auth.login({
            scope: 'profile_nickname, account_email',
            success: function (authObj) {
               console.log('카카오 로그인 성공:', authObj)
               const accessToken = authObj.access_token

               // 카카오 사용자 정보 가져오기
               dispatch(fetchKakaoUserInfoThunk(accessToken))
                  .unwrap()
                  .then((response) => {
                     const kakaoEmail = response.email

                     // 이메일 일치 여부 확인
                     if (kakaoEmail !== user.email) {
                        setSnsResult({
                           success: false,
                           message: '연동하려는 카카오 계정의 이메일이 현재 계정의 이메일과 일치하지 않습니다.',
                        })
                        alert('연동하려는 카카오 계정의 이메일이 현재 계정의 이메일과 일치하지 않습니다.')
                        setSnsConnecting(false)
                        return
                     }

                     // 이미 연동된 경우
                     if (user.kakao) {
                        setSnsResult({
                           success: false,
                           message: '이미 카카오 계정과 연동되어 있습니다.',
                        })
                        alert('이미 카카오 계정과 연동되어 있습니다.')
                        setSnsConnecting(false)
                        return
                     }

                     // 카카오 계정 연동 요청 - connectSnsAccountThunk 사용
                     dispatch(connectSnsAccountThunk({ type: 'kakao' }))
                        .unwrap()
                        .then((response) => {
                           setSnsResult({
                              success: true,
                              message: response.message || '카카오 계정이 성공적으로 연동되었습니다.',
                           })
                           alert(response.message || '카카오 계정이 성공적으로 연동되었습니다.')
                           setSnsConnecting(false)
                           // 연동 성공 후 페이지 새로고침
                           window.location.reload()
                        })
                        .catch((error) => {
                           setSnsResult({
                              success: false,
                              message: error || '카카오 계정 연동 실패',
                           })
                           alert(error || '카카오 계정 연동 실패')
                           setSnsConnecting(false)
                        })
                  })
                  .catch((error) => {
                     setSnsResult({
                        success: false,
                        message: `카카오 사용자 정보 가져오기 실패: ${error}`,
                     })
                     alert(`카카오 사용자 정보 가져오기 실패: ${error}`)
                     setSnsConnecting(false)
                  })
            },
            fail: function (err) {
               console.error('카카오 로그인 실패:', err)
               setSnsResult({
                  success: false,
                  message: '카카오 로그인 실패',
               })
               alert('카카오 로그인 실패')
               setSnsConnecting(false)
            },
         })
      } catch (error) {
         console.error('카카오 로그인 처리 중 오류:', error)
         setSnsResult({
            success: false,
            message: `카카오 로그인 처리 중 오류: ${error.message}`,
         })
         alert('카카오 로그인 처리 중 오류가 발생했습니다.')
         setSnsConnecting(false)
      }
   }

   if (!isAuthenticated) {
      return <div>로그인이 필요합니다.</div>
   }

   return (
      <InfoContainer>
         {loading && (
            <LoadingOverlay>
               <CircularProgress />
            </LoadingOverlay>
         )}

         {!confirmPassword && (
            <PasswordContainer>
               <PasswordForm onSubmit={handlePasswordConfirm}>
                  <PasswordInput type="password" placeholder="비밀번호" value={password} onChange={handlePasswordChange} required autoComplete="new-password" />
                  <InfoText>내 정보를 수정 및 열람하기 위해서는 비밀번호 인증이 필요합니다.</InfoText>
                  <EditButton type="submit" disabled={loading}>
                     {loading ? '확인 중...' : '확인'}
                  </EditButton>
               </PasswordForm>
            </PasswordContainer>
         )}

         {confirmPassword && !editing && user && (
            <InfoDetails>
               <InfoRow>
                  <Label>닉네임</Label>
                  <Value>{user.nickname}</Value>
               </InfoRow>
               <InfoRow>
                  <Label>이메일</Label>
                  <Value>{user.email}</Value>
               </InfoRow>
               <InfoRow>
                  <Label>카카오연동</Label>
                  <Value>{user.kakao ? 'O' : 'X'}</Value>
               </InfoRow>
               <InfoRow>
                  <Label>구글연동</Label>
                  <Value>{user.google ? 'O' : 'X'}</Value>
               </InfoRow>
               <EditButton onClick={() => setEditing(true)}>정보 수정</EditButton>
            </InfoDetails>
         )}

         {confirmPassword && editing && (
            <InfoForm>
               <InputWrapper>
                  <StyledTextField label="닉네임" name="nickname" value={formData.nickname} onChange={handleChange} error={!!errors.nickname} helperText={errors.nickname || successMessages.nickname || ''} />
                  <StyledTextField
                     label="비밀번호"
                     name="password"
                     type="password"
                     value={formData.password}
                     onChange={handleChange}
                     error={!!errors.password}
                     helperText={errors.password || '비밀번호는 최소 8자 이상, 영문/숫자/특수문자를 포함해야 합니다. 변경하지 않으려면 비워두세요.'}
                     autoComplete="new-password"
                  />
                  <StyledTextField label="비밀번호 확인" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword || ''} disabled={!formData.password} autoComplete="new-password" />
               </InputWrapper>

               <SNSWrapper>
                  <StyledDividerText>
                     <Line /> SNS 연동 <Line />
                  </StyledDividerText>

                  {/* 구글 로그인 연동 버튼 - 로그인 페이지와 동일한 스타일 */}
                  {user.google ? (
                     <GoogleConnectedButton>
                        <GoogleIcon />
                        구글 연동 완료
                     </GoogleConnectedButton>
                  ) : (
                     <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                        <GoogleLoginContainer>
                           <GoogleLogin
                              onSuccess={handleGoogleConnect}
                              onError={() => {
                                 console.log('구글 로그인 실패')
                                 setSnsConnecting(false)
                              }}
                              width="100%"
                           />
                        </GoogleLoginContainer>
                     </GoogleOAuthProvider>
                  )}

                  {/* 카카오 로그인 연동 버튼 */}
                  {user.kakao ? (
                     <KakaoConnectedButton>
                        <KakaoIcon />
                        카카오 연동 완료
                     </KakaoConnectedButton>
                  ) : (
                     <KakaoButton onClick={handleKakaoConnect}>
                        <KakaoIcon />
                        카카오로 시작하기
                     </KakaoButton>
                  )}
               </SNSWrapper>

               {snsResult.message && <ResultMessage success={snsResult.success}>{snsResult.message}</ResultMessage>}

               <StyledButton onClick={handleUpdateInfo} disabled={loading || snsConnecting}>
                  {loading ? '업데이트 중...' : '정보 설정 완료'}
               </StyledButton>
            </InfoForm>
         )}
      </InfoContainer>
   )
}

export default MyInfo

// Styled Components
const InfoContainer = styled.div`
   padding: 50px;
   display: block;
`

const PasswordContainer = styled.div`
   width: 100%;
   text-align: center;
`

const PasswordForm = styled.form`
   display: flex;
   flex-direction: column;
   gap: 15px;
`

const PasswordInput = styled.input`
   width: 100%;
   max-width: 500px;
   height: 50px;
   padding: 10px;
   font-size: 16px;
   border: 1px solid #ddd;
   border-radius: 5px;
   margin: auto;
`

const InfoText = styled.p`
   font-size: 14px;
   color: #888;
   margin: 0;
`

const InfoDetails = styled.div`
   margin-bottom: 40px;
`

const InfoRow = styled.div`
   display: flex;
   margin-bottom: 70px;
   font-size: 18px;
   padding: 0 20px;
`

const Label = styled.div`
   font-weight: 500;
   margin-right: 20px;
   text-align: right;
   flex: 1;
`

const Value = styled.div`
   font-weight: 300;
   margin-left: 20px;
   text-align: left;
   flex: 1;
`

const EditButton = styled.button`
   width: 100%;
   max-width: 500px;
   height: 50px;
   background-color: #ff7a00;
   color: white;
   font-size: 18px;
   border: none;
   cursor: pointer;
   border-radius: 5px;
   margin: 20px auto 0;
   display: block;
`

const InfoForm = styled.div`
   max-width: 500px;
   margin: auto;
`

const InputWrapper = styled.div`
   display: flex;
   flex-direction: column;
   gap: 20px;
`

const StyledTextField = styled(TextField)`
   width: 100%;
   &.MuiTextField-root {
      margin-bottom: 20px;
   }
`

const StyledButton = styled.button`
   width: 100%;
   max-width: 500px;
   height: 50px;
   background-color: #ff7a00;
   color: white;
   font-size: 18px;
   border: none;
   cursor: pointer;
   border-radius: 5px;
   margin: 20px auto 0;
   display: block;
`

const SNSWrapper = styled.div`
   width: 100%;
   max-width: 500px;
   display: flex;
   flex-direction: column;
   gap: 12px;
   margin-top: 40px;
`

const StyledDividerText = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   width: 100%;
   margin: 40px 0 30px;
   color: gray;
   font-size: 14px;
   font-weight: 500;
   position: relative;
`

const Line = styled.div`
   flex-grow: 1;
   height: 1px;
   background-color: #ddd;
   margin: 0 15px;
`

// 구글 로그인 관련 스타일 (로그인 페이지와 동일하게 맞춤)
const GoogleLoginContainer = styled.div`
   width: 100%;
   margin-bottom: 10px;

   & > div {
      width: 100% !important;
   }
`

const GoogleConnectedButton = styled.div`
   width: 100%;
   height: 40px;
   background-color: #e9e9e9;
   color: #2e61b2;
   font-weight: bold;
   border-radius: 4px;
   border: 1px solid #ddd;
   display: flex;
   align-items: center;
   justify-content: center;
   position: relative;
   margin-bottom: 10px;
   cursor: default;
   pointer-events: none;
`

const GoogleIcon = styled(Google)`
   width: 18px;
   height: 18px;
   margin-right: 15px;
   color: #4285f4; // 구글 브랜드 색상 (선택 사항)
`

// 카카오 버튼 스타일 (로그인 페이지와 동일하게 맞춤)
const KakaoButton = styled(Button)`
   width: 100%;
   height: 40px;
   background-color: #fee500 !important;
   color: black !important;
   font-weight: bold;
   border-radius: 4px !important;
   border: 1px solid #ddd !important;
   display: flex;
   align-items: center;
   justify-content: center;
   position: relative;
   padding: 0;
`

const KakaoConnectedButton = styled.div`
   width: 100%;
   height: 40px;
   background-color: #d1c100;
   color: #8e5c2f;
   font-weight: bold;
   border-radius: 4px;
   border: 1px solid #ddd;
   display: flex;
   align-items: center;
   justify-content: center;
   position: relative;
   cursor: default;
   pointer-events: none;
`

const KakaoIcon = styled(RiKakaoTalkFill)`
   font-size: 20px;
   margin-right: 8px;
`

const LoadingOverlay = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: rgba(255, 255, 255, 0.7);
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 1000;
`

const ResultMessage = styled.div`
   margin-top: 15px;
   padding: 10px;
   border-radius: 5px;
   text-align: center;
   background-color: ${(props) => (props.success ? '#e6f7e6' : '#ffebeb')};
   color: ${(props) => (props.success ? '#2e7d32' : '#d32f2f')};
   font-size: 14px;
`
