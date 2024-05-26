"use client";
import React, { useEffect } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import CloseRoomModal from "./CloseRoomModal";
import Link from "next/link";
import Loading from "./loading";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import {
  appendUploadedFile,
  checkBeforeUpload,
  getRoomDetails,
  refreshRoomFiles,
} from "./_actions/actions";
import FileCard from "./_components/FileCard";
import { checkRoomExists } from "../_actions/actions";
import { redirect, useRouter } from "next/navigation";

export default function Room({ params }: { params: { room_id: number } }) {
  const router = useRouter();
  const [roomId, setRoomId] = React.useState<number>(Number(params.room_id));
  const [showCloseRoomModal, setShowCloseRoomModal] = React.useState(false);
  const [roomDetails, setRoomDetails] = React.useState<any>(null);
  const [remainingTime, setRemainingTime] = React.useState("00:00");
  const urlPrefix = "https://justzipit.vercel.app/";
  const [files, setFiles] = React.useState<any[]>([]);

  async function getDetails() {
    try {
      const room = await getRoomDetails(roomId as number);
      setRoomDetails(room);
      setFiles(room.files);
    } catch (e: any) {
      console.log(e);
      toast.error(e.message, { id: "room-details" });
      if (e.message === "Room not found") router.replace("/");
    }
  }

  async function handleUploadComplete(data: any) {
    try {
      const files = await appendUploadedFile(roomId, data);
      const newFiles = await refreshRoomFiles(roomId);
      setFiles(newFiles);
      toast.success("File uploaded successfully", { id: "upload" });
    } catch (e) {
      console.log(e);
    }
  }

  async function checkExistence(files: any[]) {
    try {
      const check = await checkBeforeUpload(roomId);
      if (check) return files;
      else {
        toast.error("Room does not exists anymore", { id: "upload" });
        router.replace("/");
        return [];
      }
    } catch (e) {
      return [];
    }
  }

  useEffect(() => {
    if (roomId) {
      getDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (roomDetails) {
      const roomCreationTime = new Date(roomDetails.createdAt).getTime();
      const expiryTime = roomCreationTime + 15 * 60 * 1000; // 10 minutes in milliseconds
      const updateRemainingTime = () => {
        const currentTime = Date.now();
        const timeLeft = expiryTime - currentTime;
        if (timeLeft <= 0) {
          setRemainingTime("This room is scheduled for deletion");
          return;
        }
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        setRemainingTime(
          `This room expires in: ${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`,
        );
      };

      updateRemainingTime();
      const intervalId = setInterval(updateRemainingTime, 1000);
      return () => clearInterval(intervalId);
    }
  }, [roomDetails]);

  if (!roomDetails) {
    return <Loading />;
  }

  return (
    <div className="appbg min-h-screen w-full">
      <div className="mx-auto max-w-screen-xl pt-24 text-center">
        <h1 className="text-5xl font-black">Zipit</h1>
        <div className="flex w-full flex-col items-center justify-center rounded-lg px-4 pb-8 pt-3">
          <h2 className="mb-3 text-lg font-medium text-zinc-500">
            {remainingTime}
          </h2>
          <div className="w-full max-w-sm rounded-xl border-4 border-dotted border-zinc-300 bg-gray-50/60 px-4 py-4 text-start">
            <h3 className="font-medium">Room Code: {roomId}</h3>
            <div className="flex w-full items-center gap-2">
              <h3 className="font-medium">
                URL:{" "}
                <Link
                  href={`${urlPrefix}${roomId}`}
                  target="_blank"
                  className="hover:underline"
                >
                  {`${urlPrefix}${roomId}`}
                </Link>
              </h3>
              <button
                onClick={() => {
                  toast.success("Copied to clipboard");
                  navigator.clipboard.writeText(`${urlPrefix}${roomId}`);
                }}
              >
                <Copy className="size-4 transition-colors hover:text-black/60" />
              </button>
            </div>
            <div className="flex w-full justify-center">
              <button
                onClick={() => setShowCloseRoomModal(true)}
                className="mx-auto mt-3 text-sm font-medium text-red-600 hover:underline"
              >
                Close Room
              </button>
            </div>
            <CloseRoomModal
              roomId={roomId}
              showCloseRoomModal={showCloseRoomModal}
              setShowCloseRoomModal={setShowCloseRoomModal}
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-center px-4">
          <UploadDropzone
            onUploadBegin={() =>
              toast.loading("Uploading files...", { id: "upload" })
            }
            onBeforeUploadBegin={(files) => checkExistence(files)}
            appearance={{
              label: {
                color: "var(--primary)",
              },
              container: {
                borderStyle: "dashed",
                borderWidth: "3px",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                maxWidth: "1260px",
                width: "100%",
              },
              button: {
                fontWeight: "500",
                cursor: "pointer",
                backgroundColor: "var(--primary)",
              },
            }}
            endpoint="allFilesUploader"
            onClientUploadComplete={(data) => handleUploadComplete(data)}
            onUploadError={(err) => toast.error(err.message)}
          />
        </div>
      </div>
      <div className="container mx-auto mt-5 px-4">
        <h2 className="mb-3 text-3xl font-extrabold">Files</h2>
        {files.length == 0 && (
          <p className="text-lg font-medium text-zinc-600">
            No files uploaded yet
          </p>
        )}
        {files.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pb-16 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                roomId={roomId}
                setFiles={setFiles}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
