export default async function () {
  const token = process.env.NETLIFY_API_TOKEN;
  const formId = process.env.NETLIFY_COMMENTS_FORM_ID;
  if (!token || !formId) return {};

  try {
    const submissions = [];
    for (let page = 1; ; page++) {
      const res = await fetch(
        `https://api.netlify.com/api/v1/forms/${formId}/submissions?per_page=100&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`Netlify API responded ${res.status}`);
      const batch = await res.json();
      submissions.push(...batch);
      if (batch.length < 100) break;
    }

    const byPath = {};
    submissions
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .forEach(({ data, created_at }) => {
        if (!data?.path || !data?.comment) return;
        (byPath[data.path] ||= []).push({
          name: data.name || "Anonymous",
          comment: data.comment,
          created_at: new Date(created_at),
        });
      });
    return byPath;
  } catch (err) {
    console.warn(`[comments] Could not load comments: ${err.message}`);
    return {};
  }
}
