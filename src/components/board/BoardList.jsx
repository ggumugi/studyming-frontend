import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Button, Pagination, InputBase, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { fetchPostsThunk } from '../../features/postSlice'

const reverseCategoryMap = {
   free: '자유',
   QnA: '질문',
   noti: '정보',
   inquiry: '문의',
}

const BoardList = ({ category }) => {
   const rowsPerPage = 10 // ✅ 백엔드 limit 기본값과 일치시킴
   const dispatch = useDispatch()
   const posts = useSelector((state) => state.posts.posts)
   const pagination = useSelector((state) => state.posts.pagination)
   const loading = useSelector((state) => state.posts.loading)
   const navigate = useNavigate()
   const currentPage = pagination?.currentPage || 1 // ✅ Redux에서 현재 페이지 가져오기

   const [page, setPage] = useState(1)
   const [searchType, setSearchType] = useState('title')
   const [searchKeyword, setSearchKeyword] = useState('')

   useEffect(() => {
      console.log('페이지 변경 또는 검색 조건 변경:', { page, category, searchType, searchKeyword })
      dispatch(fetchPostsThunk({ page, category, limit: rowsPerPage, searchType, searchKeyword }))
   }, [dispatch, category, rowsPerPage, searchType, searchKeyword])

   const handleChangePage = (event, newPage) => {
      dispatch(
         fetchPostsThunk({
            page: newPage, // ✅ newPage 직접 사용
            category,
            limit: rowsPerPage,
            searchType,
            searchKeyword,
         })
      )
   }

   // 검색 버튼 핸들러
   const handleSearch = () => {
      // ✅ 검색 시 페이지를 1로 설정
      dispatch(
         fetchPostsThunk({
            page: 1,
            category,
            limit: rowsPerPage,
            searchType,
            searchKeyword,
         })
      )
   }

   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         e.preventDefault()
         handleSearch()
      }
   }

   // const handleWriteClick = () => {
   //    navigate('/board/create')
   //    window.location.reload()
   // }

   return (
      <Container>
         <Header>
            <Title>{reverseCategoryMap[category]} 게시판</Title>
            <WriteButton onClick={() => navigate(`/board/create`)}>글쓰기</WriteButton>
         </Header>

         <SearchContainer>
            <StyledSelect value={searchType} onChange={(e) => setSearchType(e.target.value)}>
               <MenuItem value="title">제목</MenuItem>
               <MenuItem value="author">작성자</MenuItem>
            </StyledSelect>

            <StyledInputBase value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} onKeyDown={handleKeyDown} placeholder="검색어 입력" />
            <IconButton onClick={handleSearch}>
               <SearchIcon />
            </IconButton>
         </SearchContainer>

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
                           <StyledTableRow key={post.id} onClick={() => navigate(`/board/detail/${post.id}`)} style={{ cursor: 'pointer' }}>
                              <StyledTableCell>{post.id}</StyledTableCell>
                              <StyledTableCell>{post.title}</StyledTableCell>
                              <StyledTableCell>{post?.User?.nickname}</StyledTableCell>
                              <StyledTableCell>{new Date(post.createdAt).toLocaleDateString()}</StyledTableCell>
                           </StyledTableRow>
                        ))}
                     </TableBody>
                  </StyledTable>
               </StyledTableContainer>

               {pagination && (
                  <PaginationContainer>
                     <Pagination
                        count={Math.ceil(pagination.totalPosts / rowsPerPage)}
                        page={currentPage} // ✅ Redux의 현재 페이지 사용
                        onChange={handleChangePage}
                        color="warning"
                        shape="rounded"
                     />
                  </PaginationContainer>
               )}
            </>
         )}
      </Container>
   )
}

export default BoardList

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

const StyledInputBase = styled(InputBase)`
   flex: 1;
   max-width: 700px;
   width: 100%;
   height: 45px;
   padding: 0 10px;
   margin-left: 10px;
   border: 1px solid #ccc;
   border-radius: 5px;
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
