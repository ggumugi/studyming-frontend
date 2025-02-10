import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Select, MenuItem, Button, Pagination } from '@mui/material'
const initialHistory = [
   { id: 8, history: '500밍 구매', use: 500, point: 900, type: '결제', date: '2025-02-01' },
   { id: 7, history: '흔내는 토끼 이모티콘 구매', use: -100, point: 400, type: '밍 사용', date: '2025-01-28' },
   { id: 6, history: '채팅방 자색고구마 세트 구매', use: -100, point: 500, type: '밍 사용', date: '2025-01-20' },
   { id: 5, history: '채팅방 토마토 세트 구매', use: -100, point: 600, type: '밍 사용', date: '2025-01-09' },
   { id: 4, history: '흔내는 토끼 이모티콘2 구매', use: -100, point: 700, type: '밍 사용', date: '2025-01-06' },
   { id: 3, history: '흔내는 토끼 이모티콘 구매', use: -100, point: 800, type: '밍 사용', date: '2025-01-06' },
   { id: 2, history: '쇼핑캐릭터 토끼 이모티콘 구매', use: -100, point: 900, type: '밍 사용', date: '2025-01-05' },
   { id: 1, history: '흔내는 토끼 이모티콘 구매', use: -100, point: 1000, type: '밍 사용', date: '2025-01-02' },
]

const MyPay = () => {
   const [history, setHistory] = useState(initialHistory)
   const [page, setPage] = useState(1)
   const [rowsPerPage, setRowsPerPage] = useState(10)

   const handleChangePage = (event, newPage) => {
      setPage(newPage)
   }
   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10))
      setPage(0)
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
                     </TableCell>{' '}
                     {/* ✅ 제목을 넓게 */}
                     <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        포인트
                     </TableCell>
                     <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        잔여포인트
                     </TableCell>
                     <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        종류
                     </TableCell>
                     <TableCell sx={{ width: '15%' }} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        날짜
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {history.map((his) => (
                     <TableRow key={his.id}>
                        <TableCell sx={{ width: '10%', textAlign: 'center' }}>{his.id}</TableCell>
                        <TableCell sx={{ width: '30%', textAlign: 'center' }}>{his.history}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{his.use}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{his.point}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{his.type}</TableCell>
                        <TableCell sx={{ width: '15%', textAlign: 'center' }}>{his.date}</TableCell>
                     </TableRow>
                  ))}
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
