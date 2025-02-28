import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, Pagination } from '@mui/material'
import { getReports, applyBan } from '../../features/bannedSlice'
import { useDispatch, useSelector } from 'react-redux'

const ReportsBoard = () => {
   const dispatch = useDispatch()
   const { reports, loading, error } = useSelector((state) => state.banned)
   const [page, setPage] = useState(1)
   const [rowsPerPage] = useState(8)
   const [searchQuery, setSearchQuery] = useState('')
   const [filter, setFilter] = useState('reportedUser')
   const [banPeriods, setBanPeriods] = useState({})
   const [localReports, setLocalReports] = useState([])

   useEffect(() => {
      dispatch(getReports()) // ✅ 신고 목록 불러오기
   }, [dispatch])
   // 정지 기간 변경
   const handleBanChange = (id, value) => {
      setBanPeriods((prev) => ({ ...prev, [id]: value }))
   }
   useEffect(() => {
      dispatch(getReports()) // ✅ Redux에서 데이터 가져오기
   }, [dispatch])

   useEffect(() => {
      setLocalReports(reports) // ✅ Redux에서 가져온 데이터 로컬 상태에 반영
   }, [reports])

   // 적용 버튼 클릭 시 알림
   // ✅ 적용 버튼 클릭 시 동작
   const handleApply = async (reportId, reportedUser) => {
      const banDays = banPeriods[reportId]

      if (!banDays || banDays === '없음') {
         alert('🚨 정지 기간을 선택해주세요!')
         return
      }

      // ✅ "이미 정지된 회원"일 때 특정 신고만 삭제하도록 수정
      if (reportedUser.status === 'BANNED') {
         alert('🚨 이미 정지된 회원입니다!')

         // ✅ 특정 신고(reportId)만 삭제하고, 같은 유저의 다른 신고는 유지
         setLocalReports((prev) => prev.filter((report) => report.id !== reportId))

         return
      }

      try {
         const res = await dispatch(applyBan({ reportId, adminId: 1, banDays })).unwrap()
         alert(res.message)

         // ✅ Redux 상태 갱신 (서버에서 최신 데이터 불러오기)
         await dispatch(getReports())

         // ✅ 특정 신고만 리스트에서 삭제 (같은 유저의 다른 신고는 유지)
         setLocalReports((prev) => prev.filter((report) => report.id !== reportId))
      } catch (error) {
         console.error('❌ 벤 적용 실패:', error)
         alert('❌ 정지 처리에 실패했습니다.')
      }
   }

   const handleSearch = () => {
      setPage(1) // 검색 시 첫 페이지로 이동
   }

   // 검색 필터링 (닉네임 데이터가 `ReportedUser.nickname`에 있으므로 수정)
   const filteredReports = localReports.filter((report) => {
      if (filter === 'reportedUser' && report.reportedUser?.nickname) return report.reportedUser.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      if (filter === 'reporter' && report.reportedBy?.nickname) return report.reportedBy.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      if (filter === 'reason') return report.reason.toLowerCase().includes(searchQuery.toLowerCase())
      return false
   })

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
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{row.reportedUser.nickname}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{row.reportedBy.nickname}</TableCell>
                        <TableCell sx={{ width: '40%', textAlign: 'center' }}>{row.reason}</TableCell>
                        <TableCell sx={{ width: '20%', textAlign: 'center' }}>
                           <Select value={banPeriods[row.id] || '없음'} onChange={(e) => handleBanChange(row.id, parseInt(e.target.value.replace(/[^0-9]/g, ''), 10))} displayEmpty sx={{ width: '100px', height: '30px', fontSize: '14px', textAlign: 'center', marginRight: '10px' }}>
                              <MenuItem value="0">없음</MenuItem>
                              <MenuItem value="7">7일</MenuItem>
                              <MenuItem value="14">14일</MenuItem>
                              <MenuItem value="30">30일</MenuItem>
                              <MenuItem value="-1">영구정지</MenuItem>
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
            <Button variant="contained" color="warning" sx={{ marginLeft: '10px', width: '100px' }} onClick={handleSearch}>
               검색
            </Button>
         </div>
      </div>
   )
}

export default ReportsBoard
