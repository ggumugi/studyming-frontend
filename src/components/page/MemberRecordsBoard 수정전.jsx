import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, Pagination } from '@mui/material'

const reportsData = [
   { id: 1, nickname: '현수박박박박', userid: 'user001', email: 'user001@example.com', registrationDate: '2020-01-01', status: '일반' },
   { id: 2, nickname: '강원식', userid: 'user002', email: 'user002@example.com', registrationDate: '2021-05-15', status: '휴먼정지' },
   { id: 3, nickname: '박현수', userid: 'user003', email: 'user003@example.com', registrationDate: '2019-11-20', status: '일반' },
   { id: 4, nickname: '이경희', userid: 'user004', email: 'user004@example.com', registrationDate: '2022-07-08', status: '운영자' },
   { id: 5, nickname: '박지우', userid: 'user005', email: 'user005@example.com', registrationDate: '2023-02-10', status: '운영자' },
   { id: 6, nickname: '식원강', userid: 'user006', email: 'user006@example.com', registrationDate: '2018-09-30', status: '일반' },
   { id: 7, nickname: '수현박', userid: 'user007', email: 'user007@example.com', registrationDate: '2020-06-21', status: '일반' },
   { id: 8, nickname: '희경이', userid: 'user008', email: 'user008@example.com', registrationDate: '2017-03-15', status: '휴먼정지' },
   { id: 9, nickname: '우지박', userid: 'user009', email: 'user009@example.com', registrationDate: '2024-01-05', status: '일반' },
]

const BanRecordsBoard = () => {
   const [reports] = useState(reportsData)
   const [page, setPage] = useState(1)
   const [rowsPerPage] = useState(8)
   const [searchQuery, setSearchQuery] = useState('')
   const [filter, setFilter] = useState('nickname')

   const handleChangePage = (event, newPage) => {
      setPage(newPage)
   }

   // 검색 필터링
   const filteredReports = reports.filter((report) => report[filter] && report[filter].toString().toLowerCase().includes(searchQuery.toLowerCase()))

   // 페이지네이션 적용
   const paginatedReports = filteredReports.slice((page - 1) * rowsPerPage, page * rowsPerPage)
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
                        아이디
                     </TableCell>
                     <TableCell sx={{ width: '25%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        이메일
                     </TableCell>
                     <TableCell sx={{ width: '20%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        가입일
                     </TableCell>
                     <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        상태
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {paginatedReports.map((row) => (
                     <TableRow key={row.id}>
                        <TableCell sx={{ width: '10%', textAlign: 'center', height: '64px' }}>{row.id}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{row.nickname}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{row.userid}</TableCell>
                        <TableCell sx={{ width: '25%', textAlign: 'center' }}>{row.email}</TableCell>
                        <TableCell sx={{ width: '20%', textAlign: 'center' }}>{row.registrationDate}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{row.status}</TableCell>
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
               <MenuItem value="nickname">회원 닉네임</MenuItem>
               <MenuItem value="userid">회원 아이디</MenuItem>
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

export default BanRecordsBoard
