import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUsersThunk } from '../../features/authSlice' // Redux Thunk 가져오기
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, Pagination } from '@mui/material'

const MemberRecordsBoard = () => {
   const dispatch = useDispatch()
   const users = useSelector((state) => state.auth.users) || [] // 🔥 Redux에서 유저 리스트 가져오기
   const [page, setPage] = useState(1)
   const [rowsPerPage] = useState(8)
   const [searchQuery, setSearchQuery] = useState('')
   const [filter, setFilter] = useState('nickname')

   useEffect(() => {
      dispatch(fetchUsersThunk()) // ✅ 컴포넌트 마운트 시 유저 리스트 불러오기
   }, [dispatch])

   useEffect(() => {
      setPage(1) // 검색 시 첫 페이지로 이동
   }, [searchQuery, filter])

   const handleChangePage = (event, newPage) => {
      setPage(newPage)
   }

   // 🔍 검색 필터링
   const filteredUsers = users.filter((user) => user[filter]?.toString().toLowerCase().includes(searchQuery.toLowerCase()))

   // 📌 페이지네이션 적용
   const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage)

   return (
      <div style={{ width: '100%' }}>
         <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: 'auto' }}>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>NO</TableCell>
                     <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>닉네임</TableCell>
                     <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>아이디</TableCell>
                     <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>이메일</TableCell>
                     <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>가입일</TableCell>
                     <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>상태</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {paginatedUsers.length > 0 ? (
                     paginatedUsers.map((user, index) => (
                        <TableRow key={user.id}>
                           <TableCell sx={{ textAlign: 'center' }}>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                           <TableCell sx={{ textAlign: 'center' }}>{user.nickname}</TableCell>
                           <TableCell sx={{ textAlign: 'center' }}>{user.name}</TableCell>
                           <TableCell sx={{ textAlign: 'center' }}>{user.email}</TableCell>
                           <TableCell sx={{ textAlign: 'center' }}>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                           <TableCell sx={{ textAlign: 'center' }}>{user.status}</TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                           회원 데이터가 없습니다.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </TableContainer>

         {/* 📌 페이지네이션 */}
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Pagination count={Math.ceil(filteredUsers.length / rowsPerPage)} page={page} onChange={handleChangePage} color="warning" shape="rounded" />
         </div>

         {/* 🔎 검색 필터 */}
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Select value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ width: '165px' }}>
               <MenuItem value="nickname">회원 닉네임</MenuItem>
               <MenuItem value="name">회원 아이디</MenuItem>
               <MenuItem value="email">이메일</MenuItem>
               <MenuItem value="status">상태</MenuItem>
            </Select>
            <TextField value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="검색어 입력" sx={{ marginLeft: '10px', width: '400px', height: '40px' }} />
            <Button variant="contained" color="warning" sx={{ marginLeft: '10px', width: '100px' }}>
               검색
            </Button>
         </div>
      </div>
   )
}

export default MemberRecordsBoard
