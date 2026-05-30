
export async function POST() {
  const response = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/workflows/postgres-backup.yml/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        ref: "main",
      }),
    }
  );

  if (!response.ok) {
    return Response.json(
      { success: false, message: "Failed to start backup" },
      { status: 500 }
    );
  }

  return Response.json({
    success: true,
    message: "Backup started successfully",
  });
}