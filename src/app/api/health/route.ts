// Liveness and build identity for the Coolify healthcheck and the deploy
// workflow. `commit` lets a deploy prove that the build it shipped is the one
// actually answering (GIT_COMMIT is set in the image's runner stage).
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { status: "ok", commit: process.env.GIT_COMMIT ?? "unknown" },
    { headers: { "cache-control": "no-store" } },
  );
}
