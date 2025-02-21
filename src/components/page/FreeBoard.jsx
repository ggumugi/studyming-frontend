import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, Pagination } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostsThunk } from '../../features/postSlice'
import FreePostDetail from './FreePostDetail'
import Report from '../shared/Report'

const FreeBoard = () => {
   const dispatch = useDispatch()
   const { list: posts, loading } = useSelector((state) => state.posts) // Redux에서 게시글 리스트 가져오기

   const [page, setPage] = useState(1)
   const [rowsPerPage] = useState(10)
   const [searchQuery, setSearchQuery] = useState('')
   const [filter, setFilter] = useState('title')
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [selectedPost, setSelectedPost] = useState(null)

   // 페이지네이션 변경
   const handleChangePage = (event, newPage) => {
      setPage(newPage)
   }

   // 검색 기능
   const filteredPosts = posts?.filter((post) => post[filter]?.toLowerCase().includes(searchQuery.toLowerCase()))
   const paginatedPosts = filteredPosts?.slice((page - 1) * rowsPerPage, page * rowsPerPage)

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

   // 🔥 백엔드에서 게시글 데이터 가져오기
   useEffect(() => {
      dispatch(fetchPostsThunk()) // Redux를 통해 서버에서 게시글 리스트 가져오기
   }, [dispatch])

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
                              {paginatedPosts?.map((post) => (
                                 <TableRow key={post.id}>
                                    <TableCell sx={{ width: '10%', textAlign: 'center' }}>
                                       <span style={{ cursor: 'pointer', display: 'inline' }} onClick={() => setSelectedPost(post)}>
                                          {post.id}
                                       </span>
                                    </TableCell>
                                    <TableCell sx={{ width: '60%', textAlign: 'center' }}>
                                       <span style={{ cursor: 'pointer', display: 'inline' }} onClick={() => setSelectedPost(post)}>
                                          {post.title}
                                       </span>
                                    </TableCell>
                                    <TableCell sx={{ width: '15%', textAlign: 'center' }}>
                                       <span style={{ cursor: 'pointer', display: 'inline' }} onClick={handleReportClick}>
                                          {post.author}
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

                     {/* 페이지네이션 */}
                     <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Pagination count={Math.ceil(filteredPosts?.length / rowsPerPage)} page={page} onChange={handleChangePage} color="warning" shape="rounded" />
                     </div>

                     {/* 검색 필터 */}
                     <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Select value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ height: '45px' }}>
                           <MenuItem value="title">제목</MenuItem>
                           <MenuItem value="author">작성자</MenuItem>
                        </Select>

                        <TextField
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           placeholder="검색어 입력"
                           sx={{
                              maxWidth: '700px',
                              width: '100%',
                              marginLeft: '10px',
                              '& .MuiInputBase-root': {
                                 height: '45px',
                                 display: 'flex',
                                 alignItems: 'center',
                              },
                              '& .MuiInputBase-input': {
                                 height: '100%',
                                 padding: '10px',
                              },
                           }}
                        />

                        <Button variant="contained" color="warning" sx={{ marginLeft: '10px', height: '45px' }}>
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
