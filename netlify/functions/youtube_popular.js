// netlify/functions/youtube-search.js

const { default: fetch } = require("node-fetch");

exports.handler = async (event) => {
  // 1. 환경 변수에서 API 키를 가져옵니다. (안전하게 숨겨짐)
  const apiKey = process.env.YOUTUBE_API_KEY;

  // 2. 클라이언트에서 전달받은 검색어(query)를 추출합니다.
  const { query } = event.queryStringParameters;

  if (!query) {
    return { statusCode: 400, body: "검색어(query)가 필요합니다." };
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&maxResults=10`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // 3. YouTube API 결과를 클라이언트에 반환합니다.
    return {
      statusCode: 200,
      body: JSON.stringify(data.items),
    };
  } catch (error) {
    console.error("YouTube API 호출 오류:", error);
    return {
      statusCode: 200,
      headers: {
        // ✅ 클라이언트의 정확한 Origin (경로 제외)
        "Access-Control-Allow-Origin": "https://iftype.github.io",

        // 프리플라이트(Preflight) OPTIONS 요청을 허용하기 위해 필수
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",

        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(apiData),
    };
  }
};
