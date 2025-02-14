import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FaCrown } from 'react-icons/fa'

// Mock 데이터
const teamMembers = [
   { id: 1, name: '닉네임1', isLeader: true, isOnline: true },
   { id: 2, name: '닉네임2', isLeader: false, isOnline: false },
   { id: 3, name: '닉네임3', isLeader: false, isOnline: true },
   { id: 4, name: '닉네임44', isLeader: false, isOnline: true },
   { id: 5, name: '닉네임길어도', isLeader: false, isOnline: false },
   { id: 6, name: '닉네임길어도', isLeader: false, isOnline: false },
]

const TeamList = () => {
   const [isFixed, setIsFixed] = useState(true)
   const [position, setPosition] = useState({ top: 0, bottom: 0 })

   useEffect(() => {
      const teamList = document.getElementById('team-list')
      const footer = document.getElementById('footer')

      const observer = new IntersectionObserver(
         ([entry]) => {
            if (entry.isIntersecting) {
               setIsFixed(false)
               const footerRect = footer.getBoundingClientRect()
               const offsetTop = window.scrollY + footerRect.top - teamList.offsetHeight
               setPosition({ top: offsetTop, bottom: 'auto' })
            } else {
               setIsFixed(true)
               setPosition({ top: 'auto', bottom: 0 })
            }
         },
         { rootMargin: '0px', threshold: 0 }
      )

      if (footer) {
         observer.observe(footer)
      }

      return () => {
         if (footer) {
            observer.unobserve(footer)
         }
      }
   }, [])

   return (
      <TeamListWrapper $isFixed={isFixed} $position={position} id="team-list">
         <TitleWrapper>
            <Title>스터디원 목록</Title>
         </TitleWrapper>
         <TeamMembers>
            {teamMembers.map((member) => (
               <Member key={member.id}>
                  <MemberGrid>
                     <CrownWrapper>{member.isLeader && <FaCrown />}</CrownWrapper>
                     <ProfileWrapper>
                        <ProfileIcon src={member.isOnline ? '/img/happyMing.png' : '/img/cryingMing.png'} />
                     </ProfileWrapper>
                     <MemberName $isOnline={member.isOnline}>{member.name}</MemberName>
                  </MemberGrid>
               </Member>
            ))}
         </TeamMembers>
      </TeamListWrapper>
   )
}

export default TeamList

// Styled Components
const TeamListWrapper = styled.div`
   margin-top: auto;
   width: 100%;
   max-width: 250px;
   padding: 0;
   position: ${(props) => (props.$isFixed ? 'fixed' : 'absolute')};
   top: ${(props) => (props.$isFixed ? 'auto' : `${props.$position.top}px`)};
   bottom: ${(props) => (props.$isFixed ? '0' : 'auto')};
   transition: top 0.3s ease, bottom 0.3s ease;
`

const TitleWrapper = styled.div`
   background-color: #fcf4eb;
   width: calc(100% + 20px);
   max-width: 250px;
   margin-left: -20px;
   padding: 20px 10px;
   box-sizing: border-box;
   border-right: 1px solid #ddd;
`

const Title = styled.h3`
   font-size: 20px;
   font-weight: 300;
   text-align: right;
   margin: 0;
`

const TeamMembers = styled.ul``

const Member = styled.li`
   display: flex;
   align-items: center;
   padding: 15px 0;
   font-size: 20px;
   font-weight: 300;
`

const MemberGrid = styled.div`
   display: grid;
   grid-template-columns: 30px 40px auto;
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
   color: ${(props) => (props.$isOnline ? '#FF7A00' : '#333')};
   text-align: left;
`
