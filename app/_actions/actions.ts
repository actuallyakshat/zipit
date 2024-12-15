"use server";

import prisma from "@/db";
import generateSixDigitRandomNumber from "@/utils/generateRoomCode";

export async function createRoom() {
  try {
    let roomCode;
    while (true) {
      roomCode = generateSixDigitRandomNumber();
      const existingRoom = await prisma.room.findFirst({
        where: {
          roomId: roomCode,
        },
      });
      if (!existingRoom) {
        break;
      }
    }
    const newRoom = await prisma.room.create({
      data: {
        roomId: roomCode,
      },
    });
    return newRoom;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function checkRoomExists(roomId: number) {
  try {
    if (!roomId) {
      throw new Error("Room id is required");
    }
    const room = await prisma.room.findFirst({
      where: {
        roomId: roomId,
      },
    });
    if (!room) {
      throw new Error("Room not found");
    }
    return true;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
