"use client";
import React, { useEffect } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import { OurFileRouter } from "../api/uploadthing/core";
import CloseRoomModal from "./CloseRoomModal";
import Link from "next/link";
import { getRoomDetails } from "../_actions/actions";
import Loading from "./loading";
import { Copy } from "lucide-react";
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
      console.log(room);
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
  if (!roomDetails) {
    return <Loading />;
  }

  return (
    <div className="appbg min-h-screen w-full">
      <div className="mx-auto max-w-screen-xl pt-32 text-center">
        <h1 className="text-4xl font-extrabold">Zipit</h1>
        <div className="flex w-full flex-col items-center justify-center rounded-lg px-10 pb-8 pt-3">
          <h2 className="mb-3 font-medium">
            This room expries in: {remainingTime}
          </h2>
          <div className="w-fit rounded-xl border bg-gray-50/80 px-8 py-4">
            <h3 className="text-start font-medium ">Room ID: {roomId}</h3>
            <div className="flex w-full items-center justify-center gap-3">
              <h3 className="font-medium hover:underline">
                URL:{" "}
                <Link
                  href={`${urlPrefix}${params.room_id}`}
                >{`${urlPrefix}${params.room_id}`}</Link>
              </h3>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(`${urlPrefix}${params.room_id}`)
                }
              >
                <Copy className="size-5" />
              </button>
            </div>
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
            onClientUploadComplete={(data) => console.log(data)}
            onUploadError={(err) => console.log(err)}
          />
        </div>
      </div>
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold">Files in this room:</h2>
        <div>{files.length == 0 && "No files uploaded yet"}</div>
      </div>
      <div className="mt-20 flex w-full items-center justify-center">
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
      </div>
    </div>
  );
}
