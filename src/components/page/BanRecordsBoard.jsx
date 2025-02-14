import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, Pagination } from '@mui/material'

const reportsData = [
   { id: 1, reportedUser: '현수박박박박', banStartDate: '2025-02-20', banEndDate: '2025-02-27', reason: '명예훼손 또는 저작권이 침해되었습니다.' },
   { id: 2, reportedUser: '강원식', banStartDate: '2025-02-20', banEndDate: '2025-05-27', reason: '불쾌한 표현이 있습니다' },
   { id: 3, reportedUser: '박현수', banStartDate: '2025-02-20', banEndDate: '2025-03-27', reason: '음란물입니다' },
   { id: 4, reportedUser: '식원강', banStartDate: '2025-02-20', banEndDate: '2025-03-07', reason: '스팸홍보/도배입니다' },
   { id: 5, reportedUser: '수현박', banStartDate: '2025-02-20', banEndDate: '2025-03-07', reason: '욕설/생명경시/혐오/차별적 표현입니다' },
   { id: 6, reportedUser: '강원식', banStartDate: '2025-02-20', banEndDate: '2026-01-07', reason: '그냥' },
   { id: 7, reportedUser: '박현수', banStartDate: '2025-02-20', banEndDate: '2026-01-07', reason: '그냥' },
   { id: 8, reportedUser: '강원식', banStartDate: '2025-02-20', banEndDate: '2026-01-07', reason: '담배충임' },
   { id: 9, reportedUser: '박현수', banStartDate: '2025-02-20', banEndDate: '2026-01-07', reason: '아재개그충임' },
]

const BanRecordsBoard = () => {
   const [reports] = useState(reportsData)
   const [page, setPage] = useState(1)
   const [rowsPerPage] = useState(8)
   const [searchQuery, setSearchQuery] = useState('')
   const [filter, setFilter] = useState('reportedUser')

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
                  {paginatedReports.map((row) => (
                     <TableRow key={row.id}>
                        <TableCell sx={{ width: '10%', textAlign: 'center', height: '64px' }}>{row.id}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{row.reportedUser}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{row.banStartDate}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{row.banEndDate}</TableCell>
                        <TableCell sx={{ width: '45%', textAlign: 'center' }}>{row.reason}</TableCell>
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
            <Button variant="contained" color="warning" sx={{ marginLeft: '10px', width: '100px' }}>
               검색
            </Button>
         </div>
      </div>
   )
}

export default BanRecordsBoard
