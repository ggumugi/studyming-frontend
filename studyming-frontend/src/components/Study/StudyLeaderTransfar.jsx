//위임변경하는 창

//내일 와서 ui디자인 변경
import React, { useState } from 'react'

const StudyLeaderTransfer = ({ members, onTransfer, onCancel }) => {
   const [selectedMember, setSelectedMember] = useState(null)

   return (
      <div>
         <h2>스터디 방장 위임</h2>
         <hr />
         <p>방장 권한을 위임할 멤버를 선택하세요:</p>

         <ul>
            {members.map((member) => (
               <li key={member.id}>
                  <input type="radio" name="leader" value={member.id} onChange={() => setSelectedMember(member.id)} />
                  {member.name}
               </li>
            ))}
         </ul>

         <button onClick={() => onTransfer(selectedMember)} disabled={!selectedMember}>
            스터디 방장 위임
         </button>
         <button onClick={onCancel}>취소</button>
      </div>
   )
}

export default StudyLeaderTransfer
