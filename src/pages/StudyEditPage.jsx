import { Container } from '@mui/material'
import StudyCreate from '../components/Study/StudyCreate' // StudyCreate 컴포넌트 import
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom' // useNavigate, useParams import
import { fetchStudygroupByIdThunk, updateStudygroupThunk } from '../features/studygroupSlice'

const StudyEditPage = ({ isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams() // URL에서 스터디 그룹 ID 추출

   // useSelector로 스터디 그룹 데이터 가져오기
   const { studygroup } = useSelector((state) => state.studygroups)

   // 스터디 그룹 데이터 불러오기
   useEffect(() => {
      dispatch(fetchStudygroupByIdThunk(id))
         .unwrap()
         .then((data) => {
            console.log('Fetched studygroup:', data)
         })
         .catch((err) => {
            console.error('스터디 그룹 불러오기 실패: ', err)
            alert('스터디 그룹을 불러올 수 없습니다.')
         })
   }, [dispatch, id])

   const handleSubmit = useCallback(
      (studygroupData) => {
         dispatch(updateStudygroupThunk({ id, updateData: studygroupData }))
            .unwrap()
            .then((studygroup) => {
               navigate(`/study/detail/${studygroup.studygroup.id}`) // 수정 후 상세 페이지로 이동
            })
            .catch((err) => {
               console.error('스터디 그룹 수정 실패: ', err)
               alert('스터디 그룹을 수정할 수 없습니다.')
            })
      },
      [dispatch, navigate, id]
   )

   return <Container maxWidth="lg">{studygroup && <StudyCreate onSubmit={handleSubmit} isAuthenticated={isAuthenticated} user={user} initialValues={studygroup} />}</Container>
}

export default StudyEditPage
