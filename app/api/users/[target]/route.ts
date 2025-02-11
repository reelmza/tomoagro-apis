import prisma from "@/utils/PrismaClient";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ target: string }> }
) => {
  const target = (await params).target;
  const sectors = ["canteen", "health", "loans", "finance"];
  const targetIsSector = sectors.find((sector) => sector === target);

  try {
    if (targetIsSector) {
      const targetUser = await prisma.user.findMany({
        where: {
          sector: target,
        },
      });

      return NextResponse.json(targetUser);
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        staffId: "TMG/25/" + target,
      },
    });

    if (!targetUser) {
      return NextResponse.json("User(s) does not exist", { status: 404 });
    }

    return NextResponse.json(targetUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json("Server Error");
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ target: string }> }
) => {
  const body = await req.json();
  const target = (await params).target;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        staffId: "TMG/25/" + target,
      },

      data: body,
    });

    console.log(updatedUser);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json("Server Errror");
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ target: string }> }
) => {
  const target = (await params).target;

  try {
    await prisma.user.delete({
      where: {
        staffId: "TMG/25/" + target,
      },
    });

    return NextResponse.json("User deleted successfully", { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Server Errror");
  }
};
