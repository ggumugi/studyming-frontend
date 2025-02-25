import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBannedUsers, changeBanPeriod } from '../../features/bannedSlice'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Button, Pagination, TextField } from '@mui/material'
import moment from 'moment'

const ActionsTakenBoard = ({ category, isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const { bannedUsers, loading } = useSelector((state) => state.banned)

   const [page, setPage] = useState(1)
   const [rowsPerPage] = useState(8)
   const [searchQuery, setSearchQuery] = useState('')
   const [filter, setFilter] = useState('reportedUser')
   const [editingId, setEditingId] = useState(null)
   const [selectedDate, setSelectedDate] = useState(null)

   useEffect(() => {
      if (isAuthenticated && user?.role === 'ADMIN') {
         dispatch(getBannedUsers()) // ✅ 벤된 유저 목록 불러오기 (관리자만)
      }
   }, [dispatch, isAuthenticated, user])
   // 날짜 변경 핸들러
   const handleDateChange = (event, id) => {
      setSelectedDate(event.target.value)
      setEditingId(id)
   }

   const handleApply = (userId) => {
      if (!selectedDate) {
         alert('🚨 변경할 정지 기간을 선택해주세요.')
         return
      }

      if (!userId) {
         console.error('❌ userId가 존재하지 않습니다.', { userId, newEndDate: selectedDate })
         alert('🚨 오류: 사용자 ID가 존재하지 않습니다.')
         return
      }

      dispatch(changeBanPeriod({ userId, newEndDate: selectedDate }))
         .then(() => {
            alert('✅ 정지 기간이 변경되었습니다.')
            dispatch(getBannedUsers()) // ✅ 변경 후 목록 다시 불러오기
         })
         .catch(() => {
            alert('❌ 정지 기간 변경 실패.')
         })

      setEditingId(null)
      setSelectedDate('')
   }

   // 검색 필터링
   const filteredReports = bannedUsers.map((user) => ({
      id: user.id || null,
      reportedUser: user?.reportedUser ? user.reportedUser.nickname : '알 수 없음',
      reportedBy: user?.reportedBy ? user.reportedBy.nickname : '알 수 없음',
      reason: user.reason ? user.reason : '사유 없음',
      startDate: user.startDate ? new Date(user.startDate).toLocaleDateString() : '없음',
      endDate: user.endDate ? new Date(user.endDate).toLocaleDateString() : '없음',
   }))

   // 페이지네이션 적용
   const paginatedReports = filteredReports.slice((page - 1) * rowsPerPage, page * rowsPerPage)

   return (
      <div style={{ width: '100%' }}>
         <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: 'auto' }}>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell sx={{ width: '10%', fontWeight: 'bold', textAlign: 'center' }}>NO</TableCell>
                     <TableCell sx={{ width: '15%', fontWeight: 'bold', textAlign: 'center' }}>신고된 회원</TableCell>
                     <TableCell sx={{ width: '15%', fontWeight: 'bold', textAlign: 'center' }}>신고한 회원</TableCell>
                     <TableCell sx={{ width: '40%', fontWeight: 'bold', textAlign: 'center' }}>사유</TableCell>
                     <TableCell sx={{ width: '20%', fontWeight: 'bold', textAlign: 'center' }}>정지 기간</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {paginatedReports.length > 0 ? (
                     paginatedReports.map((user, index) => (
                        <TableRow key={user.id || index}>
                           <TableCell sx={{ textAlign: 'center' }}>{index + 1 + (page - 1) * rowsPerPage}</TableCell>
                           <TableCell sx={{ textAlign: 'center' }}>{user?.reportedUser || '알 수 없음'}</TableCell>
                           <TableCell sx={{ textAlign: 'center' }}>{user?.reportedBy || '알 수 없음'}</TableCell>
                           <TableCell sx={{ textAlign: 'center' }}>{user.reason || '사유 없음'}</TableCell>
                           <TableCell sx={{ textAlign: 'center' }}>
                              {editingId === user.userId ? (
                                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <TextField
                                       type="date"
                                       value={selectedDate || user.endDate}
                                       onChange={(e) => handleDateChange(e, user.userId)}
                                       sx={{
                                          width: '110px',
                                          height: '30px',
                                          '& .MuiInputBase-root': { height: '30px' },
                                          '& .MuiInputBase-input': { height: '30px', padding: '0 5px', lineHeight: '30px', fontSize: '14px' },
                                       }}
                                    />
                                    <Button variant="contained" color="warning" sx={{ height: '30px', marginLeft: '10px' }} onClick={() => handleApply(user.userId)}>
                                       적용
                                    </Button>
                                 </div>
                              ) : (
                                 <Button variant="outlined" color="primary" sx={{ width: '120px', height: '30px' }} onClick={() => setEditingId(user.userId)}>
                                    {user.startDate && user.endDate ? `${moment(user.startDate).format('YYYY-MM-DD')} ~ ${moment(user.endDate).format('YYYY-MM-DD')}` : '정지 기간 없음'}
                                 </Button>
                              )}
                           </TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                           검색 결과가 없습니다.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </TableContainer>

         {/* 페이지네이션 */}
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Pagination count={Math.ceil(filteredReports.length / rowsPerPage)} page={page} onChange={(event, value) => setPage(value)} color="warning" shape="rounded" />
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
