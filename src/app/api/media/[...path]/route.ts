import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { isSafeImageName } from "@/lib/site-images";
import { loadSiteImageBytes, mimeForImageName } from "@/lib/site-image-store";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ path: string[] }> };

async function serve(fileName: string) {
  if (!isSafeImageName(fileName)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const stored = await loadSiteImageBytes(fileName);
    if (stored) {
      return new NextResponse(new Uint8Array(stored.bytes), {
        headers: {
          "Content-Type": stored.mime,
          "Cache-Control": "public, max-age=60, must-revalidate",
        },
      });
    }
  } catch {
    // Fall back to files shipped in the repo.
  }

  try {
    const diskPath = join(process.cwd(), "public", "images", ...fileName.split("/"));
    const file = await readFile(diskPath);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": mimeForImageName(fileName),
        "Cache-Control": "public, max-age=3600, must-revalidate",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { path } = await params;
  const fileName = path.map((segment) => decodeURIComponent(segment)).join("/");
  return serve(fileName);
}
