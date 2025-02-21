import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyItems } from '../../features/itemSlice'
import styled from 'styled-components'

const MyItem = () => {
   const dispatch = useDispatch()
   const myItems = useSelector((state) => state.items.myItems)
   const loading = useSelector((state) => state.items.loading)
   const error = useSelector((state) => state.items.error)

   useEffect(() => {
      dispatch(fetchMyItems())
   }, [dispatch])

   return (
      <Container>
         {loading && <p>로딩 중...</p>}
         {error && <p>에러 발생: {error}</p>}
         <ItemGrid>
            {myItems.length > 0 ? (
               myItems.map((item) => (
                  <ItemCard key={item.id}>
                     <ImageWrapper>
                        <ItemImage src={item.img} alt={item.title} /> {/* 이미지 경로는 직접 입력 */}
                     </ImageWrapper>
                     <ItemTitle>{item.title}</ItemTitle>
                     <ItemDescription>{item.description}</ItemDescription>
                     <ItemDate>{item.limit}일 남음</ItemDate>
                  </ItemCard>
               ))
            ) : (
               <p>보유한 아이템이 없습니다.</p>
            )}
         </ItemGrid>
      </Container>
   )
}

export default MyItem

// Styled Components
const Container = styled.div`
   padding: 50px;
`

const ItemGrid = styled.div`
   display: grid;
   grid-template-columns: repeat(4, 1fr); /* 한 줄에 네 개씩 */
   gap: 20px;
`

const ItemCard = styled.div`
   background-color: #fff; /* 흰색 배경 */
   border-radius: 8px;
   padding: 20px;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   height: 300px; /* 아이템 카드 고정 높이 설정 */
   max-width: 325px;
   text-align: left; /* 모든 텍스트 왼쪽 정렬 */
`

const ImageWrapper = styled.div`
   width: 100%;
   max-width: 280px;
   height: 200px; /* 고정된 이미지 높이 */
   margin-bottom: 10px;
   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
   border-radius: 16px; /* 부드러운 곡선 */
   overflow: hidden;
`

const ItemImage = styled.img`
   width: 100%;
   height: 100%;
   object-fit: contain; /* 이미지를 잘라서 박스에 맞게 크기 조정 */
   transform: scale(0.6);
`

const ItemTitle = styled.h3`
   font-size: 18px;
   margin-bottom: 5px;
   padding-left: 10px; /* 텍스트 오른쪽으로 이동 */
`

const ItemDescription = styled.p`
   font-size: 14px;
   color: #999;
   margin-bottom: 5px;
   padding-left: 10px; /* 텍스트 오른쪽으로 이동 */
`

const ItemDate = styled.p`
   font-size: 12px;
   color: #999;
   padding-left: 10px; /* 텍스트 오른쪽으로 이동 */
`
