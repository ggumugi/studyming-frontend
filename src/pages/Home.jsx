import { useSelector } from 'react-redux'

import styled from 'styled-components'
import MainVisual from '../components/homeItems/MainVisual' // ✅ 메인 비주얼 컴포넌트 추가
import CalendarTodo from '../components/homeItems/CalendarTodo'
import TodayTimeCard from '../components/homeItems/TodayTimeCard'
import YesterdayTimeCard from '../components/homeItems/YesterdayTimeCard'
import TotalTimeCard from '../components/homeItems/TotalTimeCard'
import WeeklyCalendar from '../components/homeItems/WeeklyCalendar'
import RealTimeAccess from '../components/homeItems/RealTimeAccess'
import DdayLine from '../components/homeItems/Dday' // ✅ D-day 추가
import Mindset from '../components/homeItems/Mindset' // ✅ 다짐 추가

const Home = () => {
   const user = useSelector((state) => state.auth.user) // Redux에서 user 가져오기
   console.log('📌 부모 컴포넌트의 userId:', user?.id)

   return (
      <HomeContainer>
         {/* ✅ 메인 비주얼 (캐러셀) */}
         <MainVisualWrapper>
            <MainVisual />
         </MainVisualWrapper>

         {/* 공부 시간 카드 3개 배치 */}
         <StudyTimeWrapper>
            <TodayTimeCard userId={user?.id} title="오늘 공부 시간" />
         </StudyTimeWrapper>
         <StudyTimeWrapper>
            <YesterdayTimeCard userId={user?.id} title="어제 공부 시간" />
         </StudyTimeWrapper>
         <StudyTimeWrapper>
            <TotalTimeCard userId={user?.id} title="총 공부시간" />
         </StudyTimeWrapper>

         {/* 다짐 & D-day (새로운 배치) */}
         <MindsetWrapper>
            <Mindset />
         </MindsetWrapper>
         <DdayWrapper>
            <DdayLine />
         </DdayWrapper>

         {/* 목표 영역 */}
         <CalendarTodoWrapper>
            <CalendarTodo title="오늘 목표" />
         </CalendarTodoWrapper>

         <WeeklyCalendarWrapper>
            <WeeklyCalendar title="이번주 목표" />
         </WeeklyCalendarWrapper>

         {/* 실시간 접속 현황 */}
         <RealTimeAccessWrapper>
            <RealTimeAccess />
         </RealTimeAccessWrapper>
      </HomeContainer>
   )
}

export default Home

/* 🎨 Styled Components */
const HomeContainer = styled.div`
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   gap: 16px;
   padding: 16px;
`

const MainVisualWrapper = styled.div`
   grid-column: span 3; /* 전체 3칸을 차지하도록 설정 */
   display: flex;
   justify-content: center; /* 내부 요소 중앙 정렬 */
   margin-top: 30px;
   margin-bottom: 50px;
`

const StudyTimeWrapper = styled.div`
   grid-column: span 1;
`

/* ✅ 다짐 (Mindset)과 D-day 배치 조정 */
const MindsetWrapper = styled.div`
   margin-top: 50px;
   grid-column: span 2; /* 다짐은 공부 시간 2칸과 같은 너비 */
`

const DdayWrapper = styled.div`
   margin-top: 50px;
   grid-column: span 1; /* D-day는 한 칸 */
`

const CalendarTodoWrapper = styled.div`
   grid-column: span 1;
   margin-top: 50px;
`

const WeeklyCalendarWrapper = styled.div`
   grid-column: span 2;
   margin-top: 50px;
`

const RealTimeAccessWrapper = styled.div`
   grid-column: span 3;
   margin-top: 30px;
   margin-bottom: 50px;
`
