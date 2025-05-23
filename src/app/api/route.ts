import { NextRequest, NextResponse } from "next/server"

const BASE = "https://www.eyagi.co.kr/ReJoin/action"
const HEADERS = { "Content-Type": "application/x-www-form-urlencoded" }

// API 요청 함수
async function getJson(url: string, opt: RequestInit = {}) {
  const res = await fetch(url, { 
    headers: HEADERS, 
    ...opt 
  })
  
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function POST(request: NextRequest) {
  try {
    // 클라이언트로부터 데이터 받기
   const { cust_name, jumin_no, pay_typ, mno_gubun } = await request.json() as {
   cust_name: string;
   jumin_no: string;
   pay_typ: string;
   mno_gubun: string;
   };
    
    // 필수 파라미터 검증
    if (!cust_name || !jumin_no) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      )
    }

    // 첫 번째 API 호출하여 req_no 가져오기
    const { req_no } = await getJson(`${BASE}/onlineJoin_agree_json.php`)
    
    if (!req_no) {
      return NextResponse.json(
        { error: "req_no를 가져오는데 실패했습니다." },
        { status: 500 }
      )
    }

    // 폼 데이터 생성
    const formData = new URLSearchParams()
    formData.append("cust_name", cust_name)
    formData.append("jumin_no", jumin_no)
    formData.append("pay_typ", pay_typ || "02") // 기본값 설정
    formData.append("mno_gubun", mno_gubun || "SKT") // 기본값 설정
    formData.append("req_no", req_no)

    // 두 번째 API 호출
    const result = await getJson(`${BASE}/onlineJoin_realNameChk_json2.php`, {
      method: "POST",
      body: formData,
    })

    // 결과 반환
    return NextResponse.json({
      success: true,
      result,
      req_no
    })
  } catch (error) {
    console.error("API 오류:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다" 
      },
      { status: 500 }
    )
  }
}
