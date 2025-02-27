import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { TextField, Button } from '@mui/material'
import { RiKakaoTalkFill } from 'react-icons/ri'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { loginUserThunk, googleLoginThunk, kakaoLoginThunk, fetchKakaoUserInfoThunk } from '../../features/authSlice'
import { signupUserThunk, checkIdDuplicateThunk, checkNicknameDuplicateThunk } from '../../features/authSlice'
import { useDispatch } from 'react-redux'
import { FlashOnRounded } from '@mui/icons-material'

const Signup = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const location = useLocation()
   const queryParams = new URLSearchParams(location.search)

   //쿼리 파라미터에서 sns 값을 가져와 google 및 kakao 값을 설정
   const snsq = queryParams.get('sns')
   const isGoogle = snsq === 'google'
   const isKakao = snsq === 'kakao'

   // 폼 상태
   const [formData, setFormData] = useState({
      email: queryParams.get('email') || '',
      loginId: '',
      password: '',
      confirmPassword: '',
      nickname: queryParams.get('nickname') || '',
      name: '',
      google: isGoogle, // sns가 google이면 true
      kakao: isKakao, // sns가 kakao이면 true
   })

   const isEmailDisabled = !!queryParams.get('email')
   // 쿼리 파라미터로 nickname 값이 있으면 중복 검사 실행
   useEffect(() => {
      if (queryParams.get('nickname')) {
         dispatch(checkNicknameDuplicateThunk(queryParams.get('nickname')))
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
      }
   }, [])

   // 에러 메시지 상태
   const [errors, setErrors] = useState({})
   const [successMessages, setSuccessMessages] = useState({}) // ✅ 성공 메시지 저장

   // 입력 변경 핸들러
   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
   }

   const validate = () => {
      let newErrors = {}

      // 이메일 형식 검사 및 비밀번호 일치 확인
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
         newErrors.email = '올바른 이메일 형식에 맞춰서 작성해주세요(예시:studyming@google.com).'
      }

      // 비밀번호 확인
      if (formData.password !== formData.confirmPassword) {
         newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const checkDuplicateId = async () => {
      if (!formData.loginId) {
         setErrors((prev) => ({ ...prev, loginId: '아이디를 입력해주세요.' }))
         setSuccessMessages((prev) => ({ ...prev, loginId: '' })) // 성공 메시지 초기화
         return
      }

      try {
         const response = await dispatch(checkIdDuplicateThunk(formData.loginId)).unwrap()
         if (!response.success) {
            setErrors((prev) => ({ ...prev, loginId: '중복된 아이디입니다.' }))
            setSuccessMessages((prev) => ({ ...prev, loginId: '' })) // 성공 메시지 삭제
         } else {
            setErrors((prev) => ({ ...prev, loginId: '' })) // ✅ 중복이 없을 경우 오류 제거
            setSuccessMessages((prev) => ({ ...prev, loginId: '사용할 수 있는 아이디입니다.' }))
         }
      } catch {
         setErrors((prev) => ({ ...prev, loginId: '아이디 중복 확인 실패' }))
      }
   }

   const checkDuplicateNickname = async () => {
      if (!formData.nickname) {
         setErrors((prev) => ({ ...prev, nickname: '닉네임을 입력해주세요.' }))
         setSuccessMessages((prev) => ({ ...prev, nickname: '' }))
         return
      }

      try {
         const response = await dispatch(checkNicknameDuplicateThunk(formData.nickname)).unwrap()
         if (!response.success) {
            setErrors((prev) => ({ ...prev, nickname: '중복된 닉네임입니다.' }))
            setSuccessMessages((prev) => ({ ...prev, nickname: '' }))
         } else {
            setErrors((prev) => ({ ...prev, nickname: '' }))
            setSuccessMessages((prev) => ({ ...prev, nickname: '사용할 수 있는 닉네임입니다.' }))
         }
      } catch {
         setErrors((prev) => ({ ...prev, nickname: '닉네임 중복 확인 실패' }))
      }
   }

   const handleKakaoLogin = () => {
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
               const accessToken = authObj.access_token // 액세스 토큰 가져오기
               const sns = 'kakao'

               dispatch(fetchKakaoUserInfoThunk(accessToken))
                  .unwrap()
                  .then((response) => {
                     console.log('정보', response) // 사용자 정보 로그
                     const kakaoEmail = response.email // 이메일
                     const kakaoNickname = response.nickname // 닉네임

                     // 사용자 정보를 가져온 후 로그인 요청
                     return dispatch(kakaoLoginThunk(accessToken))
                        .unwrap()
                        .then((loginResponse) => {
                           alert(`로그인 성공! ${loginResponse.nickname}님 환영합니다!`)
                           navigate('/home') // 메인 페이지로 이동
                        })
                        .catch((err) => {
                           console.error('서버 오류:', err)
                           // 에러 처리
                           if (err === '회원가입이 필요합니다.') {
                              navigate(`/signup?email=${kakaoEmail}&nickname=${kakaoNickname}&sns=${sns}`) // 회원가입 페이지로 이동
                              window.location.reload() // 페이지 새로고침
                           } else if (err === 'Request failed with status code 400') {
                              alert('카카오 연동된 계정이 아닙니다. 일반 로그인을 사용해주세요.')
                           } else {
                              alert('로그인 중 오류가 발생했습니다.')
                           }
                        })
                  })
            },
            fail: function (err) {
               console.error('카카오 로그인 실패:', err)
               alert('카카오 로그인 실패')
            },
         })
      } catch (error) {
         console.error('카카오 로그인 처리 중 오류:', error)
         alert('카카오 로그인 처리 중 오류가 발생했습니다.')
      }
   }

   const handleGoogleLogin = (credentialResponse) => {
      const decoded = jwtDecode(credentialResponse.credential)
      const sns = 'google'

      dispatch(googleLoginThunk(decoded))
         .unwrap()
         .then((response) => {
            alert(`로그인 성공! ${response.nickname}님 환영합니다!`)
            navigate('/home') // 메인 페이지로 이동
         })
         .catch((error) => {
            console.log(error)
            if (error === '회원가입이 필요합니다.') {
               // 회원가입 페이지로 리다이렉트
               const { email, name: nickname } = decoded
               navigate(`/signup?email=${email}&nickname=${nickname}&sns=${sns}`)
               window.location.reload() // 페이지 새로고침
            } else if (error === 'Request failed with status code 400') {
               // 일반 로그인 사용자인 경우
               alert('구글 연동된 계정이 아닙니다. 일반 로그인을 사용해주세요.')
            } else if (error === '로그인 중 오류 발생') {
               // 서버 오류
               console.error('❌ 서버 오류:', error)
               alert('서버 오류가 발생했습니다. 다시 시도해주세요.')
            } else {
               // 기타 오류
               console.error('❌ 구글 로그인 실패:', error)
            }
         })
   }

   const handleSubmit = (e) => {
      e.preventDefault()
      if (!validate()) return

      // ✅ 아이디 & 닉네임 중복 확인을 했는지 검사
      if (!successMessages.loginId || !successMessages.nickname) {
         setErrors((prev) => ({
            ...prev,
            general: '아이디와 닉네임 중복 확인을 완료해주세요.',
         }))
         return
      }

      dispatch(signupUserThunk(formData))
         .unwrap()
         .then(() => {
            alert('회원가입에 성공하였습니다. 로그인해주세요.')
            navigate('/login')
         })
         .catch((error) => {
            console.error('회원가입 실패:', error)
            setErrors((prevErrors) => ({
               ...prevErrors,
               general: '회원가입 중 오류가 발생했습니다.',
            }))
         })
   }

   return (
      <Wrapper>
         <FormContainer>
            <form onSubmit={handleSubmit}>
               <Title>회원가입</Title>
               <StyledDivider />
               <InputWrapper>
                  <StyledTextField label="이름" name="name" value={formData.name} onChange={handleChange} />
                  <InputRow>
                     <StyledTextField
                        label="닉네임"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        onBlur={checkDuplicateNickname} // ✅ 입력 후 포커스 아웃 시 자동 실행
                        error={!!errors.nickname}
                        helperText={errors.nickname || successMessages.nickname || ''}
                     />
                  </InputRow>

                  <InputRow>
                     <StyledTextField
                        label="아이디"
                        name="loginId"
                        value={formData.loginId}
                        onChange={handleChange}
                        onBlur={checkDuplicateId} // ✅ 입력 후 포커스 아웃 시 자동 실행
                        error={!!errors.loginId}
                        helperText={errors.loginId || successMessages.loginId || ''}
                     />
                  </InputRow>
                  <StyledTextField label="이메일" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email || ''} autoComplete="email" disabled={isEmailDisabled} />
                  <StyledTextField label="비밀번호" name="password" type="password" value={formData.password} onChange={handleChange} helperText="비밀번호는 최소 8자 이상, 영문/숫자/특수문자를 포함해야 합니다." autoComplete="new-password" />
                  <StyledTextField label="비밀번호 확인" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword || ''} autoComplete="new-password" />
               </InputWrapper>
               <StyledButton type="submit">회원가입</StyledButton>
            </form>

            {/* SNS 로그인 */}
            {snsq === null && (
               <>
                  <StyledDividerText>
                     <Line /> SNS 회원가입 <Line />
                  </StyledDividerText>
                  <SNSWrapper>
                     <KakaoButton onClick={handleKakaoLogin}>
                        <KakaoIcon />
                        카카오 로그인
                     </KakaoButton>
                     <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                        <GoogleLogin onSuccess={handleGoogleLogin} onError={() => console.log('구글 로그인 실패')} />
                     </GoogleOAuthProvider>
                  </SNSWrapper>
               </>
            )}
         </FormContainer>
      </Wrapper>
   )
}

