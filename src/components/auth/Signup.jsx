// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// import styled from 'styled-components'
// import { TextField, Button } from '@mui/material'

// import { RiKakaoTalkFill } from 'react-icons/ri'
// import { FcGoogle } from 'react-icons/fc'
// import { signupUserThunk, checkIdDuplicateThunk, checkNicknameDuplicateThunk } from '../../features/authSlice'
// import { useDispatch } from 'react-redux'
// import axios from 'axios'

// //ui 툴 구상
// //이메일 형식 검사(이상하게 입력 시 작성해달라고 글씨가 뜸),비밀번호확인과 비밀번호 입력필드 서로 다르면 안내문자 뜨기 구현

// //백엔드 구현 후 닉네임 아이디 중복 검사기능 구현 -> 후에 버튼 눌렀을 시 중복된 닉네임,중복된 아이디입니다 입력필드 밑에 뜨게 구현

// const Signup = () => {
//    const navigate = useNavigate()
//    const dispatch = useDispatch()

//    // 폼 상태
//    const [formData, setFormData] = useState({
//       email: '',
//       login_id: '',
//       password: '',
//       confirmPassword: '',
//       nickname: '',
//       name: '',
//    })

//    // 에러 메시지 상태
//    const [errors, setErrors] = useState({})

//    // 중복 검사 상태
//    const [isCheckingId, setIsCheckingId] = useState(false)
//    const [isCheckingNickname, setIsCheckingNickname] = useState(false)

//    // 입력 변경 핸들러
//    const handleChange = (e) => {
//       setFormData({ ...formData, [e.target.name]: e.target.value })
//    }

//    const validate = () => {
//       let newErrors = {}

//       // 이메일 형식 검사 및 비밀번호 일치 확인
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//       if (!emailRegex.test(formData.email)) {
//          newErrors.email = '올바른 이메일 형식에 맞춰서 작성해주세요(예시:studyming@google.com).'
//       }

//       // 비밀번호 확인
//       if (formData.password !== formData.confirmPassword) {
//          newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
//       }

//       setErrors(newErrors)
//       return Object.keys(newErrors).length === 0
//    }
//    //아이디 중복확인
//    const checkDuplicateId = async () => {
//       if (!formData.login_id) return // 아이디 입력 안 했으면 체크 X

//       try {
//          const response = await dispatch(checkIdDuplicateThunk(formData.login_id)).unwrap()
//          if (!response.success) {
//             setErrors((prev) => ({ ...prev, login_id: '중복된 아이디입니다.' }))
//          } else {
//             setErrors((prev) => ({ ...prev, login_id: '' }))
//          }
//       } catch (error) {
//          setErrors((prev) => ({ ...prev, login_id: '아이디 중복 확인 실패' }))
//       }
//    }
//    // 닉네임 중복확인
//    const checkDuplicateNickname = async () => {
//       if (!formData.nickname) return // 닉네임 입력 안 했으면 체크 X

//       try {
//          const response = await dispatch(checkNicknameDuplicateThunk(formData.nickname)).unwrap()
//          if (!response.success) {
//             setErrors((prev) => ({ ...prev, nickname: '중복된 닉네임입니다.' }))
//          } else {
//             setErrors((prev) => ({ ...prev, nickname: '' }))
//          }
//       } catch (error) {
//          setErrors((prev) => ({ ...prev, nickname: '닉네임 중복 확인 실패' }))
//       }
//    }

//    const handleSubmit = async (e) => {
//       e.preventDefault()
//       if (!validate()) return

//       // ✅ 이미 중복 체크한 에러가 있으면 바로 리턴
//       if (errors.login_id || errors.nickname) return

//       try {
//          await dispatch(signupUserThunk(formData)).unwrap()
//          alert('회원가입에 성공하였습니다. 프로필을 입력해주세요.')
//          navigate('/profile-setup')
//       } catch (error) {
//          console.error('회원가입 실패:', error)
//          setErrors((prevErrors) => ({
//             ...prevErrors,
//             general: '회원가입 중 오류가 발생했습니다.',
//          }))
//       }
//    }
//    return (
//       <Wrapper>
//          <FormContainer>
//             <form onSubmit={handleSubmit}>
//                {/* ✅ 폼 태그 추가 */}
//                <Title>회원가입</Title>
//                <StyledDivider />
//                <InputWrapper>
//                   <StyledTextField label="이름" name="name" value={formData.name} onChange={handleChange} />
//                   <StyledTextField label="닉네임" name="nickname" value={formData.nickname} onChange={handleChange} onBlur={checkDuplicateNickname} error={!!errors.nickname} helperText={errors.nickname || ''} />
//                   <StyledTextField label="이메일" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email || ''} autoComplete="email" />
//                   <StyledTextField label="아이디" name="login_id" value={formData.login_id} onChange={handleChange} onBlur={checkDuplicateId} error={!!errors.login_id} helperText={errors.login_id || ''} autoComplete="username" />
//                   <StyledTextField label="비밀번호" name="password" type="password" value={formData.password} onChange={handleChange} helperText="비밀번호는 최소 8자 이상, 영문/숫자/특수문자를 포함해야 합니다." autoComplete="new-password" />
//                   <StyledTextField label="비밀번호 확인" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword || ''} autoComplete="new-password" />
//                </InputWrapper>
//                <StyledButton type="submit">회원가입</StyledButton> {/* ✅ 버튼 타입 변경 */}
//             </form>

