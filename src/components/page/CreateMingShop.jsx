import React, { useEffect, useState } from 'react'
import { Container, Input, Button, Typography, RadioGroup, FormControlLabel, Radio, Box, Select, MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { createItemThunk, updateItemThunk, fetchItems } from '../../features/itemSlice'

const CreateMingShop = () => {
   const { id } = useParams() // ✅ URL에서 ID 가져오기
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const isEditing = Boolean(id) // ✅ ID가 있으면 수정 모드

   const existingItem = useSelector((state) => state.items.items.find((i) => i.id === Number(id)))

   const [formData, setFormData] = useState({
      name: '',
      price: '',
      detail: '',
      limit: '7',
      type: '',

      image: null,
      preview: null,
   })

   useEffect(() => {
      if (isEditing && !existingItem) {
         dispatch(fetchItems())
      } else if (isEditing && existingItem) {
         setFormData({
            name: existingItem.name || '', // 🔹 기본값 설정
            price: existingItem.price ? String(existingItem.price) : '', // 🔹 `price`가 없을 경우 빈 문자열
            detail: existingItem.detail || '',
            limit: existingItem.limit || '7',
            type: existingItem.type || '',
            image: existingItem.img || null,
            preview: existingItem.img ? `http://localhost:8000${existingItem.img}` : null,
         })
      }
   }, [dispatch, existingItem, isEditing])

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.name === 'price' ? String(e.target.value) : e.target.value,
      })
   }

   const handleImageChange = (e) => {
      const file = e.target.files[0]
      setFormData({ ...formData, image: file, preview: URL.createObjectURL(file) })
   }

   const handleSubmit = () => {
      if (!formData.name.trim() || !String(formData.price).trim() || !formData.type || !formData.limit || (!formData.image && !isEditing)) {
         alert('모든 필드를 입력하세요.')
         return
      }

      const newFormData = new FormData()
      newFormData.append('name', formData.name)
      newFormData.append('price', String(formData.price))
      newFormData.append('detail', formData.detail)
      newFormData.append('limit', formData.limit)
      newFormData.append('type', formData.type)

      if (formData.image) {
         newFormData.append('img', formData.image)
      } else if (isEditing) {
         newFormData.append('img', formData.preview) // 🔹 기존 이미지 유지
      }

      if (isEditing) {
         dispatch(updateItemThunk({ id, updatedData: newFormData }))
            .then(() => {
               alert('상품이 수정되었습니다!')
               navigate('/mingshop')
            })
            .catch((error) => {
               console.error('❌ 수정 실패:', error)
               alert('수정 실패')
            })
      } else {
         dispatch(createItemThunk(newFormData))
            .then(() => {
               alert('상품이 등록되었습니다!')
               navigate('/mingshop')
            })
            .catch((error) => {
               console.error('❌ 등록 실패:', error)
               alert('등록 실패')
            })
      }
   }

   return (
      <Container maxWidth="lg" sx={{ mt: 6, height: '1000px' }}>
         <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
            {isEditing ? '상품 수정' : '새로운 밍샵 상품 등록'}
         </Typography>
         <Box sx={{ borderBottom: '2px solid orange', width: '100%', mb: 4 }} />

         {/* 상품명 */}
         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '550px', gap: '20px', mb: 3, marginBottom: '50px' }}>
               <Typography sx={{ width: '230px' }}>상품명</Typography>
               <Input fullWidth value={formData.name} onChange={handleChange} name="name" />
            </Box>

            {/* 판매 가격 */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: '550px', gap: '20px', mb: 3, marginBottom: '50px' }}>
               <Typography sx={{ width: '230px' }}>판매가(밍)</Typography>
               <Input fullWidth type="number" value={formData.price} onChange={handleChange} name="price" />
            </Box>

            {/* ✅ 상품 이미지 업로드 */}
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
                     {formData.preview ? <img src={formData.preview} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : <Typography color="gray">이미지 미리보기</Typography>}
                  </Box>
               </Box>
               <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '176px', mt: 1 }}>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="image-upload" />
                  <label htmlFor="image-upload">
                     <Button variant="contained" component="span" color="warning">
                        등록
                     </Button>
                  </label>
               </Box>
            </Box>

            {/* ✅ 상품 제한 설정 */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: '550px', gap: '20px', mb: 3, marginBottom: '50px' }}>
               <Typography sx={{ width: '156px' }}>상품 기한</Typography>
               <Typography>7일</Typography>
            </Box>

            {/* ✅ 상품 상세설명 */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: '550px', gap: '20px', mb: 3, marginBottom: '50px' }}>
               <Typography sx={{ width: '230px' }}>상품 상세설명</Typography>
               <Input fullWidth multiline rows={1} value={formData.detail} onChange={handleChange} name="detail" sx={{ height: '40px', borderBottom: '1px solid #ccc' }} />
            </Box>

            {/* ✅ 상품 유형 선택 */}
            <Box sx={{ display: 'flex', width: '550px', gap: '20px', mb: 3, height: '40px' }}>
               <Typography sx={{ width: '230px' }}>상품 유형</Typography>
               <Select fullWidth value={formData.type} onChange={handleChange} name="type">
                  <MenuItem value="emoticon">이모티콘</MenuItem>
                  <MenuItem value="decoration">채팅방 테마</MenuItem>
                  <MenuItem value="cash">포인트 충전</MenuItem>
               </Select>
            </Box>

            {/* ✅ 등록 / 수정 버튼 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '550px', mt: 4 }}>
               <Button variant="contained" color="warning" onClick={handleSubmit} sx={{ width: '400px', height: '50px', fontSize: '16px', fontWeight: 'bold' }}>
                  {isEditing ? '상품 수정' : '상품 등록'}
               </Button>
            </Box>
         </Box>
      </Container>
   )
}

export default CreateMingShop
