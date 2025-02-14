import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, Pagination } from '@mui/material'
import NotiBoardDetail from './NotiBoardDetail'

const initialPosts = [
   { id: 8, title: '한번더 이상한 게시판올리면 스마트폰으로 얼굴가격함', author: '이경희', date: '2025-01-06', content: '진짜임' },
   { id: 7, title: '충전했는데 포인트가 일주일뒤에 사라졌습니다', author: '식원강', date: '2025-01-06', content: '어캐하나요' },
   { id: 6, title: '장보기 리스트', author: '희경이', date: '2025-01-06', content: '뭘봐' },
   { id: 5, title: '1티어 과자는 초코하임이다', author: '우지박', date: '2025-01-06', content: '반박은 받지 않는다' },
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

   // 검색 기능
   const filteredPosts = posts.filter((post) => post[filter].toLowerCase().includes(searchQuery.toLowerCase()))
   const paginatedPosts = filteredPosts.slice((page - 1) * rowsPerPage, page * rowsPerPage)

   return (
      <div style={{ width: '100%' }}>
         {selectedPost ? (
            <NotiBoardDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
         ) : (
            <>
               <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: 'auto' }}>
                  <Table>
                     <TableHead>
                        <TableRow>
                           <TableCell sx={{ width: '10%', fontWeight: 'bold', textAlign: 'center' }}>NO</TableCell>
                           <TableCell sx={{ width: '60%', fontWeight: 'bold', textAlign: 'center' }}>제목</TableCell>
                           <TableCell sx={{ width: '15%', fontWeight: 'bold', textAlign: 'center' }}>작성자</TableCell>
                           <TableCell sx={{ width: '15%', fontWeight: 'bold', textAlign: 'center' }}>작성일</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {paginatedPosts.map((post) => (
                           <TableRow key={post.id}>
                              {/* 🔥 NO(게시글 ID)에도 클릭 가능하도록 추가 */}
                              <TableCell sx={{ width: '10%', textAlign: 'center' }}>
                                 <span style={{ cursor: 'pointer', display: 'inline' }} onClick={() => setSelectedPost(post)}>
                                    {post.id}
                                 </span>
                              </TableCell>

                              {/* 🔥 제목의 글자 부분만 커서 변경 */}
                              <TableCell sx={{ width: '60%', textAlign: 'center' }}>
                                 <span style={{ cursor: 'pointer', display: 'inline' }} onClick={() => setSelectedPost(post)}>
                                    {post.title}
                                 </span>
                              </TableCell>

                              {/* 🔥 작성자의 글자 부분만 커서 변경 */}
                              <TableCell sx={{ width: '15%', textAlign: 'center' }}>
                                 <span style={{ cursor: 'pointer', display: 'inline' }} onClick={() => console.log(`작성자 클릭: ${post.author}`)}>
                                    {post.author}
                                 </span>
                              </TableCell>

                              {/* 🔥 작성일의 글자 부분만 커서 변경 */}
                              <TableCell sx={{ width: '15%', textAlign: 'center' }}>
                                 <span style={{ cursor: 'pointer', display: 'inline' }} onClick={() => console.log(`작성일 클릭: ${post.date}`)}>
                                    {post.date}
                                 </span>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>

               {/* 페이지네이션 */}
               <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                  <Pagination count={Math.ceil(filteredPosts.length / rowsPerPage)} page={page} onChange={handleChangePage} color="warning" shape="rounded" />
               </div>
            </>
         )}

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
                  maxWidth: '700px', // ✅ 가로 크기 확장
                  width: '100%', // 반응형 조정
                  marginLeft: '10px',
                  '& .MuiInputBase-root': {
                     height: '45px', // ✅ 외부 컨테이너 높이 설정
                     display: 'flex',
                     alignItems: 'center', // ✅ 세로 정렬
                  },
                  '& .MuiInputBase-input': {
                     height: '100%', // ✅ 내부 input이 부모 높이에 맞게 조정
                     padding: '10px', // ✅ 기본 padding 설정 (안쪽 여백)
                  },
               }}
            />

            <Button
               variant="contained"
               color="warning"
               sx={{ marginLeft: '10px', height: '45px' }} // ✅ 버튼 높이 맞춤
            >
               검색
            </Button>
         </div>
      </div>
   )
}

export default Board
