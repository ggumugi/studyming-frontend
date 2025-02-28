import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getBannedUsers } from '../../features/bannedSlice'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, Pagination } from '@mui/material'

const BanRecordsBoard = () => {
   const dispatch = useDispatch()
   const { bannedUsers, loading } = useSelector((state) => state.banned)

   useEffect(() => {
      dispatch(getBannedUsers()) // 정지 목록 불러오기
   }, [dispatch])

   const [page, setPage] = React.useState(1)
   const [rowsPerPage] = React.useState(8)
   const [searchQuery, setSearchQuery] = React.useState('')
   const [filter, setFilter] = React.useState('reportedUser')

   const handleChangePage = (event, newPage) => {
      setPage(newPage)
   }

   const handleSearch = () => {
      setPage(1) // 검색 시 첫 페이지로 이동
   }

   // 검색 필터링
   // ✅ Redux에서 bannedUsers 가져오기
   const filteredReports = bannedUsers.filter((user) => {
      if (filter === 'reportedUser' && user.reportedUser?.nickname) {
         return user.reportedUser.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      }
      if (filter === 'reason' && user.reason) {
         return user.reason.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return false
   })

   // 페이지네이션 적용
   const paginatedReports = filteredReports.slice((page - 1) * rowsPerPage, page * rowsPerPage)

   //시간 변환
   // formatDate 함수 수정
   function formatDate(dateString) {
      if (!dateString) return 'X' // null, undefined 또는 빈 문자열인 경우 'X' 반환

      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
   }

   return (
      <div style={{ width: '100%' }}>
         <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: 'auto' }}>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell sx={{ width: '10%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        NO
                     </TableCell>
                     <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        닉네임
                     </TableCell>
                     {/* ✅ 제목을 넓게 */}
                     <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        정지 시작
                     </TableCell>
                     <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        정지 종료
                     </TableCell>
                     <TableCell sx={{ width: '45%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        사유
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {paginatedReports.map((user, index) => (
                     <TableRow key={user.bannedId}>
                        <TableCell sx={{ width: '10%', textAlign: 'center', height: '64px' }}>{index + 1}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{user.reportedUser?.nickname || '알 수 없음'}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{user.startDate ? formatDate(user.startDate) : 'X'}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{user.endDate ? formatDate(user.endDate) : 'X'}</TableCell>
                        <TableCell sx={{ width: '45%', textAlign: 'center' }}>{user.reason}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>

         {/* 페이지네이션 */}
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Pagination
               count={Math.ceil(filteredReports.length / rowsPerPage)} // 총 페이지 수
               page={page}
               onChange={handleChangePage}
               color="warning"
               shape="rounded"
            />
         </div>

         {/* 검색 필터 */}
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Select value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ width: '165px' }}>
               <MenuItem value="reportedUser">회원 닉네임</MenuItem>

               <MenuItem value="reason">사유</MenuItem>
            </Select>
            <TextField value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="검색어 입력" sx={{ marginLeft: '10px', width: '400px', height: '40px' }} />
            <Button variant="contained" color="warning" sx={{ marginLeft: '10px', width: '100px' }} onClick={handleSearch}>
               검색
            </Button>
         </div>
      </div>
   )
}

export default BanRecordsBoard
