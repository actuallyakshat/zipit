import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { Room } from "@prisma/client";
import { utapi } from "@/uploadthingClient";
export const revalidate = 0;
export async function GET(req: NextRequest) {
  try {
    const tenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const expiredRooms = await prisma.room.findMany({
      where: {
        createdAt: {
          lt: tenMinutesAgo,
        },
      },
      include: {
        files: true,
      },
    });

    const filesToDelete: any[] = [];
    expiredRooms.forEach((room) => {
      if (room.files) {
        room.files.forEach((file) => filesToDelete.push(file));
      }
    });

    const fileIds = filesToDelete.map((file) => file.mediaId);
    await utapi.deleteFiles(fileIds);

    const roomIds = expiredRooms.map((room: Room) => room.id);
    if (roomIds.length > 0) {
      const deleteResult = await prisma.room.deleteMany({
        where: {
          id: {
            in: roomIds,
          },
        },
      });
      console.log("Deleted", deleteResult.count, "rooms.");
    } else {
      console.log("No expired rooms found.");
    }

    const response = NextResponse.json(
      {
        message: "Expired rooms deleted.",
        expiredRooms: expiredRooms,
        roomIds: roomIds,
      },
      { status: 200 },
    );

    // Set headers to disable caching
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");

    return response;
  } catch (error) {
    console.error("Error deleting expired rooms:", error);
    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );

    // Set headers to disable caching
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");

    return response;
  }
}
