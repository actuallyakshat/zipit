"use client";
import React, { useEffect } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import CloseRoomModal from "./CloseRoomModal";
import Link from "next/link";
import Loading from "./loading";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import {
  checkBeforeUpload,
  deleteFile,
  getRoomDetails,
  refreshRoomFiles,
} from "./_actions/actions";
import FileCard from "./_components/FileCard";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase";
import JSZip from "jszip";
import MultiDeletionConfirmationModal from "./_components/MultiDeletionConfirmationModal";

export default function Room({ params }: { params: { room_id: number } }) {
  const router = useRouter();
  const [roomId, setRoomId] = React.useState<number>(Number(params.room_id));
  const [showCloseRoomModal, setShowCloseRoomModal] = React.useState(false);
  const [roomDetails, setRoomDetails] = React.useState<any>(null);
  const [remainingTime, setRemainingTime] = React.useState("00:00");
  const urlPrefix = "https://justzipit.vercel.app/";
  const [files, setFiles] = React.useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = React.useState<any[]>([]);
  const [showConfirmMultiDelete, setShowConfirmMultiDelete] =
    React.useState(false);

  async function getDetails() {
    try {
      const room = await getRoomDetails(roomId as number);
      if (!room) {
        toast.error("Room does not exists", { id: "room-details" });
        router.replace("/");
        return;
      }
      setRoomDetails(room);
      setFiles(room.files);
    } catch (e: any) {
      console.log(e);
      toast.error("Something went wrong. Are you sure this room exists?", {
        id: "room-details",
      });
    }
  }

  async function handleUploadComplete(data: any) {
    try {
      const newFiles = await refreshRoomFiles(roomId);
      setFiles(newFiles);
      toast.success("File uploaded successfully", { id: "upload-files" });
    } catch (e) {
      console.log(e);
    }
  }

  async function checkExistence(files: any[]) {
    try {
      toast.loading("Checking room's validity...", { id: "upload-files" });
      const check = await checkBeforeUpload(roomId);
      if (check) return files;
      else {
        toast.error("Room does not exists anymore", { id: "upload-files" });
        router.replace("/");
        return [];
      }
    } catch (e) {
      return [];
    }
  }

  async function handleDeleteSelectedFiles() {
    try {
      if (selectedFiles.length == 0) return;
      // Make an API call to delete files
      const deleteIds = selectedFiles.map((file) => file.mediaId);
      await deleteFile(deleteIds);
      const newFiles = await refreshRoomFiles(roomId);
      setFiles(newFiles);
      toast.success("Selected files deleted successfully");
      setShowConfirmMultiDelete(false);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error deleting selected files", error);
      toast.error("Failed to delete selected files");
    }
  }

  async function handleDownloadSelectedFiles() {
    try {
      if (selectedFiles.length == 0) return;
      const zip = new JSZip();

      // Fetch the file data and add to zip
      for (let fileItem of selectedFiles) {
        const file = files.find((file) => file.id === fileItem.id);
        const response = await fetch(file.url);
        const blob = await response.blob();
        zip.file(file.name, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "files.zip";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Files downloaded as zip");
    } catch (error) {
      console.error("Error downloading files as zip", error);
      toast.error("Failed to download files as zip");
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

  //Web socket connection

  useEffect(() => {
    const channel = supabase
      .channel("room-" + roomId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "File",
        },
        (payload) => {
          if (payload.eventType == "DELETE") {
            const newFiles = files.filter((file) => file.id !== payload.old.id);
            setFiles(files.filter((file) => file.id !== payload.old.id));
          } else {
            setFiles([...files, payload.new]);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, files]);

  function selectAllHandler() {
    setSelectedFiles(files);
  }

  function deselectAllHandler() {
    setSelectedFiles([]);
  }

  if (!roomDetails) {
    return <Loading />;
  }

  return (
    <div className="appbg min-h-screen w-full">
      <div className="mx-auto max-w-screen-xl pt-20 text-center">
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
            input={{ roomId }}
            onUploadBegin={() =>
              toast.loading("Uploading files...", { id: "upload-files" })
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
      <div className="mx-auto mt-5 max-w-screen-xl px-4 pb-16">
        <div className="flex w-full items-center justify-between">
          <h2 className="mb-3 text-3xl font-extrabold">Files</h2>

          {selectedFiles.length > 0 && (
            <>
              <MultiDeletionConfirmationModal
                showConfirmDelete={showConfirmMultiDelete}
                setShowConfirmDelete={setShowConfirmMultiDelete}
                deleteFiles={handleDeleteSelectedFiles}
              />
              <div className="space-x-3">
                <button
                  onClick={() => setShowConfirmMultiDelete(true)}
                  className="destructive-button"
                >
                  Delete Selected
                </button>

                <button
                  onClick={handleDownloadSelectedFiles}
                  className="primary-button"
                >
                  Download Selected as Zip
                </button>
              </div>
            </>
          )}
        </div>
        {files.length > 0 && (
          <div className="my-2 flex w-full items-center justify-end">
            <button className="ghost-button" onClick={selectAllHandler}>
              Select all
            </button>
            <button className="ghost-button" onClick={deselectAllHandler}>
              Deselect all
            </button>
          </div>
        )}
        <div className="mb-4 flex space-x-4">
          {files.length == 0 && (
            <p className="text-lg font-medium text-zinc-600">
              No files uploaded yet
            </p>
          )}
          {files.length > 0 && (
            <div className="grid grid-cols-1 gap-2 pb-16 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  roomId={roomId}
                  setFiles={setFiles}
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
