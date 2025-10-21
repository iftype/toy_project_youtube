// netlify/functions/youtube-search.js
const { default: fetch } = require("node-fetch");

exports.handler = async (event) => {
  // ✅ 공통 CORS 헤더
  const headers = {
    "Access-Control-Allow-Origin": "https://iftype.github.io", // 정확한 Origin만 허용
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // ✅ OPTIONS 요청 처리 (Preflight)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "OK",
    };
  }

  // ✅ GET 요청만 허용
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: "Method Not Allowed",
    };
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const { query } = event.queryStringParameters;

  if (!query) {
    return { statusCode: 400, headers, body: "검색어(query)가 필요합니다." };
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&maxResults=10`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers, // ✅ 성공 응답에도 반드시 포함
      body: JSON.stringify(data.items),
    };
  } catch (error) {
    console.error("YouTube API 호출 오류:", error);
    return {
      statusCode: 500,
      headers, // ✅ 실패 응답에도 포함
      body: JSON.stringify({ error: "서버 오류", detail: error.message }),
    };
  }
};
