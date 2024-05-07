import { eslint } from "@/cli-utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json();

  return NextResponse.json(await eslint(code));
}
