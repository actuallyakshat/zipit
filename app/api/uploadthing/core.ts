import { appendUploadedFile } from "@/app/[room_id]/_actions/actions";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// const auth = (req: Request) => ({ id: "zipituser" }); // Fake auth function
const roomId = 207918;

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug

  allFilesUploader: f({
    image: { maxFileSize: "64MB", maxFileCount: 30 },
    video: { maxFileSize: "512MB", maxFileCount: 4 },
    audio: { maxFileSize: "128MB", maxFileCount: 3 },
    blob: { maxFileSize: "256MB", maxFileCount: 5 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { roomId: roomId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete", metadata, file);
      const res = await appendUploadedFile(metadata.roomId, [file]);
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedInRoom: metadata.roomId, files: res };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
