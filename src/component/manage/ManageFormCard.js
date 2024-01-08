import { useEffect } from "react"
import { AtomCardView, BACKENDURL } from "../common/Common";
import CardView from "./CardView";
import { useRecoilState } from "recoil";

const ManageFormCard = () => {
  const receiptMap = new Map();
  const [cardView, setCardView] = useRecoilState(AtomCardView);

  useEffect(()=>{
    setCardView("");

    fetch(BACKENDURL+"/api/private/receipt/getPageReceipt?orderCriteria=createDate",{
      headers : {
        "Authorization" : sessionStorage.getItem("token"),
        "Content-Type" : "application/json",
      }
    })
    .then(res => {
      if(res.status === 200){
        return res.json();
      }
    })
    .then(data => {
      data.content = data.content.reverse();
      data.content.map(item => {
        if(item.receiptDocumentId){
          if(!receiptMap.has(item.receiptDocumentId))
            receiptMap.set(item.receiptDocumentId, [item])
          else
            receiptMap.get(item.receiptDocumentId).push(item);
        }
      })
      receiptMap.forEach((item,idx) => {
        setCardView(prevItem => [...prevItem, <CardView key={`key${idx}`} data={item}/>])
      })
    })
    .catch(e => {
      console.log(e);
    })
    
  },[])

  return (
    <div className="border border-black w-full h-fit p-4 sm:p-5 rounded-xl shadow-md sm:text-base text-[70%]">
      <div className="w-full flex flex-col items-center mt-5 mb-10">
        <p>변환된 영수증을 카드 형태로 제공합니다</p>
        <p>영수증 추가, 수정 및 엑셀 변환은 테이블 형태에서만 가능합니다</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cardView}
      </div>
    </div>
  )
}

export default ManageFormCard