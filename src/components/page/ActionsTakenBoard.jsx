import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBannedUsers, changeBanPeriod } from '../../features/bannedSlice'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Button, Pagination, TextField } from '@mui/material'
import moment from 'moment'

const ActionsTakenBoard = ({ category, isAuthenticated, user }) => {
   const dispatch = useDispatch()
   // const { bannedUsers, loading } = useSelector((state) => state.banned)
   const bannedUsersFromStore = useSelector((state) => state.banned.bannedUsers)
   const [bannedUsers, setBannedUsers] = useState([]) // ✅ 상태 추가
   const [page, setPage] = useState(1)
   const [rowsPerPage] = useState(8)
   const [searchQuery, setSearchQuery] = useState('')
   const [filter, setFilter] = useState('reportedUser')
   const [editingId, setEditingId] = useState(null)
   const [selectedDates, setSelectedDates] = useState(null) // ✅ 개별 행의 날짜 상태 저장
   const formatDate = (date) => {
      return date ? moment(date).format('YY-MM-DD') : '날짜 없음'
   }
   useEffect(() => {
      if (isAuthenticated && user?.role === 'ADMIN') {
         dispatch(getBannedUsers()) // ✅ 벤된 유저 목록 불러오기
      }
   }, [dispatch, isAuthenticated, user])

   useEffect(() => {
      console.log('🚀 [DEBUG] Redux에서 받은 bannedUsers:', bannedUsersFromStore)
      setBannedUsers(bannedUsersFromStore)

      if (bannedUsersFromStore.length > 0) {
         bannedUsersFromStore.forEach((user, index) => {
            console.log(`✅ bannedUsers[${index}]:`, user)
         })
      }
   }, [bannedUsersFromStore])

   // ✅ 개별 유저의 날짜만 업데이트하는 핸들러
   const handleDateChange = (event, bannedId) => {
      const newDate = event.target.value
      setSelectedDates((prevDates) => ({
         ...prevDates,
         [bannedId]: newDate, // 특정 bannedId에 대해 날짜 저장
      }))
      setEditingId(bannedId)
   }

   // ✅ 정지 기간 변경 요청
   const handleApply = async (bannedId) => {
      console.log('🚀 [DEBUG] handleApply 실행 - 전달된 bannedId:', bannedId)

      if (!bannedId) {
         console.error('❌ handleApply 호출 시 bannedId가 undefined입니다!', bannedId)
         alert('🚨 오류: bannedId가 존재하지 않습니다.')
         return
      }

      const selectedUser = bannedUsers.find((user) => user.bannedId === bannedId)
      console.log('🚀 [DEBUG] selectedUser:', selectedUser)

      if (!selectedUser) {
         alert('🚨 해당 유저의 정지 기록을 찾을 수 없습니다.')
         return
      }

      // ✅ 여기서 변경된 날짜를 `selectedDates`에서 가져와야 함!
      const selectedDate = selectedDates?.[bannedId] || selectedUser.endDate
      console.log('🚀 [DEBUG] 선택된 날짜:', selectedDate)

      if (!selectedDate) {
         alert('🚨 변경할 정지 기간을 선택해주세요.')
         return
      }

      try {
         await dispatch(changeBanPeriod({ bannedId, newEndDate: selectedDate })).unwrap()
         // await dispatch(getBannedUsers())
         alert('✅ 정지 기간이 변경되었습니다.')
      } catch (error) {
         console.error('❌ 정지 기간 변경 실패:', error)
         alert('❌ 정지 기간 변경에 실패했습니다.')
      }

      setEditingId(null)
   }

   const handleSearch = () => {
      setPage(1) // 검색 시 첫 페이지로 이동
   }

   // 검색 필터링
   const filteredBannedUsers = bannedUsers.filter((user) => {
      if (filter === 'reportedUser' && user.reportedUser?.nickname) return user.reportedUser.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      if (filter === 'reportedBy' && user.reportedBy?.nickname) return user.reportedBy.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      if (filter === 'reason') return user.reason.toLowerCase().includes(searchQuery.toLowerCase())
      return false
   })

   // 페이지네이션 적용
   const paginatedReports = filteredBannedUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage)

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
                        <TableRow key={user.bannedId || index}>
                           <TableCell sx={{ textAlign: 'center' }}>{index + 1 + (page - 1) * rowsPerPage}</TableCell>
                           <TableCell sx={{ textAlign: 'center' }}>{user.reportedUser?.nickname || '알 수 없음'}</TableCell>
                           <TableCell sx={{ textAlign: 'center' }}>{user.reportedBy?.nickname || '알 수 없음'}</TableCell>
                           <TableCell sx={{ textAlign: 'center' }}>{user.reason || '사유 없음'}</TableCell>
                           <TableCell sx={{ textAlign: 'center' }}>
                              {editingId === user.bannedId ? (
                                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <TextField
                                       type="date"
                                       value={user.endDate ? moment(user.endDate).format('YYYY-MM-DD') : ''}
                                       onChange={(e) => handleDateChange(e, user.bannedId)}
                                       sx={{
                                          width: '110px',
                                          height: '30px',
                                          '& .MuiInputBase-root': { height: '30px' },
                                          '& .MuiInputBase-input': {
                                             height: '30px',
                                             padding: '0 5px',
                                             lineHeight: '30px',
                                             fontSize: '14px',
                                          },
                                       }}
                                    />

                                    <Button
                                       variant="contained"
                                       color="warning"
                                       sx={{ height: '30px', marginLeft: '10px' }}
                                       onClick={() => {
                                          console.log('🚀 [DEBUG] 클릭한 유저 데이터:', user)
                                          handleApply(user.bannedId)
                                       }}
                                    >
                                       적용
                                    </Button>
                                 </div>
                              ) : (
                                 <Button variant="outlined" color="blue" sx={{ width: '120px', height: '30px' }} onClick={() => setEditingId(user.bannedId)}>
                                    <TableCell sx={{ textAlign: 'center', fontSize: '12px', lineHeight: '1.2' }}>
                                       {user.startDate && user.endDate ? (
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px', lineHeight: '1.2' }}>
                                             <span>{formatDate(user.startDate)}</span>
                                             <span>{formatDate(user.endDate)}</span>
                                          </div>
                                       ) : (
                                          '정지 기간 없음'
                                       )}
                                    </TableCell>
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
            <Pagination count={Math.ceil(filteredBannedUsers.length / rowsPerPage)} page={page} onChange={(event, value) => setPage(value)} color="warning" shape="rounded" />
         </div>

         {/* 검색 필터 */}
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Select value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ width: '165px' }}>
               <MenuItem value="reportedUser">신고된 회원</MenuItem>
               <MenuItem value="reportedBy">신고한 회원</MenuItem>
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

export default ActionsTakenBoard
