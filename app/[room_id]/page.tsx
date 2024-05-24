"use client";
import React, { useEffect } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import { OurFileRouter } from "../api/uploadthing/core";
import CloseRoomModal from "./CloseRoomModal";
import Link from "next/link";
import { getRoomDetails } from "../_actions/actions";
export default function Room({ params }: { params: { room_id: string } }) {
  const [showCloseRoomModal, setShowCloseRoomModal] = React.useState(false);
  const [roomDetails, setRoomDetails] = React.useState<any>(null);
  const [remainingTime, setRemainingTime] = React.useState("00:00");
  const urlPrefix = "https://justzipit.vercel.app/";
  const [roomId, setRoomId] = React.useState(params.room_id);
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
  return (
    <div className="appbg min-h-screen w-full">
      <div className="mx-auto max-w-screen-xl pt-40 text-center">
        <div className="flex w-full flex-col items-center justify-center rounded-lg px-10 py-8">
          <h2>This room expries in: {remainingTime}</h2>
          <h3 className="text-center text-2xl ">Room Id: {roomId}</h3>
          <h3>
            URL:{" "}
            <Link
              href={`${urlPrefix}${roomId}`}
            >{`${urlPrefix}${roomId}`}</Link>
          </h3>
        </div>

        <div className="flex w-full items-center justify-center">
          <UploadDropzone
            appearance={{
              container: {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                width: "70%",
              },
            }}
            endpoint="allFilesUploader"
            onClientUploadComplete={(data) => console.log(data)}
            onUploadError={(err) => console.log(err)}
          />
        </div>
      </div>
      <div>
        <h2>Files in this room:</h2>
        <div></div>
      </div>
      <button
        onClick={() => setShowCloseRoomModal(true)}
        className="mt-6 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
      >
        Close room
      </button>
      <CloseRoomModal
        showCloseRoomModal={showCloseRoomModal}
        setShowCloseRoomModal={setShowCloseRoomModal}
      />
    </div>
  );
}
