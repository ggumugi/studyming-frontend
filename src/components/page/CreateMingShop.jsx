import React, { useState } from 'react'
import { Container, Input, Button, Typography, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material'
import { useDispatch } from 'react-redux'
import { createItemThunk } from '../../features/itemSlice'
import { useNavigate } from 'react-router-dom'

const CreateMingShop = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [productName, setProductName] = useState('')
   const [price, setPrice] = useState('')
   const [description, setDescription] = useState('')
   const [type, setType] = useState('emoticon')
   const [image, setImage] = useState(null)
   const [status, setStatus] = useState('판매중')
   const [preview, setPreview] = useState(null)

   // ✅ 이미지 업로드 핸들러
   const handleImageChange = (e) => {
      const file = e.target.files[0]
      setImage(file) // 기존 코드 (파일 저장)
      setPreview(URL.createObjectURL(file)) // ✅ 미리보기 URL 생성
   }

   // ✅ 상품 등록 핸들러
   const handleSubmit = () => {
      if (!productName.trim() || !price.trim() || !image) {
         alert('상품명, 가격, 이미지를 입력하세요.')
         return
      }

      const formData = new FormData()
      formData.append('name', productName)
      formData.append('price', price)
      formData.append('detail', description)
      formData.append('limit', 7) // 기본 7일
      formData.append('type', type)
      formData.append('img', image) // 파일 추가

      dispatch(createItemThunk(formData)).then(() => {
         alert('상품이 등록되었습니다!') // ✅ 등록 성공 알림
         navigate('/mingshop') // ✅ MingShopPage로 이동
      })
   }
   return (
      <Container maxWidth="lg" sx={{ mt: 6, height: '1000px' }}>
         {/* 제목 - 왼쪽 정렬 */}
         <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
            새로운 밍샵 상품 등록
         </Typography>
         <Box sx={{ borderBottom: '2px solid orange', width: '100%', mb: 4 }} />

         {/* 입력 폼 - 전체 가운데 정렬 */}
         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* 상품명 */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: '550px', gap: '20px', mb: 3, marginBottom: '50px' }}>
               <Typography sx={{ width: '230px' }}>상품명</Typography>
               <Input fullWidth value={productName} onChange={(e) => setProductName(e.target.value)} sx={{ height: '40px', borderBottom: '1px solid #ccc' }} />
            </Box>

            {/* 판매 가격 */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: '550px', gap: '20px', mb: 3, marginBottom: '50px' }}>
               <Typography sx={{ width: '230px' }}>판매가(밍)</Typography>
               <Input fullWidth type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ height: '40px', borderBottom: '1px solid #ccc' }} />
            </Box>

            {/* 상품 이미지 업로드 + 미리보기 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '550px', gap: '12px', mb: 4, marginBottom: '50px' }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Typography sx={{ width: '155px' }}>상품 이미지</Typography>

                  {/* 이미지 미리보기 박스 */}
                  <Box
                     sx={{
                        width: '373px',
                        height: '250px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8f8f8',
                     }}
                  >
                     {preview ? <img src={preview} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : <Typography color="gray">이미지 미리보기</Typography>}
                  </Box>
               </Box>

               {/* 이미지 등록 버튼 (미리보기 아래) */}
               <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '176px', mt: 1 }}>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="image-upload" />
                  <label htmlFor="image-upload">
                     <Button variant="contained" component="span" color="warning">
                        등록
                     </Button>
                  </label>
               </Box>
            </Box>

            {/* 상품 기한 */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: '550px', gap: '20px', mb: 3, marginBottom: '50px' }}>
               <Typography sx={{ width: '156px' }}>상품 기한</Typography>
               <Typography>7일</Typography>
            </Box>

            {/* 상품 상세 설명 */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: '550px', gap: '20px', mb: 3, marginBottom: '50px' }}>
               <Typography sx={{ width: '230px' }}>상품 상세설명</Typography>
               <Input fullWidth multiline rows={1} value={description} onChange={(e) => setDescription(e.target.value)} sx={{ height: '40px', borderBottom: '1px solid #ccc' }} />
            </Box>

            {/* 상품 상태 선택 */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: '550px', gap: '20px', mb: 3 }}>
               <Typography sx={{ width: '156px' }}>상품 상태</Typography>
               <RadioGroup row value={status} onChange={(e) => setStatus(e.target.value)} sx={{ gap: '20px' }}>
                  <FormControlLabel value="판매중" control={<Radio />} label="판매중" />
                  <FormControlLabel value="품절" control={<Radio />} label="품절" />
               </RadioGroup>
            </Box>
            <select value={type} onChange={(e) => setType(e.target.value)}>
               <option value="emoticon">이모티콘</option>
               <option value="decoration">채팅방 테마</option>
               <option value="cash">포인트 충전</option>
            </select>

            {/* 상품 등록 버튼 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '550px', mt: 4 }}>
               <Button variant="contained" color="warning" onClick={handleSubmit} sx={{ width: '400px', height: '50px', fontSize: '16px', fontWeight: 'bold' }}>
                  상품 등록
               </Button>
            </Box>
         </Box>
      </Container>
   )
}

export default CreateMingShop
