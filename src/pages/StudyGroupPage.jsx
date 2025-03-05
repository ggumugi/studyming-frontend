// pages/StudyGroupPage.jsx
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import StudyRoomLayout from '../components/studyGroup/StudyRoomLayout'
import Chat from '../components/studyGroup/Chat'
import ScreenShare from '../components/studyGroup/ScreenShare'

const StudyGroupPage = ({ isAuthenticated }) => {
   const [activeTab, setActiveTab] = useState('chat') // 기본 탭은 채팅
   const { studygroup } = useSelector((state) => state.studygroups)
   const { groupmembers } = useSelector((state) => state.groupmembers.groupmember)
   const user = useSelector((state) => state.auth.user)

   return (
      <StudyRoomLayout activeTab={activeTab} setActiveTab={setActiveTab}>
         {activeTab === 'chat' && <Chat studygroup={studygroup} groupmembers={groupmembers} user={user} />}
         {activeTab === 'video' && <ScreenShare studygroup={studygroup} groupmembers={groupmembers} />}
      </StudyRoomLayout>
   )
}

export default StudyGroupPage