//             {/* SNS 로그인 */}
//             <StyledDividerText>
//                <Line /> SNS 로그인 <Line />
//             </StyledDividerText>
//             <SNSWrapper>
//                <KakaoButton>
//                   <RiKakaoTalkFill style={{ fontSize: '32px', transform: 'translateX(-600%)' }} />
//                   카카오 로그인
//                </KakaoButton>
//                <SNSLogin>
//                   <FcGoogle style={{ fontSize: '32px', transform: 'translateX(-620%)' }} />
//                   구글 로그인
//                </SNSLogin>
//             </SNSWrapper>
//          </FormContainer>
//       </Wrapper>
//    )
// }

// export default Signup

// // ⭐ Styled Components
// const Wrapper = styled.div`
//    display: flex;
//    align-items: center;
//    justify-content: center;
//    height: 100%;
// `

// const FormContainer = styled.div`
//    width: 650px;
//    padding: 40px;
//    text-align: center;
// `

// const Title = styled.h2`
//    font-weight: bold;
//    text-align: left;
//    color: black; /* ✅ 회원가입 문구 검정색 적용 */
// `

// const StyledDivider = styled.div`
//    width: 100%;
//    height: 3px;
//    background-color: #ff7a00;
//    margin: 10px 0 30px 0;
// `

// const InputWrapper = styled.div`
//    display: flex;
//    flex-direction: column;
//    gap: 20px;
// `

// const StyledTextField = styled(TextField)`
//    width: 100%;
//    &.MuiTextField-root {
//       margin-bottom: 20px; /* ✅ 필드 간격 조정 */
//    }
// `

// const StyledButton = styled(Button)`
//    width: 100%;
//    background-color: #ff7a00 !important;
//    height: 50px;
//    color: white !important;
//    font-size: 16px;
//    padding: 10px;
//    border-radius: 10px !important;
//    margin-top: 30px; /* ✅ 비밀번호 확인 필드와 회원가입 버튼 사이 margin 추가 */
// `

// const SNSWrapper = styled.div`
//    display: flex;
//    flex-direction: column;
//    gap: 10px;
//    margin-top: 20px;
//    margin-bottom: 170px;
// `

// const StyledDividerText = styled.div`
//    display: flex;
//    align-items: center;
//    justify-content: center;
//    width: 100%;
//    max-width: 650px;
//    margin: 40px 0 0px; /* SNS 로그인 선 간격 조정 */
//    color: gray;
//    font-size: 14px;
//    font-weight: 500;
//    position: relative;
// `

// const Line = styled.div`
//    flex-grow: 1;
//    height: 1px;
//    background-color: #ddd;
//    margin: 0 15px;
// `
// const SNSLogin = styled(Button)`
//    width: 100%;
//    border: 1px solid #ddd !important;
//    border-radius: 50px !important;
//    color: #000 !important;
//    background: white !important;
//    font-weight: bold;
// `

// const KakaoButton = styled(Button)`
//    width: 100%;
//    background-color: #fee500 !important;
//    color: black !important;
//    font-weight: bold;
//    border-radius: 50px !important;
// `

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { TextField, Button } from '@mui/material'
import { RiKakaoTalkFill } from 'react-icons/ri'
import { FcGoogle } from 'react-icons/fc'
import { signupUserThunk, checkIdDuplicateThunk, checkNicknameDuplicateThunk } from '../../features/authSlice'
import { useDispatch } from 'react-redux'

