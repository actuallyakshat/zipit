import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { Room } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const tenMinutesAgo = new Date(Date.now() - 1 * 60 * 1000);
    console.log("tenMinutesAgo", tenMinutesAgo);

    const expiredRooms = await prisma.room.findMany({
      where: {
        createdAt: {
          lt: tenMinutesAgo,
        },
      },
    });

    console.log("expiredRooms", expiredRooms);

    const roomIds = expiredRooms.map((room: Room) => room.id);
    await prisma.room.deleteMany({
      where: {
        id: {
          in: roomIds,
        },
      },
    });
    console.log("roomIds", roomIds);
    return NextResponse.json(
      { message: "Expired rooms deleted." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting expired rooms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
