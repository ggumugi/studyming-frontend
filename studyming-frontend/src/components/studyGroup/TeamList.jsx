import React from 'react'
import styled from 'styled-components'
import { FaCrown } from 'react-icons/fa'

// Mock 데이터 (임시 데이터)
const teamMembers = [
   { id: 1, name: '닉네임1', isLeader: true, isOnline: true },
   { id: 2, name: '닉네임2', isLeader: false, isOnline: false },
   { id: 3, name: '닉네임3', isLeader: false, isOnline: true },
   { id: 4, name: '닉네임44', isLeader: false, isOnline: true },
   { id: 5, name: '닉네임길어도', isLeader: false, isOnline: false },
   { id: 6, name: '닉네임길어도', isLeader: false, isOnline: false },
]

const TeamList = () => {
   return (
      <TeamListWrapper>
         <TitleWrapper>
            <Title>스터디원 목록</Title>
         </TitleWrapper>
         <TeamMembers>
            {teamMembers.map((member) => (
               <Member key={member.id}>
                  {/* 🔥 왕관, 프로필, 닉네임을 그리드로 배치 */}
                  <MemberGrid>
                     <CrownWrapper>{member.isLeader && <FaCrown />}</CrownWrapper>
                     <ProfileWrapper>
                        <ProfileIcon src={member.isOnline ? '/img/happyMing.png' : '/img/cryingMing.png'} />
                     </ProfileWrapper>
                     <MemberName isOnline={member.isOnline}>{member.name}</MemberName>
                  </MemberGrid>
               </Member>
            ))}
         </TeamMembers>
      </TeamListWrapper>
   )
}

export default TeamList

// ⭐ Styled Components
const TeamListWrapper = styled.div`
   margin-top: auto;
   width: 100%;
   padding: 0;
`

const TitleWrapper = styled.div`
   background-color: #fcf4eb;
   width: calc(100% + 40px);
   margin-left: -20px;
   margin-right: -20px;
   padding: 20px 20px;
   box-sizing: border-box;
`

const Title = styled.h3`
   font-size: 20px;
   font-weight: 300;
   text-align: right;
   margin: 0;
`

const TeamMembers = styled.ul``

const Member = styled.li`
width: 100
   display: flex;
   align-items: center;
   padding: 15px 0px;
   font-size: 20px;
   font-weight: 300;
`

/* 🔥 그리드 레이아웃 적용 */
const MemberGrid = styled.div`
   display: grid;
   grid-template-columns: 30px 40px auto; /* ✅ 왕관(30px), 프로필(40px), 닉네임(자동) */
   align-items: center;
   width: 100%;
   gap: 15px;
`

const CrownWrapper = styled.div`
   font-size: 16px;
   color: #ffa654;
   display: flex;
   align-items: center;
   justify-content: center;
`

const ProfileWrapper = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
`

const ProfileIcon = styled.img`
   height: 30px;
   object-fit: cover;
   transform: translateY(-2px);
`

const MemberName = styled.span`
   width: 100%;
   color: ${(props) => (props.isOnline ? '#FF7A00' : '#333')};
   text-align: left;
`
