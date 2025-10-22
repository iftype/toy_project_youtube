// netlify/functions/youtube_popular.js
const { default: fetch } = require("node-fetch");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://iftype.github.io", // ✅ 정확히 지정
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // ✅ OPTIONS 요청 (CORS Preflight)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "OK",
    };
  }

  // ✅ GET만 허용
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const { query } = event.queryStringParameters || {};

  if (!query) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "검색어(query)가 필요합니다." }),
    };
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
    query
  )}&key=${apiKey}&maxResults=10`;

  try {
    const response = await fetch(url);

    // ✅ YouTube API 응답이 실패했을 때 처리
    if (!response.ok) {
      const text = await response.text();
      console.error("YouTube API 에러 응답:", text);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: "YouTube API 실패", detail: text }),
      };
    }

    const data = await response.json();
    const items = data.items || []; // ✅ 항상 배열 반환

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(items),
    };
  } catch (error) {
    console.error("YouTube API 호출 중 오류:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "서버 오류", detail: error.message }),
    };
  }
};
