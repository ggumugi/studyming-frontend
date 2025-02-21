import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { pointsForItemThunk, fetchUserPoints } from '../../features/pointSlice'
import { useNavigate } from 'react-router-dom'

const ItemList = ({ items, isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const userPoints = useSelector((state) => state.points.points)
   const userRole = useSelector((state) => state.auth.user?.role)

   const handlePurchase = (item) => {
      if (item.type === 'cash') {
         alert('포인트 충전은 결제 페이지에서 진행해주세요!')
         return
      }

      if (userPoints < item.price) {
         alert('포인트가 부족합니다!')
         return
      }

      // ✅ 구매 확인창 추가
      const isConfirmed = window.confirm(`${item.name}을(를) ${item.price}밍으로 구매하시겠습니까?`)
      if (!isConfirmed) return

      dispatch(pointsForItemThunk(item.id)) // ✅ useDispatch()로 실행
         .then(() => {
            dispatch(fetchUserPoints()) // ✅ 포인트 정보 갱신
         })
   }
   return (
      <Container>
         <Grid>
            {items.length > 0 ? ( // ✅ 데이터가 있을 때만 출력
               items.map((item) => (
                  <ItemCard key={item.id}>
                     <ImageWrapper>
                        {item.type !== 'cash' && <Tag>7일</Tag>}
                        <Image
                           src={item.img ? `http://localhost:8000${item.img}` : '/img/default.png'} // ✅ 기본 이미지 추가
                           alt={item.title}
                        />
                     </ImageWrapper>
                     <ItemTitle>{item.title}</ItemTitle>
                     <ItemDescription>{item.detail}</ItemDescription>
                     <PriceContainer>
                        <ItemPrice>
                           {item.price} {item.type === 'cash' ? '원' : '밍'}
                        </ItemPrice>
                        {isAuthenticated && user?.role === 'ADMIN' && (
                           <EditButton
                              variant="contained"
                              color="primary"
                              onClick={() => navigate(`/mingshop/edit/${item.id}`, { state: { user } })} // ✅ user 정보 함께 전달
                              sx={{ marginLeft: '10px' }}
                           >
                              수정
                           </EditButton>
                        )}
                        <BuyButton onClick={() => handlePurchase(item)}>구매하기</BuyButton>
                     </PriceContainer>
                  </ItemCard>
               ))
            ) : (
               <p>상품이 없습니다.</p> // ✅ 데이터가 없을 때 메시지 표시
            )}
         </Grid>
      </Container>
   )
}

export default ItemList

// Styled Components
const Container = styled.div`
   width: 100%;
   max-width: 1200px;
   margin-bottom: 50px;
`

const Grid = styled.div`
   display: grid;
   grid-template-columns: repeat(4, 1fr);
   gap: 20px;
   width: 100%;
`

const ItemCard = styled.div`
   background-color: #fff;
   border-radius: 8px;
   padding: 20px;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   height: 350px; /* 고정된 높이 */
   max-width: 325px;
   text-align: left;
   overflow: hidden;
`

const ImageWrapper = styled.div`
   position: relative; /* 부모 요소를 relative로 설정 */
   width: 100%;
   max-width: 280px;
   height: 200px;
   margin-bottom: 10px;
   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
   border-radius: 16px;
   overflow: hidden;
   flex-shrink: 0;
`
const Tag = styled.div`
   position: absolute;
   top: 8px;
   right: 8px;
   background-color: #ffc187;
   color: black; /* 가독성을 위해 흰색 */
   font-size: 12px;
   padding: 5px 12px;
   border-radius: 15px;
`

const Image = styled.img`
   width: 100%;
   height: 100%;
   object-fit: contain;
   transform: scale(0.6);
`

const ItemTitle = styled.p`
   font-size: 18px;
   padding: 3px 3px 0px 10px;
   margin-bottom: 2px; /* 제목과 설명 간격 좁힘 */
`

const ItemDescription = styled.p`
   font-size: 14px;
   color: #999;
   padding: 0px 3px 3px 10px;
   margin-bottom: 2px; /* 설명과 가격 간격 좁힘 */
`

const PriceContainer = styled.div`
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding-left: 10px;
   padding-right: 10px;
`

const ItemPrice = styled.p`
   font-size: 20px;
   font-weight: bold;
`

const BuyButton = styled.button`
   font-size: 12px;
   padding: 5px 15px;
   background-color: #ff7a00;
   color: white;
   border: none;
   border-radius: 15px;
   cursor: pointer;
   font-weight: bold;
   height: 30px; /* 가격 크기에 맞춤 */
`
const EditButton = styled(BuyButton)`
   font-size: 12px;
   padding: 5px 15px;

   color: white;
   border: none;
   border-radius: 15px;
   cursor: pointer;
   font-weight: bold;
   height: 30px; /* 가격 크기에 맞춤 */
   background-color: #3498db;
   &:hover {
      background-color: #2980b9;
   }
`
