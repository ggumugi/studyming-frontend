import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Button, Pagination, TextField } from '@mui/material'
import moment from 'moment'

const reportsData = [
   { id: 1, reportedUser: '현수박박박박', reporter: '희경이이이', reason: '명예훼손 또는 저작권이 침해되었습니다.', banPeriod: '2025-02-20' },
   { id: 2, reportedUser: '강원식', reporter: '이경희', reason: '불쾌한 표현이 있습니다', banPeriod: '2025-02-20' },
   { id: 3, reportedUser: '박현수', reporter: '이경희', reason: '음란물입니다', banPeriod: '2025-02-20' },
   { id: 4, reportedUser: '식원강', reporter: '박지우', reason: '스팸홍보/도배입니다', banPeriod: '2025-02-20' },
   { id: 5, reportedUser: '수현박', reporter: '박지우', reason: '욕설/생명경시/혐오/차별적 표현입니다', banPeriod: '2025-02-20' },
   { id: 6, reportedUser: '강원식', reporter: '이경희', reason: '그냥', banPeriod: '2025-02-20' },
   { id: 7, reportedUser: '박현수', reporter: '이경희', reason: '그냥', banPeriod: '2025-02-20' },
   { id: 8, reportedUser: '강원식', reporter: '박지우', reason: '담배충임', banPeriod: '2025-02-20' },
   { id: 9, reportedUser: '박현수', reporter: '박지우', reason: '아재개그충임', banPeriod: '2025-02-20' },
]

const ActionsTakenBoard = () => {
   const [reports, setReports] = useState(reportsData)
   const [page, setPage] = useState(1)
   const [rowsPerPage] = useState(8)
   const [searchQuery, setSearchQuery] = useState('')
   const [filter, setFilter] = useState('reportedUser')
   const [editingId, setEditingId] = useState(null) // 현재 수정 중인 행
   const [selectedDate, setSelectedDate] = useState(null) // 선택된 날짜

   // 날짜 변경 핸들러
   const handleDateChange = (event, id) => {
      setSelectedDate(event.target.value)
      setEditingId(id)
   }

   // 적용 버튼 클릭 시 날짜 업데이트
   const handleApply = (id) => {
      if (!selectedDate) return
      setReports((prev) => prev.map((report) => (report.id === id ? { ...report, banPeriod: moment(selectedDate).format('YYYY-MM-DD') } : report)))
      setEditingId(null)
      setSelectedDate('')
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
                        <TableCell sx={{ textAlign: 'center' }}>
                           {editingId === row.id ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 <TextField
                                    type="date"
                                    value={selectedDate || row.banPeriod}
                                    onChange={(e) => handleDateChange(e, row.id)}
                                    sx={{
                                       width: '110px',
                                       height: '30px',
                                       '& .MuiInputBase-root': { height: '30px' }, // 전체 TextField 크기 조정
                                       '& .MuiInputBase-input': {
                                          height: '30px',
                                          padding: '0 5px', // 좌우 패딩만 유지, 상하 패딩 제거
                                          lineHeight: '30px', // 입력 필드 텍스트 정렬
                                          fontSize: '14px', // 글자 크기 조정 (선택 사항)
                                       },
                                    }}
                                    // inputProps={{ style: { height: '30px', padding: '0 5px', lineHeight: '30px' } }} // 내부 input 스타일 강제 적용
                                 />
                                 <Button variant="contained" color="warning" sx={{ height: '30px', marginLeft: '10px' }} onClick={() => handleApply(row.id)}>
                                    적용
                                 </Button>
                              </div>
                           ) : (
                              <Button variant="outlined" color="primary" sx={{ width: '120px', height: '30px' }} onClick={() => setEditingId(row.id)}>
                                 {row.banPeriod}
                              </Button>
                           )}
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

export default ActionsTakenBoard
