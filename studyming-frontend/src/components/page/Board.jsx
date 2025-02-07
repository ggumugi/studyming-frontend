import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Select, MenuItem, Button, Pagination } from '@mui/material'
import PostDetail from '../page/PostDetail'

const initialPosts = [
   { id: 4, title: '여기 돈내면 못돌려받나요?', author: '레몬라임', date: '2025-01-06', content: 'ㅅㅂ...' },
   { id: 4, title: '충전했는데 포인트가 일주일뒤에 사라졌습니다', author: '식원강', date: '2025-01-06', content: '어캐하나요' },
   { id: 4, title: '장보기 리스트', author: '희경이', date: '2025-01-06', content: '뭘봐' },
   { id: 4, title: '1티어 과자는 초코하임이다', author: '우지박', date: '2025-01-06', content: '반박은 받지 않는다' },
   { id: 4, title: '기사시험 당일 오후 3시에 일어났습니다...', author: '식원강', date: '2025-01-06', content: '기사시험 본다고 32년 공부했는데 밤 10시에 잠들었다가 오후 3시에 일어났습니다 저 어떡하면 좋을까요 ' },
   { id: 3, title: '야식 추천 해주세요', author: '오리지날', date: '2025-01-06', content: '역시 교촌오리지날인가요?' },
   { id: 2, title: '새해 목표가 다들 뭔가요', author: '하루살이', date: '2025-01-05', content: '전 이틀살기요' },
   { id: 1, title: '♚♚히어로즈 오브 더 스☆톰♚♚가입시$$전원 카드팩☜☜뒷면100%증정※', author: '히어로즈', date: '2025-01-02', content: '너만 오면 고' },
]

const Board = () => {
   const [posts, setPosts] = useState(initialPosts)
   const [page, setPage] = useState(1)
   const [rowsPerPage, setRowsPerPage] = useState(10)
   const [searchQuery, setSearchQuery] = useState('')
   const [filter, setFilter] = useState('title')

   const [selectedPost, setSelectedPost] = useState(null)
   // 페이지네이션 변경
   const handleChangePage = (event, newPage) => {
      setPage(newPage)
   }

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10))
      setPage(0)
   }

   // 검색 기능
   const filteredPosts = posts.filter((post) => post[filter].toLowerCase().includes(searchQuery.toLowerCase()))
   const paginatedPosts = filteredPosts.slice((page - 1) * rowsPerPage, page * rowsPerPage)

   return (
      <div style={{ width: '100%' }}>
         {selectedPost ? ( // ✅ 게시글 클릭 시 상세 페이지 표시
            <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
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
                           </TableCell>{' '}
                           {/* ✅ 제목을 넓게 */}
                           <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                              작성자
                           </TableCell>
                           <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                              작성일
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {paginatedPosts.map((post) => (
                           <TableRow key={post.id}>
                              <TableCell sx={{ width: '10%', textAlign: 'center' }}>{post.id}</TableCell>
                              <TableCell sx={{ width: '60%', textAlign: 'center' }} onClick={() => setSelectedPost(post)}>
                                 {post.title}
                              </TableCell>
                              <TableCell sx={{ width: '15%', textAlign: 'center' }}>{post.author}</TableCell>
                              <TableCell sx={{ width: '15%', textAlign: 'center' }}>{post.date}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>

               {/* 페이지네이션 */}
               <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                  <Pagination
                     count={Math.ceil(filteredPosts.length / rowsPerPage)} // 총 페이지 수
                     page={page}
                     onChange={handleChangePage}
                     color="warning"
                     shape="rounded"
                  />
               </div>
            </>
         )}

         {/* 검색 필터 */}
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Select value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ width: '120px' }}>
               <MenuItem value="title">제목</MenuItem>
               <MenuItem value="author">작성자</MenuItem>
            </Select>
            <TextField value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="검색어 입력" sx={{ marginLeft: '10px', width: '300px' }} />
            <Button variant="contained" color="warning" sx={{ marginLeft: '10px' }}>
               검색
            </Button>
         </div>
      </div>
   )
}

export default Board
