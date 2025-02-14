import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, Pagination } from '@mui/material'

const reportsData = [
   { id: 1, reportedUser: '현수박박박박', reporter: '희경이이이', reason: '명예훼손 또는 저작권이 침해되었습니다.', banPeriod: '없음' },
   { id: 2, reportedUser: '강원식', reporter: '이경희', reason: '불쾌한 표현이 있습니다', banPeriod: '없음' },
   { id: 3, reportedUser: '박현수', reporter: '이경희', reason: '음란물입니다', banPeriod: '없음' },
   { id: 4, reportedUser: '식원강', reporter: '박지우', reason: '스팸홍보/도배입니다', banPeriod: '없음' },
   { id: 5, reportedUser: '수현박', reporter: '박지우', reason: '욕설/생명경시/혐오/차별적 표현입니다', banPeriod: '없음' },
   { id: 6, reportedUser: '강원식', reporter: '이경희', reason: '그냥', banPeriod: '없음' },
   { id: 7, reportedUser: '박현수', reporter: '이경희', reason: '그냥', banPeriod: '없음' },
   { id: 8, reportedUser: '강원식', reporter: '박지우', reason: '담배충임', banPeriod: '없음' },
   { id: 9, reportedUser: '박현수', reporter: '박지우', reason: '아재개그충임', banPeriod: '없음' },
]

const ReportsBoard = () => {
   const [reports, setReports] = useState(reportsData)
   const [page, setPage] = useState(1)
   const [rowsPerPage] = useState(8)
   const [searchQuery, setSearchQuery] = useState('')
   const [filter, setFilter] = useState('reportedUser')

   // 페이지네이션 변경

   // 정지 기간 변경
   const handleBanChange = (id, value) => {
      setReports((prev) => prev.map((report) => (report.id === id ? { ...report, banPeriod: value } : report)))
   }

   // 적용 버튼 클릭 시 알림
   const handleApply = (id, reportedUser) => {
      alert(`신고된 회원: ${reportedUser}, 정지 기간 적용: ${reports.find((r) => r.id === id)?.banPeriod}`)
   }

   // 검색 필터링
   const filteredReports = reports.filter((report) => report[filter]?.toLowerCase().includes(searchQuery.toLowerCase()))

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
                        신고된 회원
                     </TableCell>
                     {/* ✅ 제목을 넓게 */}
                     <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        신고한회원
                     </TableCell>
                     <TableCell sx={{ width: '40%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        사유
                     </TableCell>
                     <TableCell sx={{ width: '20%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        정지기간
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {paginatedReports.map((row) => (
                     <TableRow key={row.id}>
                        <TableCell sx={{ width: '10%', textAlign: 'center', height: '64px' }}>{row.id}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{row.reportedUser}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{row.reporter}</TableCell>
                        <TableCell sx={{ width: '40%', textAlign: 'center' }}>{row.reason}</TableCell>
                        <TableCell sx={{ width: '20%', textAlign: 'center' }}>
                           <Select value={row.banPeriod} onChange={(e) => handleBanChange(row.id, e.target.value)} displayEmpty sx={{ width: '100px', height: '30px', fontSize: '14px', textAlign: 'center', marginRight: '10px' }}>
                              <MenuItem value="없음">없음</MenuItem>
                              <MenuItem value="7일">7일</MenuItem>
                              <MenuItem value="14일">14일</MenuItem>
                              <MenuItem value="30일">30일</MenuItem>
                              <MenuItem value="영구정지">영구정지</MenuItem>
                           </Select>
                           <Button variant="contained" color="warning" sx={{ height: '30px', textAlign: 'center', top: '-1px' }} onClick={() => handleApply(row.id, row.reportedUser)}>
                              적용
                           </Button>
                        </TableCell>
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
               onChange={(event, value) => setPage(value)}
               color="warning"
               shape="rounded"
            />
         </div>

         {/* 검색 필터 */}
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Select value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ width: '165px' }}>
               <MenuItem value="reportedUser">신고된 회원</MenuItem>
               <MenuItem value="reporter">신고한 회원</MenuItem>
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

export default ReportsBoard
