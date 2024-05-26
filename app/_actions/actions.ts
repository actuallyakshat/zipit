"use server";

import prisma from "@/db";

export async function createRoom(roomCode: string) {
  try {
    if (!roomCode) {
      throw new Error("Room code is required");
    }
    if (roomCode.length < 4) {
      throw new Error("Room code must be at least 4 characters");
    }
    const existingRoom = await prisma.room.findFirst({
      where: {
        roomid: roomCode,
      },
    });
    if (existingRoom) {
      throw new Error("Code already in use.");
    }
    const newRoom = await prisma.room.create({
      data: {
        roomid: roomCode,
      },
    });
    return newRoom;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function checkRoomExists(roomId: string) {
  try {
    if (!roomId) {
      throw new Error("Room id is required");
    }
    const room = await prisma.room.findFirst({
      where: {
        roomid: roomId,
      },
    });
    if (!room) {
      throw new Error("Room not found");
    }
    return true;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
