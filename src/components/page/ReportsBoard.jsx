import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Button, Pagination } from '@mui/material'
import { getReports, applyBan, removeReport, getBannedUsers } from '../../features/bannedSlice'

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

   useEffect(() => {
      setLocalReports(reports) // ✅ Redux에서 가져온 데이터 로컬 상태에 반영
   }, [reports])

   useEffect(() => {
      setBanPeriods((prev) => {
         const updatedPeriods = { ...prev }
         localReports.forEach((report) => {
            if (!updatedPeriods[report.id]) {
               updatedPeriods[report.id] = 7 // 기본값 7일
            }
         })
         return updatedPeriods
      })
   }, [localReports]) // ✅ `localReports`가 변경될 때 실행

   // 정지 기간 변경
   const handleBanChange = (id, value) => {
      console.log('🚀 정지 기간 변경됨 - ID:', id, '값:', value) // ✅ 추가!
      setBanPeriods((prev) => ({ ...prev, [id]: value }))
   }

   // 적용 버튼 클릭 시 알림
   // ✅ 적용 버튼 클릭 시 동작
   const handleApply = async (reportId, reportedUser) => {
      console.log('🚀 적용 버튼 클릭됨 - 현재 banPeriods 상태:', banPeriods)
      const banDays = banPeriods[reportId]

      console.log('🚀 적용 버튼 클릭됨 - banDays 값:', banDays) // ✅ 값 확인!

      // 🚀 "없음" 선택 시 신고 삭제
      if (banDays === '없음') {
         try {
            await dispatch(removeReport(reportId)).unwrap()
            setLocalReports((prev) => prev.filter((report) => report.id !== reportId))

            // 🚀 신고 삭제 후 정지 목록 다시 불러오기 (무한 루프 방지)
            setTimeout(() => dispatch(getBannedUsers()), 500) // ✅ 0.5초 후 한 번만 실행

            alert('🚨 신고가 삭제되었으며 BanRecordsBoard에 추가되었습니다.')
         } catch (error) {
            alert('❌ 신고 삭제 실패.')
         }
         return
      }

      // 🚀 "없음"이 아닐 경우 정지 적용 로직 실행
      try {
         const res = await dispatch(applyBan({ reportId, adminId: 1, banDays })).unwrap()
         alert(res.message)
         await dispatch(getReports())
         setLocalReports((prev) => prev.filter((report) => report.id !== reportId))
      } catch (error) {
         alert('❌ 정지 처리에 실패했습니다.')
      }
   }

   const handleSearch = () => {
      setPage(1) // 검색 시 첫 페이지로 이동
   }

   // 검색 필터링 (닉네임 데이터가 `ReportedUser.nickname`에 있으므로 수정)
   const filteredReports = localReports.filter((report) => {
      if (filter === 'reportedUser' && report.reportedUser?.nickname) {
         return report.reportedUser.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      }
      if (filter === 'reporter' && report.reportedBy?.nickname) {
         return report.reportedBy.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      }
      if (filter === 'reason' && report.reason) {
         return report.reason.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return false
   })

   // 페이지네이션 적용
   const paginatedReports = filteredReports.slice((page - 1) * rowsPerPage, page * rowsPerPage)

   //시간 변환
   const formatDate = (isoString) => {
      if (!isoString) return '날짜 없음'
      return new Date(isoString).toLocaleString('ko-KR', {
         year: 'numeric',
         month: '2-digit',
         day: '2-digit',
         // hour: '2-digit',
         // minute: '2-digit',
         hour12: false, // 24시간 형식
      })
   }

   useEffect(() => {
      setBanPeriods((prev) => {
         const updatedPeriods = { ...prev }
         localReports.forEach((report) => {
            if (!updatedPeriods[report.id]) {
               updatedPeriods[report.id] = 7 // 기본값 7일
            }
         })
         return updatedPeriods
      })
   }, [localReports])

   return (
      <div style={{ width: '100%' }}>
         <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: 'auto' }}>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell sx={{ width: '10%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        신고 날짜
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
                        <TableCell sx={{ width: '10%', textAlign: 'center', height: '64px' }}>{formatDate(row.createdAt)}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{row.reportedUser.nickname}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{row.reportedBy.nickname}</TableCell>
                        <TableCell sx={{ width: '40%', textAlign: 'center' }}>{row.reason}</TableCell>
                        <TableCell sx={{ width: '20%', textAlign: 'center' }}>
                           <Select
                              value={banPeriods[row.id] || '없음'} // ✅ 기본값을 "없음"으로 설정
                              onChange={(e) => handleBanChange(row.id, e.target.value)} // ✅ 값 변경 시 `handleBanChange` 호출
                              displayEmpty
                              sx={{ width: '100px', height: '30px', fontSize: '14px', textAlign: 'center', marginRight: '10px' }}
                           >
                              <MenuItem value="없음">없음</MenuItem> {/* ✅ "없음" 추가 */}
                              <MenuItem value={7}>7일</MenuItem>
                              <MenuItem value={14}>14일</MenuItem>
                              <MenuItem value={30}>30일</MenuItem>
                              <MenuItem value={-1}>영구정지</MenuItem>
                           </Select>

                           <Button
                              variant="contained"
                              color="warning"
                              sx={{ height: '30px', textAlign: 'center', top: '-1px' }}
                              onClick={() => handleApply(row.id, row.reportedUser)} // ✅ 적용 버튼 클릭 시 실행!
                           >
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
