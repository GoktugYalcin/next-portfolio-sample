export async function getRepoPushedAt(githubUrl: string): Promise<string | null> {
  try {
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/?#]+)/i);
    if (!match) return null;
    const [, owner, repo] = match;

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.pushed_at ?? null;
  } catch (e) {
    return null;
  }
}
