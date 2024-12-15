import { appendUploadedFile } from "@/app/[room_id]/_actions/actions";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
const f = createUploadthing();

export const ourFileRouter = {
  allFilesUploader: f({
    image: { maxFileSize: "64MB", maxFileCount: 30 },
    video: { maxFileSize: "512MB", maxFileCount: 4 },
    audio: { maxFileSize: "128MB", maxFileCount: 3 },
    blob: { maxFileSize: "256MB", maxFileCount: 20 },
  })
    .input(z.object({ roomId: z.number() }))
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, input }) => {
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { roomId: input.roomId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      const res = await appendUploadedFile(metadata.roomId, [file]);
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedInRoom: metadata.roomId, files: res };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
