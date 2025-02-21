import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, Pagination } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostsThunk } from '../../features/postSlice'
import FreePostDetail from './FreePostDetail'
import Report from '../shared/Report'

const FreeBoard = () => {
   const dispatch = useDispatch()
   // Redux 상태 선택기 수정
   const posts = useSelector((state) => state.posts.posts)
   const pagination = useSelector((state) => state.posts.pagination)

   console.log('현재 리덕스 상태:', { posts, pagination })

   const loading = useSelector((state) => state.posts.loading)
   const [page, setPage] = useState(1)
   const [rowsPerPage] = useState(10)
   const [searchType, setSearchType] = useState('title') // 1. 변수명 변경
   const [searchKeyword, setSearchKeyword] = useState('')
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [selectedPost, setSelectedPost] = useState(null)

   // 페이지네이션 변경
   const handleChangePage = (event, newPage) => {
      setPage(newPage)
   }

   // 검색 기능
   const filteredPosts = posts || [] // 🔥 Redux에서 가져온 posts 그대로 사용

   /* const filteredPosts = posts?.filter((post) => post[searchType]?.toLowerCase().includes(searchKeyword.toLowerCase())) */
   /*
   const paginatedPosts = filteredPosts?.slice((page - 1) * rowsPerPage, page * rowsPerPage) */

   const handleReportClick = () => {
      setIsModalOpen(true) // 신고 버튼 클릭 시 모달 열기
   }

   const handleCloseModal = () => {
      setIsModalOpen(false) // 모달 닫기
   }

   const handleReport = () => {
      console.log('사용자를 신고했습니다.')
      setIsModalOpen(false)
   }
   const handleSearch = () => {
      dispatch(
         fetchPostsThunk({
            page: 1,
            category: 'free',
            limit: 10,
            searchType,
            searchKeyword,
         })
      )
   }

   useEffect(() => {
      dispatch(
         fetchPostsThunk({
            page: page || 1, // ✅ 기본값 추가
            category: 'free',
            limit: rowsPerPage || 10, // ✅ 기본값 추가
            searchType,
            searchKeyword,
         })
      )
   }, [dispatch, page, rowsPerPage, searchType, searchKeyword])
   //rowsPerPage 추가

   return (
      <div style={{ width: '100%' }}>
         {isModalOpen && <Report isOpen={isModalOpen} onClose={handleCloseModal} onReport={handleReport} />}
         {selectedPost ? ( // ✅ 게시글 클릭 시 상세 페이지 표시
            <FreePostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
         ) : (
            <>
               {loading ? (
                  <p>로딩 중...</p>
               ) : (
                  <>
                     <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: 'auto' }}>
                        <Table>
                           <TableHead>
                              <TableRow>
                                 <TableCell sx={{ width: '10%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    NO
                                 </TableCell>
                                 <TableCell sx={{ width: '60%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    제목
                                 </TableCell>
                                 <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    작성자
                                 </TableCell>
                                 <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    작성일
                                 </TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {filteredPosts.map((post) => (
                                 <TableRow key={post.id}>
                                    <TableCell sx={{ width: '10%', textAlign: 'center' }}>
                                       <span style={{ cursor: 'pointer', display: 'inline' }} onClick={() => setSelectedPost(post)}>
                                          {post.id}
                                       </span>
                                    </TableCell>
                                    <TableCell sx={{ width: '60%', textAlign: 'center' }}>
                                       <span style={{ cursor: 'pointer', display: 'inline' }} onClick={() => setSelectedPost(post)}>
                                          {post?.title}
                                       </span>
                                    </TableCell>
                                    <TableCell sx={{ width: '15%', textAlign: 'center' }}>
                                       <span style={{ cursor: 'pointer', display: 'inline' }} onClick={handleReportClick}>
                                          {post?.User?.nickname}
                                       </span>
                                    </TableCell>
                                    <TableCell sx={{ width: '15%', textAlign: 'center' }}>
                                       <span style={{ cursor: 'pointer', display: 'inline' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </TableContainer>

                     {/* 페이지네이션 수정 */}
                     {pagination && (
                        <Pagination
                           count={Math.ceil(pagination.totalPosts / 10)} // ✅ 전체 게시물 개수를 기준으로 동적 계산
                           page={pagination.currentPage}
                           onChange={handleChangePage}
                           color="warning"
                           shape="rounded"
                        />
                     )}

                     {/* 검색 필터 */}
                     <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                           <MenuItem value="title">제목</MenuItem>
                           <MenuItem value="author">작성자</MenuItem>
                        </Select>

                        <TextField
                           value={searchKeyword}
                           onChange={(e) => setSearchKeyword(e.target.value)}
                           placeholder="검색어 입력"
                           sx={{
                              maxWidth: '700px',
                              width: '100%',
                              marginLeft: '10px',
                              '& .MuiInputBase-root': { height: '45px' },
                           }}
                        />

                        <Button variant="contained" color="warning" sx={{ marginLeft: '10px', height: '45px' }} onClick={handleSearch}>
                           검색
                        </Button>
                     </div>
                  </>
               )}
            </>
         )}
      </div>
   )
}

export default FreeBoard
