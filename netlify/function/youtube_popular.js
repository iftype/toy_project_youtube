const API_ENDPOINT = "https://www.googleapis.com/youtube/v3/videos";
const API_KEY = process.env.YOUTUBE_API_KEY;

exports.handler = async function (event, context) {
  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API Key is missing." }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(data.items),
  };
};
