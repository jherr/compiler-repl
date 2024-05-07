import { babel } from "@/cli-utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code, config } = await req.json();

  return NextResponse.json(await babel(code, config));
}