export default Signup

// ⭐ Styled Components
const Wrapper = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   height: 100%;
`

const FormContainer = styled.div`
   width: 650px;
   padding: 40px;
   text-align: center;
`

const Title = styled.h2`
   font-weight: bold;
   text-align: left;
   color: black;
`

const StyledDivider = styled.div`
   width: 100%;
   height: 3px;
   background-color: #ff7a00;
   margin: 10px 0 30px 0;
`

const InputWrapper = styled.div`
   display: flex;
   flex-direction: column;
   gap: 20px;
`

const InputRow = styled.div`
   display: flex;
   align-items: center;
   gap: 10px;
`

const StyledTextField = styled(TextField)`
   width: 100%;
   &.MuiTextField-root {
      margin-bottom: 20px;
   }
`

const CheckButton = styled(Button)`
   height: 56px;
   width: 120px;
   background-color: #ff7a00 !important;
   color: white !important;
   font-size: 16px;
   border-radius: 10px !important;
`

const StyledButton = styled(Button)`
   width: 100%;
   background-color: #ff7a00 !important;
   height: 50px;
   color: white !important;
   font-size: 16px;
   padding: 10px;
   border-radius: 10px !important;
   margin-top: 30px !important;
`

const StyledDividerText = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   width: 100%;
   max-width: 650px;
   margin: 40px 0 30px; /* SNS 로그인 선 간격 조정 */
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

const SNSWrapper = styled.div`
   width: 100%;
   max-width: 650px;
   display: flex;
   flex-direction: column;
   gap: 12px;
   margin-bottom: 120px; /* SNS 로그인과 푸터 사이 간격 증가 */
`

const KakaoButton = styled(Button)`
   width: 100%;
   max-width: 650px;
   height: 40px; /* 구글 버튼과 동일한 높이 */
   background-color: #fee500 !important;
   color: black !important;
   font-weight: bold;
   border-radius: 4px !important; /* 구글 버튼과 동일한 테두리 반경 */
   border: 1px solid #ddd !important;
   display: flex;
   align-items: center;
   justify-content: center; /* 텍스트를 중앙에 배치 */
   position: relative;
   padding: 0; /* 패딩 제거 */
`

const KakaoIcon = styled(RiKakaoTalkFill)`
   font-size: 28px;
   position: absolute;
   left: 8px; /* 아이콘을 왼쪽에 배치 */
`
