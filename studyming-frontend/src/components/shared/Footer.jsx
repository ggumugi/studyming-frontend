import React from 'react'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom' // ✅ React Router의 Link 별도 선언

const Footer = () => {
   return (
      <FooterContainer>
         <FooterContent>
            <FooterLink to="/about">소개 페이지</FooterLink> {/* ✅ Link 수정 */}
            <FooterText>
               Lorem ipsum dolor sit amet consectetur. In volutpat amet lectus ultricies leo lectus arcu.
               <br />
               Tellus viverra vitae tempor ullamcorper. Faucibus rutrum sed etiam donec nulls.
               <br />
               Ullam ultrices a lorem sollicitudin.
               <br />
               crussock@email.com
               <br />
               Copyright 2024, @Studyming. All rights reserved.
               <br />
               <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer">
                  출처: Freepik
               </a>
            </FooterText>
         </FooterContent>
      </FooterContainer>
   )
}

export default Footer

// ⭐ Styled Components
const FooterContainer = styled.footer`
   width: 100%;
   height: 225px;
   background-color: #ffa654;
   padding: 15px 0 20px 0;
   display: flex;
   justify-content: center;
`

const FooterContent = styled.div`
   width: 90%;
   text-align: left;
   color: white;
   font-size: 14px;
   line-height: 1.6;
`

// ✅ React Router의 Link를 사용하려면, 다른 변수명으로 선언해야 함
const FooterLink = styled(RouterLink)`
   font-size: 14px;
   font-weight: 500;
   color: white;
   text-decoration: underline;
   &:hover {
      opacity: 80%;
   }
`

const FooterText = styled.p`
   margin-top: 35px;
   font-size: 14px;
   color: white;

   a {
      color: white;
      text-decoration: none;
      color: lightgray;
   }
`
