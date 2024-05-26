"use server";
import prisma from "@/db";
import { UTApi } from "uploadthing/server";
interface File {
  key: string;
  name: string;
  url: string;
  size: number;
}

const utapi = new UTApi();

export async function appendUploadedFile(roomId: string, files: File[]) {
  try {
    // Check if the room exists
    const existingRoom = await prisma.room.findUnique({
      where: { roomid: roomId },
    });

    if (!existingRoom) {
      throw new Error("Room not found");
    }

    // Create the new files in the database
    const createdFiles = await prisma.file.createMany({
      data: files.map((file) => ({
        mediaId: file.key,
        mediaAccessLink: file.url,
        roomId: existingRoom.id,
        name: file.name,
        size: file.size,
      })),
    });

    console.log("Created files:", createdFiles);

    return createdFiles;
  } catch (e: any) {
    console.log(e.message);
    throw e;
  }
}

export async function refreshRoomFiles(roomId: string) {
  try {
    const room = await prisma.room.findUnique({
      where: { roomid: roomId },
    });

    if (!room) {
      throw new Error("Room not found");
    }

    const files = await prisma.file.findMany({
      where: { roomId: room.id },
    });

    return files;
  } catch (e: any) {
    console.log(e.message);
    throw e;
  }
}

export async function getRoomDetails(roomId: string) {
  try {
    if (!roomId) {
      throw new Error("Room id is required");
    }
    const room = await prisma.room.findFirst({
      where: {
        roomid: roomId,
      },
      include: {
        files: true,
      },
    });
    if (!room) {
      throw new Error("Room not found");
    }
    return room;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function deleteFile(fileIds: string[]) {
  try {
    if (!fileIds.length) {
      throw new Error("No file IDs provided");
    }
    const files = await prisma.file.findMany({
      where: { mediaId: { in: fileIds } },
    });

    if (!files) {
      throw new Error("Files not found");
    }

    await prisma.file.deleteMany({
      where: { mediaId: { in: fileIds } },
    });
    await utapi.deleteFiles(fileIds);
  } catch (e: any) {
    console.log(e.message);
    throw e;
  }
}

export async function deleteRoom(roomId: string) {
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

    const files = await prisma.file.findMany({
      where: { roomId: room.id },
    });
    if (!room) {
      throw new Error("Room not found");
    }

    const fileIds = files.map((file) => file.mediaId);
    await utapi.deleteFiles(fileIds);
    await prisma.room.delete({
      where: {
        roomid: roomId,
      },
    });

    return true;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
