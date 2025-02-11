/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/utils/PrismaClient";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const body = await req.json();

  try {
    let result;

    await prisma.$transaction(async (tx) => {
      // Get user
      const targetUser = await tx.user.findUnique({
        where: {
          staffId: body.staffId,
        },

        select: {
          balance: true,
        },
      });

      // Handle no user
      if (!targetUser) {
        result = "This user does not exist";
        return;
      }

      // Credit user
      if (body.type === "credit") {
        // Credit customer
        await tx.user.update({
          where: {
            staffId: body.staffId,
          },
          data: {
            balance: targetUser!.balance! + body.amount,
          },
        });

        // Record transaction
        result = await tx.transaction.create({
          data: { ...body, status: "successful" },
        });
        return;
      }

      // Debit user
      // Confirm if sufficient balance
      if (targetUser!.balance! < body.amount) {
        result = await tx.transaction.create({
          data: { ...body, status: "failed" },
        });

        return;
      }

      // Charge customer
      await tx.user.update({
        where: {
          staffId: body.staffId,
        },
        data: {
          balance: targetUser!.balance! - body.amount,
        },
      });

      // Create transaction
      result = await tx.transaction.create({
        data: { ...body, status: "successful" },
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json("Server error");
  }
};

export const GET = async () => {
  try {
    const transactions = await prisma.transaction.findMany();
    return NextResponse.json(transactions);
  } catch (error) {
    console.log(error);
    return NextResponse.json("Server error");
  }
};
