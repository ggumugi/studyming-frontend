import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Select, MenuItem, Button, Pagination } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPointHistory } from '../../features/pointSlice'

const MyPay = () => {
   const dispatch = useDispatch()
   const { history, loading, error } = useSelector((state) => state.points)

   const [page, setPage] = useState(1)
   const [rowsPerPage, setRowsPerPage] = useState(10)

   const typeMapping = {
      use: '사용',
      stack: '적립',
      charge: '충전',
   }
   useEffect(() => {
      dispatch(fetchPointHistory())
   }, [dispatch])

   const handleChangePage = (event, newPage) => {
      setPage(newPage)
   }
   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10))
      setPage(0)
   }

   // 🔹 포인트 선물 내역에서 금액을 추출하는 함수
   const extractAmountFromTitle = (title) => {
      const match = title.match(/(\d+)밍/) // 정규식으로 "100밍" 같은 숫자 추출
      return match ? `${match[1]}밍` : 'N/A'
   }

   return (
      <>
         <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: 'auto' }}>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell sx={{ width: '10%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        NO
                     </TableCell>
                     <TableCell sx={{ width: '30%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        내역
                     </TableCell>
                     {/* ✅ 제목을 넓게 */}
                     <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        포인트
                     </TableCell>
                     <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        잔여포인트
                     </TableCell>
                     <TableCell sx={{ width: '10%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        종류
                     </TableCell>
                     <TableCell sx={{ width: '20%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        날짜
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {loading ? (
                     <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                           로딩 중...
                        </TableCell>
                     </TableRow>
                  ) : error ? (
                     <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center', color: 'red' }}>
                           {error}
                        </TableCell>
                     </TableRow>
                  ) : history.length > 0 ? (
                     history.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((his, index) => (
                        <TableRow key={his.id}>
                           <TableCell sx={{ width: '10%', textAlign: 'center' }}>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                           <TableCell sx={{ width: '30%', textAlign: 'center' }}>{his.itemName || his.history}</TableCell>
                           {/* 🔹 포인트 컬럼에서 값이 없을 경우, 제목에서 금액을 자동 추출 */}
                           <TableCell sx={{ width: '15%', textAlign: 'center' }}>{his.itemPrice !== null ? `${his.itemPrice}밍` : extractAmountFromTitle(his.history)}</TableCell>
                           <TableCell sx={{ width: '15%', textAlign: 'center' }}>{his.restPoint || 'N/A'}</TableCell>
                           <TableCell sx={{ width: '10%', textAlign: 'center' }}>{typeMapping[his.type] || '기타'}</TableCell>
                           <TableCell sx={{ width: '20%', textAlign: 'center' }}>{new Date(his.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                           내역이 없습니다.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </TableContainer>

         {/* 페이지네이션 */}
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Pagination
               count={Math.ceil(history.length / rowsPerPage)} // 총 페이지 수
               page={page}
               onChange={handleChangePage}
               color="warning"
               shape="rounded"
            />
         </div>
      </>
   )
}

export default MyPay
