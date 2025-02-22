import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const StudyEdit = ({ onSubmit, isAuthenticated, user, studygroup }) => {
   // 기존 스터디 그룹 데이터로 초기화
   const [name, setName] = useState(studygroup.name || '')
   const [description, setDescription] = useState(studygroup.description || '')
   const [startDate, setStartDate] = useState(studygroup.startDate || '')
   const [endDate, setEndDate] = useState(studygroup.endDate || '')
   const [startTime, setStartTime] = useState(studygroup.startTime || '')
   const [endTime, setEndTime] = useState(studygroup.endTime || '')
   const [password, setPassword] = useState(studygroup.password || '')
   const [timegoal, setTimegoal] = useState(studygroup.timeGoal || '')
   const [capInterval, setCapInterval] = useState(studygroup.capInterval || '')
   const [dayZone, setDayZone] = useState(!!studygroup.startDate) // 기간 적용 여부
   const [timezone, setTimezone] = useState(!!studygroup.startTime) // 접속 시간대 적용 여부
   const [maxMembers, setMaxMembers] = useState(studygroup.maxMembers || 6)
   const [reward, setReward] = useState(studygroup.reward || false)
   const [open, setOpen] = useState(studygroup.open || true)
   const [errorMsg, setErrorMsg] = useState(null)
   const [capOnOff, setCapOnOff] = useState(!!studygroup.capInterval) // 보안 문자 간격 적용 여부
   const [goalOnOff, setGoalOnOff] = useState(!!studygroup.timeGoal) // 목표시간 적용 여부

   // 해시태그 관련 상태
   const [inputValue, setInputValue] = useState('#')
   const [hashtags, setHashtags] = useState(studygroup.hashtags || [])
   const [hashtagsError, setHashtagsError] = useState(null)

   useEffect(() => {
      // 해시태그 초기화
      if (studygroup.hashtags) {
         setInputValue('#' + studygroup.hashtags.join(' #'))
      }
   }, [studygroup.hashtags])

   const handleSubmit = (e) => {
      e.preventDefault()

      if (!user) {
         alert('로그인이 필요합니다.')
         return
      }

      const groupData = {
         name,
         description,
         startDate: dayZone ? startDate : null,
         endDate: dayZone ? endDate : null,
         startTime: timezone ? startTime : null,
         endTime: timezone ? endTime : null,
         maxMembers,
         reward,
         open,
         password: open ? '' : password,
         timeGoal: goalOnOff ? timegoal : 0,
         capInterval: capOnOff ? capInterval : null,
         hashtags,
      }

      onSubmit(groupData)
   }

   // 나머지 로직은 StudyCreate와 동일
   return (
      <Wrapper>
         <TitleContainer>
            <Title>스터디 수정</Title>
            <StyledDivider />
         </TitleContainer>

         <Form onSubmit={handleSubmit}>
            {/* StudyCreate와 동일한 폼 구조 */}
            {/* 각 입력 필드의 value와 onChange를 기존 데이터로 설정 */}
         </Form>
      </Wrapper>
   )
}

export default StudyEdit
