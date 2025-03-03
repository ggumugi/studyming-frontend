import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Button, Pagination } from '@mui/material'
import { fetchPostsThunk } from '../../features/postSlice'
import Report from '../shared/Report' // 벤실험 코드
import { submitReport } from '../../features/bannedSlice'
const BoardList = ({ category }) => {
   const dispatch = useDispatch()
   const selectedCategory = useSelector((state) => state.posts.category)
   const posts = useSelector((state) => state.posts.posts)
   const user = useSelector((state) => state.auth.user)
   const pagination = useSelector((state) => state.posts.pagination)
   const loading = useSelector((state) => state.posts.loading)
   const navigate = useNavigate() // :흰색_확인_표시: 추가 (페이지 이동용)
   const [page, setPage] = useState(1)
   const [rowsPerPage] = useState(10)
   const [searchType, setSearchType] = useState('title')
   const [searchKeyword, setSearchKeyword] = useState('')
   // const [isWriting, setIsWriting] = useState(false)
   const [isReportOpen, setIsReportOpen] = useState(false) // 벤실험 코드
   const [targetUser, setTargetUser] = useState(null) // 벤실험 코드
   const handleOpenReport = (user) => {
      setTargetUser(user)
      setIsReportOpen(true)
   } //벤실험 코드
   const handleCloseReport = () => {
      setIsReportOpen(false)
   } // 벤실험 코드
   const handleSubmitReport = (reason) => {
      if (!targetUser) return
      if (!user) {
         alert('로그인이 필요합니다.')
         return
      }
      dispatch(submitReport({ reportedUserId: targetUser.id, reporterId: user.id, reason })) // reporterId는 현재 로그인한 유저로 대체
      setIsReportOpen(false)
   } // 벤실험 코드
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
         {/* :흰색_확인_표시: 게시판 제목 + 글쓰기 버튼 */}
         <Header>
            <Title>{category} 게시판</Title>
            {(selectedCategory !== 'noti' || user?.role === 'ADMIN') && <WriteButton onClick={() => navigate('/board/create')}>글쓰기</WriteButton>}
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
                           <StyledTableRow key={post.id}>
                              <StyledTableCell>{post.id}</StyledTableCell>
                              <StyledTableCell onClick={() => navigate(`/board/detail/${post.id}`)} style={{ cursor: 'pointer' }}>
                                 {post.title}
                              </StyledTableCell>
                              <StyledTableCell onClick={() => handleOpenReport(post.User)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} /*벤실험 코드 */>
                                 {post?.User?.nickname}
                              </StyledTableCell>
                              <StyledTableCell>{new Date(post.createdAt).toLocaleDateString()}</StyledTableCell>
                           </StyledTableRow>
                        ))}
                     </TableBody>
                  </StyledTable>
               </StyledTableContainer>
               {/* 신고 모달 */}
               {isReportOpen && <Report isOpen={isReportOpen} onClose={handleCloseReport} onReport={handleSubmitReport} targetUser={targetUser} />} {/* 벤실험코드 */}
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
