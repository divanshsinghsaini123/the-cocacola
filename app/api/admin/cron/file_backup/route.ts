
export async function POST() {
    const response = await fetch(
        `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/workflows/GcoreToGdrive.yml/dispatches`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
            body: JSON.stringify({
                ref: process.env.GITHUB_BRANCH || "digitaloccean",
            }),
        }
    );

    if (!response.ok) {
        return Response.json(
            { success: false, message: "Failed to start file backup" },
            { status: 500 }
        );
    }

    return Response.json({
        success: true,
        message: "File backup started successfully",
    });
}