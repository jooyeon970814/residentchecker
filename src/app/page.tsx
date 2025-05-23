"use client"

import type React from "react"

import { useState } from "react"

export default function CustomerForm() {
  const [formData, setFormData] = useState({
    cust_name: "",
    jumin_no: "",
    pay_typ: "02",
    mno_gubun: "SKT",
    req_no: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<null | any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // 여기서 Cloudflare Worker로 데이터를 전송할 수 있습니다
      // 예시 코드입니다 - 실제 구현시 엔드포인트를 변경해주세요
      const response = await fetch("/api/submit-customer-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("데이터 제출 중 오류가 발생했습니다")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h1 className="text-xl font-bold text-center">고객 정보 입력</h1>
          <p className="text-sm text-center text-blue-100">Customer Information Form</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="cust_name" className="block text-sm font-medium text-gray-700 mb-1">
              고객명 (Customer Name)
            </label>
            <input
              type="text"
              id="cust_name"
              name="cust_name"
              value={formData.cust_name}
              onChange={handleChange}
              required
              placeholder="이름"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="jumin_no" className="block text-sm font-medium text-gray-700 mb-1">
              주민번호 (ID Number)
            </label>
            <input
              type="text"
              id="jumin_no"
              name="jumin_no"
              value={formData.jumin_no}
              onChange={handleChange}
              required
              placeholder="1234"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
           <input
              type="text"
              id="pay_typ"
              name="pay_typ"
              value={formData.jumin_no}
              onChange={handleChange}
              required
              placeholder="1234"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 hidden"
            />
          </div>

          <div>
            <label htmlFor="mno_gubun" className="block text-sm font-medium text-gray-700 mb-1">
              통신사 (Mobile Carrier)
            </label>
            <select
              id="mno_gubun"
              name="mno_gubun"
              value={formData.mno_gubun}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="SKT">SKT</option>
              <option value="KT">KT</option>
              <option value="LGU+">LGU+</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "제출 중..." : "제출하기 (Submit)"}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 border-t border-green-200">
            <h3 className="font-medium text-green-800 mb-2">제출 완료 (Submission Complete)</h3>
            <pre className="text-xs bg-white p-2 rounded border border-green-200 overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
