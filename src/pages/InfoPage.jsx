import { useEffect } from 'react'

const InfoPage = () => {
   useEffect(() => {
      window.scrollTo(0, 0) // 페이지가 로드될 때 맨 위로 이동
   }, [])

   return (
      <div style={{ width: '100%', overflowX: 'hidden', textAlign: 'center' }}>
         <div>
            <img src="/img/intro1.png" style={{ width: '100%', height: 'auto', maxWidth: '100vw' }} />
         </div>
         <div>
            <img src="/img/intro2.png" style={{ width: '100%', height: 'auto', maxWidth: '100vw', marginTop: '160px' }} />
         </div>
         <div>
            <img src="/img/intro3.png" style={{ width: '100%', height: 'auto', maxWidth: '100vw', marginTop: '160px' }} />
         </div>
         <div>
            <img src="/img/intro4.png" style={{ width: '100%', height: 'auto', maxWidth: '100vw', marginTop: '160px', marginBottom: '200px' }} />
         </div>
      </div>
   )
}

export default InfoPage
