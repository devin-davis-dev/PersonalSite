exports.handler = async () => {
  const siteId = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;

  if (!siteId || !token) {
    return {
      statusCode: 503,
      body: JSON.stringify({ error: "Missing environment variables" }),
    };
  }

  try {
    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteId}/deploys?per_page=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Netlify API error" }),
      };
    }

    const [deploy] = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        state: deploy?.state ?? "unknown",
        createdAt: deploy?.created_at ?? null,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to fetch deploy status ${err}` }),
    };
  }
};