const Signup = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const [formData, setFormData] = useState({
      email: '',
      login_id: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      name: '',
   })

   const [errors, setErrors] = useState({})

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
   }

   const validate = () => {
      const newErrors = {}
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
         newErrors.email = '올바른 이메일 형식에 맞춰서 작성해주세요.'
      }
      if (formData.password !== formData.confirmPassword) {
         newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
      }
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const checkDuplicateId = () => {
      if (!formData.login_id) return

      dispatch(checkIdDuplicateThunk(formData.login_id))
         .unwrap()
         .then((response) => {
            setErrors((prev) => ({
               ...prev,
               login_id: response.success ? '' : '중복된 아이디입니다.',
            }))
         })
         .catch(() => {
            setErrors((prev) => ({ ...prev, login_id: '아이디 중복 확인 실패' }))
         })
   }

   const checkDuplicateNickname = () => {
      if (!formData.nickname) return

      dispatch(checkNicknameDuplicateThunk(formData.nickname))
         .unwrap()
         .then((response) => {
            setErrors((prev) => ({
               ...prev,
               nickname: response.success ? '' : '중복된 닉네임입니다.',
            }))
         })
         .catch(() => {
            setErrors((prev) => ({ ...prev, nickname: '닉네임 중복 확인 실패' }))
         })
   }

   const handleSubmit = (e) => {
      e.preventDefault()
      if (!validate() || errors.login_id || errors.nickname) return

      dispatch(signupUserThunk(formData))
         .unwrap()
         .then(() => {
            alert('회원가입에 성공하였습니다. 프로필을 입력해주세요.')
            navigate('/profile-setup')
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
                     <StyledTextField label="닉네임" name="nickname" value={formData.nickname} onChange={handleChange} error={!!errors.nickname} helperText={errors.nickname || ''} />
                     <CheckButton onClick={checkDuplicateNickname}>중복 확인</CheckButton>
                  </InputRow>
                  <InputRow>
                     <StyledTextField label="아이디" name="login_id" value={formData.login_id} onChange={handleChange} error={!!errors.login_id} helperText={errors.login_id || ''} />
                     <CheckButton onClick={checkDuplicateId}>중복 확인</CheckButton>
                  </InputRow>
                  <StyledTextField label="이메일" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email || ''} autoComplete="email" />
                  <StyledTextField label="비밀번호" name="password" type="password" value={formData.password} onChange={handleChange} helperText="비밀번호는 최소 8자 이상, 영문/숫자/특수문자를 포함해야 합니다." autoComplete="new-password" />
                  <StyledTextField label="비밀번호 확인" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword || ''} autoComplete="new-password" />
               </InputWrapper>
               <StyledButton type="submit">회원가입</StyledButton>
            </form>

            <StyledDividerText>
               <Line /> SNS 로그인 <Line />
            </StyledDividerText>
            <SNSWrapper>
               <KakaoButton>
                  <RiKakaoTalkFill style={{ fontSize: '32px', transform: 'translateX(-600%)' }} />
                  카카오 로그인
               </KakaoButton>
               <SNSLogin>
                  <FcGoogle style={{ fontSize: '32px', transform: 'translateX(-620%)' }} />
                  구글 로그인
               </SNSLogin>
            </SNSWrapper>
         </FormContainer>
      </Wrapper>
   )
}

export default Signup

// Styled Components
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
   align-items: flex-start; /* 이 부분이 버튼과 입력창의 Y좌표를 맞추는 역할을 합니다 */
   gap: 10px;
`

const StyledTextField = styled(TextField)`
   flex-grow: 1;
   &.MuiTextField-root {
      margin-bottom: 20px;
   }
`

const CheckButton = styled(Button)`
   height: 56px; /* TextField와 동일한 높이로 설정 */
   min-width: 150px; /* 버튼 너비 설정 */
   background-color: #ffa654 !important;
   color: white !important;
   font-size: 14px;
   border-radius: 4px !important;
   display: flex;
   align-items: center;
   justify-content: center;
   margin-bottom: 0; /* 간격을 없애기 위해 margin-bottom을 0으로 설정 */
   font-weight: 200 !important;
`

const StyledButton = styled(Button)`
   width: 100%;
   background-color: #ff7a00 !important;
   height: 50px;
   color: white !important;
   font-size: 16px;
   padding: 10px;
   border-radius: 10px !important;
   margin-top: 30px;
`

const SNSWrapper = styled.div`
   display: flex;
   flex-direction: column;
   gap: 10px;
   margin-top: 20px;
   margin-bottom: 170px;
`

const StyledDividerText = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   width: 100%;
   max-width: 650px;
   margin: 40px 0 0px;
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

const SNSLogin = styled(Button)`
   width: 100%;
   border: 1px solid #ddd !important;
   border-radius: 50px !important;
   color: #000 !important;
   background: white !important;
   font-weight: bold;
`

const KakaoButton = styled(Button)`
   width: 100%;
   background-color: #fee500 !important;
   color: black !important;
   font-weight: bold;
   border-radius: 50px !important;
`
