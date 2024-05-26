import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { Room } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const tenMinutesAgo = new Date(Date.now() - 1 * 60 * 1000);
    console.log("tenMinutesAgo:", tenMinutesAgo);

    const expiredRooms = await prisma.room.findMany({
      where: {
        createdAt: {
          lt: tenMinutesAgo,
        },
      },
    });

    console.log("expiredRooms:", expiredRooms);

    const roomIds = expiredRooms.map((room: Room) => room.id);
    if (roomIds.length > 0) {
      const deleteResult = await prisma.room.deleteMany({
        where: {
          id: {
            in: roomIds,
          },
        },
      });

      console.log("Deleted roomIds:", roomIds);
      console.log("Delete result:", deleteResult);
    } else {
      console.log("No expired rooms found.");
    }

    const response = NextResponse.json(
      { message: "Expired rooms deleted." },
      { status: 200 },
    );
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  } catch (error) {
    console.error("Error deleting expired rooms:", error);
    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }
}
