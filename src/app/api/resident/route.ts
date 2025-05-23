import { NextRequest, NextResponse } from "next/server"

const BASE = "https://www.eyagi.co.kr/ReJoin/action"
const HEADERS = { "Content-Type": "application/x-www-form-urlencoded" }

// 공통 fetch 함수
async function getJson(url: string, opt: RequestInit = {}) {
  const res = await fetch(url, {
    headers: HEADERS,
    ...opt,
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function POST(request: NextRequest) {
  try {
    // 클라이언트 요청 파싱
    const { cust_name, jumin_no, pay_typ = "02", mno_gubun = "SKT" } = await request.json() as {
      cust_name: string
      jumin_no: string
      pay_typ?: string
      mno_gubun?: string
    }

    // 필수값 검증
    if (!cust_name || !jumin_no) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    // 1단계: req_no 요청
    type AgreeResponse = {
     req_no: string;
    };
    const { req_no } = await getJson<AgreeResponse>(`${BASE}/onlineJoin_agree_json.php`);
    if (!req_no) {
      return NextResponse.json({ error: "req_no를 가져오지 못했습니다." }, { status: 500 })
    }

    // 2단계: 실명 인증 요청
    const formData = new URLSearchParams({
      cust_name,
      jumin_no,
      pay_typ,
      mno_gubun,
      req_no,
    })

    const result = await getJson(`${BASE}/onlineJoin_realNameChk_json2.php`, {
      method: "POST",
      body: formData,
    })

    return NextResponse.json({ success: true, result, req_no })
  } catch (error) {
    console.error("API 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다",
      },
      { status: 500 }
    )
  }
}
