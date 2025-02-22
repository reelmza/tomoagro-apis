import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/PrismaClient";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { fullName, gender, sector, password, housing, salary } = body;

  try {
    // Get user count
    const userCount = (await prisma.user.count()) + 1;
    const userCountFormatted =
      userCount > 9 ? "0" + userCount : "00" + userCount;
    const staffId = "TMG/25/" + userCountFormatted;

    // Attempt creating user
    const newUser = await prisma.user.create({
      data: {
        fullName,
        gender,
        sector,
        staffId,
        password,
        housing,
        salary,
      },
    });

    console.log(newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Server Error");
  }
};

export const GET = async () => {
  try {
    const targetUser = await prisma.user.findMany();
    return NextResponse.json(targetUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json("Server Error");
  }
};
