import { Container } from '@mui/material'
import StudyCreate from '../components/Study/StudyCreate' // StudyCreate 컴포넌트 import
import { useDispatch } from 'react-redux'
import { createStudygroupThunk } from '../features/studygroupSlice' // thunk import
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom' // useNavigate import

const StudyCreatePage = ({ isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate() // useNavigate 훅 사용

   const handleSubmit = useCallback(
      (studygroupData) => {
         // studygroupData - 사용자가 입력한 스터디 그룹 데이터
         dispatch(createStudygroupThunk(studygroupData))
            .unwrap()
            .then((studygroup) => {
               navigate(`/studygroup/detail/${studygroup.id}`) // 생성된 스터디 그룹의 상세 페이지로 이동
            })
            .catch((err) => {
               console.error('스터디 그룹 등록 실패 : ', err)
               alert('스터디 그룹을 등록할 수 없습니다.')
            })
      },
      [dispatch, navigate] // navigate 추가
   )

   return (
      <Container maxWidth="lg">
         <StudyCreate onSubmit={handleSubmit} isAuthenticated={isAuthenticated} user={user} /> {/* StudyCreate 컴포넌트에 onSubmit 프로퍼티 전달 */}
      </Container>
   )
}

export default StudyCreatePage
