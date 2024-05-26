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
  getRoomDetails,
  refreshRoomFiles,
} from "./_actions/actions";
import FileCard from "./_components/FileCard";

export default function Room({ params }: { params: { room_id: string } }) {
  const decodedRoomId = decodeURIComponent(params.room_id);

  const [showCloseRoomModal, setShowCloseRoomModal] = React.useState(false);
  const [roomDetails, setRoomDetails] = React.useState<any>(null);
  const [remainingTime, setRemainingTime] = React.useState("00:00");
  const urlPrefix = "https://justzipit.vercel.app/";
  const [roomId, setRoomId] = React.useState(decodedRoomId);
  const [files, setFiles] = React.useState<any[]>([]);

  async function getDetails() {
    try {
      const room = await getRoomDetails(roomId);
      setRoomDetails(room);
      setFiles(room.files);
      console.log(room);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleUploadComplete(data: any) {
    try {
      console.log("data", data);
      const files = await appendUploadedFile(roomId, data);
      const newFiles = await refreshRoomFiles(roomId);
      setFiles(newFiles);
      console.log("files", files);
    } catch (e) {
      console.log(e);
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
      const expiryTime = roomCreationTime + 10 * 60 * 1000; // 10 minutes in milliseconds
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
        <h1 className="text-5xl font-extrabold">Zipit</h1>
        <div className="flex w-full flex-col items-center justify-center rounded-lg px-4 pb-8 pt-3">
          <h2 className="mb-3 text-lg font-medium text-zinc-500">
            {remainingTime}
          </h2>
          <div className="w-fit rounded-xl border bg-gray-50/80 px-4 py-4">
            <h3 className="text-start font-medium">Room Code: {roomId}</h3>
            <div className="flex w-full items-center justify-center gap-2">
              <h3 className="font-medium">
                URL:{" "}
                <Link
                  href={`${urlPrefix}${params.room_id}`}
                  target="_blank"
                  className="hover:underline"
                >
                  {`${urlPrefix}${params.room_id}`}
                </Link>
              </h3>
              <button
                onClick={() => {
                  toast.success("Copied to clipboard");
                  navigator.clipboard.writeText(
                    `${urlPrefix}${params.room_id}`,
                  );
                }}
              >
                <Copy className="size-4 transition-colors hover:text-black/60" />
              </button>
            </div>
            <button
              onClick={() => setShowCloseRoomModal(true)}
              className="destructive-button mt-3"
            >
              Close room
            </button>
            <CloseRoomModal
              roomId={roomId}
              showCloseRoomModal={showCloseRoomModal}
              setShowCloseRoomModal={setShowCloseRoomModal}
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-center">
          <UploadDropzone
            appearance={{
              label: {
                color: "var(--primary)",
              },
              container: {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                width: "70%",
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
      <div className="container mx-auto">
        <h2 className="mb-3 text-3xl font-extrabold">Files</h2>
        {files.length == 0 && (
          <p className="text-lg font-medium text-zinc-600">
            No files uploaded yet
          </p>
        )}
        {files.length > 0 && (
          <div className="flex gap-2">
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
      {/* <div className="mt-20 flex w-full items-center justify-center">
        <button
          onClick={() => setShowCloseRoomModal(true)}
          className="destructive-button mt-6"
        >
          Close room
        </button>
        <CloseRoomModal
          roomId={roomId}
          showCloseRoomModal={showCloseRoomModal}
          setShowCloseRoomModal={setShowCloseRoomModal}
        />
      </div> */}
    </div>
  );
}
