import prisma from "@/utils/PrismaClient";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ target: string }> }
) => {
  const target = (await params).target;
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        staffId: "TMG/25/" + target,
      },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.log(error);
    return NextResponse.json("Server error");
  }
};
