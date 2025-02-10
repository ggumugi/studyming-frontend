import styled from 'styled-components'
import MainVisual from '../components/homeItems/MainVisual' // ✅ 메인 비주얼 컴포넌트 추가
import CalendarTodo from '../components/homeItems/CalendarTodo'
import TodayTimeCard from '../components/homeItems/TodayTimeCard'
import YesterdayTimeCard from '../components/homeItems/YesterdayTimeCard'
import TotalTimeCard from '../components/homeItems/TotalTimeCard'
import WeeklyCalendar from '../components/homeItems/WeeklyCalendar'
import RealTimeAccess from '../components/homeItems/RealTimeAccess'

const Home = () => {
   return (
      <HomeContainer>
         {/* ✅ 메인 비주얼 (캐러셀) */}
         <MainVisual />

         {/* 공부 시간 카드 3개 배치 */}
         <StudyTimeWrapper>
            <TodayTimeCard title="오늘 공부시간" />
         </StudyTimeWrapper>
         <StudyTimeWrapper>
            <YesterdayTimeCard title="어제 공부 시간" />
         </StudyTimeWrapper>
         <StudyTimeWrapper>
            <TotalTimeCard title="총 공부시간" />
         </StudyTimeWrapper>

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

const StudyTimeWrapper = styled.div`
   grid-column: span 1;
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
   margin-bottom: 40px;
`
