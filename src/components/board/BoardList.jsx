import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Button, Pagination } from '@mui/material'
import { fetchPostsThunk } from '../../features/postSlice'

// 🔹 백엔드 enum 값을 프론트 한글명으로 변환
const reverseCategoryMap = {
   free: '자유',
   QnA: '질문',
   noti: '정보',
   inquiry: '문의',
}

const BoardList = ({ category }) => {
   const dispatch = useDispatch()
   const posts = useSelector((state) => state.posts.posts)
   const pagination = useSelector((state) => state.posts.pagination)
   const loading = useSelector((state) => state.posts.loading)
   const navigate = useNavigate()

   const [page, setPage] = useState(1)
   const [rowsPerPage] = useState(10)
   const [searchType, setSearchType] = useState('title')
   const [searchKeyword, setSearchKeyword] = useState('')

   useEffect(() => {
      dispatch(fetchPostsThunk({ page, category, limit: rowsPerPage, searchType, searchKeyword }))
   }, [dispatch, page, category, rowsPerPage, searchType, searchKeyword])

   const handleChangePage = (event, newPage) => {
      setPage(newPage)
   }

   const handleSearch = () => {
      dispatch(fetchPostsThunk({ page: 1, category, limit: rowsPerPage, searchType, searchKeyword }))
   }

   return (
      <Container>
         {/* ✅ 게시판 제목 + 글쓰기 버튼 */}
         <Header>
            <Title>{reverseCategoryMap[category]} 게시판</Title> {/* ✅ 한글 변환하여 표시 */}
            <WriteButton onClick={() => navigate(`/board/${category}/create`)}>글쓰기</WriteButton> {/* ✅ 선택된 카테고리에 맞게 이동 */}
         </Header>

         {loading ? (
            <LoadingText>로딩 중...</LoadingText>
         ) : (
            <>
               <StyledTableContainer component={Paper}>
                  <StyledTable>
                     <TableHead>
                        <StyledTableRow>
                           <StyledTableHeaderCell width="10%">NO</StyledTableHeaderCell>
                           <StyledTableHeaderCell width="60%">제목</StyledTableHeaderCell>
                           <StyledTableHeaderCell width="15%">작성자</StyledTableHeaderCell>
                           <StyledTableHeaderCell width="15%">작성일</StyledTableHeaderCell>
                        </StyledTableRow>
                     </TableHead>
                     <TableBody>
                        {posts.map((post) => (
                           <StyledTableRow key={post.id} onClick={() => navigate(`/board/${category}/detail/${post.id}`)} style={{ cursor: 'pointer' }}>
                              {/* ✅ 카테고리를 포함한 URL로 이동 */}
                              <StyledTableCell>{post.id}</StyledTableCell>
                              <StyledTableCell>{post.title}</StyledTableCell>
                              <StyledTableCell>{post?.User?.nickname}</StyledTableCell>
                              <StyledTableCell>{new Date(post.createdAt).toLocaleDateString()}</StyledTableCell>
                           </StyledTableRow>
                        ))}
                     </TableBody>
                  </StyledTable>
               </StyledTableContainer>

               {/* 페이지네이션 */}
               {pagination && (
                  <PaginationContainer>
                     <Pagination count={Math.ceil(pagination.totalPosts / rowsPerPage)} page={pagination.currentPage} onChange={handleChangePage} color="warning" shape="rounded" />
                  </PaginationContainer>
               )}

               {/* 검색 필터 */}
               <SearchContainer>
                  <StyledSelect value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                     <MenuItem value="title">제목</MenuItem>
                     <MenuItem value="author">작성자</MenuItem>
                  </StyledSelect>

                  <StyledInput value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="검색어 입력" />

                  <SearchButton onClick={handleSearch}>검색</SearchButton>
               </SearchContainer>
            </>
         )}
      </Container>
   )
}

export default BoardList

//
// Styled Components (MUI 스타일 100% 동일하게 변환)
//
const Container = styled.div`
   width: 100%;
   padding: 70px 70px 0 70px;
`

const Header = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding-bottom: 10px;
   border-bottom: 2px solid #ff7a00;
   margin-bottom: 20px;
`

const Title = styled.h2`
   font-weight: 300;
   font-size: 32px;
`

const WriteButton = styled.button`
   background-color: #ff5733;
   color: white;
   padding: 10px 20px;
   border-radius: 20px;
   border: none;
   cursor: pointer;
   font-size: 14px;
   font-weight: bold;
   transition: background-color 0.3s;

   &:hover {
      background-color: #e74c3c;
   }
`

const LoadingText = styled.p`
   text-align: center;
   font-size: 18px;
   color: #666;
`

const StyledTableContainer = styled(TableContainer)`
   max-width: 100%;
   margin: auto;
`

const StyledTable = styled(Table)``

const StyledTableRow = styled(TableRow)`
   &:hover {
      background-color: #f9f9f9;
   }
`

const StyledTableHeaderCell = styled(TableCell)`
   font-weight: bold;
   text-align: center;
   background-color: #f5f5f5;
`

const StyledTableCell = styled(TableCell)`
   text-align: center;
`

const PaginationContainer = styled.div`
   display: flex;
   justify-content: center;
   margin-top: 20px;
`

const SearchContainer = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   margin-top: 20px;
`

const StyledSelect = styled(Select)`
   width: 120px;
   height: 45px;
   border-radius: 5px;
   background-color: white;
`

const StyledInput = styled.input`
   max-width: 700px;
   width: 100%;
   height: 45px;
   padding: 0 10px;
   margin-left: 10px;
   border: 1px solid #ccc;
   border-radius: 5px;
`

const SearchButton = styled(Button)`
   margin-left: 10px;
   height: 45px;
   background-color: #ff7a00;
   color: white;
   font-weight: bold;
   padding: 10px 20px;
   border-radius: 5px;
   transition: background-color 0.3s;

   &:hover {
      background-color: #e66a00;
   }
`
