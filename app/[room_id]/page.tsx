"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, LoaderCircle } from "lucide-react";
import JSZip from "jszip";
import toast from "react-hot-toast";

// Component Imports
import { UploadDropzone } from "@/utils/uploadthing";
import CloseRoomModal from "./CloseRoomModal";
import FileCard from "./_components/FileCard";
import Loading from "./loading";
import MultiDeletionConfirmationModal from "./_components/MultiDeletionConfirmationModal";

// Action Imports
import {
  checkBeforeUpload,
  deleteFile,
  getRoomDetails,
  refreshRoomFiles,
} from "./_actions/actions";

// Supabase Import
import { supabase } from "@/supabase";

// Constants
const URL_PREFIX = "https://justzipit.vercel.app/";
const ROOM_EXPIRY_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

interface RoomProps {
  params: { room_id: number };
}

export default function Room({ params }: RoomProps) {
  const router = useRouter();
  const roomId = Number(params.room_id);

  // State Management
  const [roomDetails, setRoomDetails] = useState<any>(null);
  const [remainingTime, setRemainingTime] = useState("00:00");
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [showCloseRoomModal, setShowCloseRoomModal] = useState(false);
  const [showConfirmMultiDelete, setShowConfirmMultiDelete] = useState(false);

  // Fetch Room Details
  const fetchRoomDetails = useCallback(async () => {
    try {
      const room = await getRoomDetails(roomId);
      if (!room) {
        toast.error("Room does not exist", { id: "room-details" });
        router.replace("/");
        return;
      }
      setRoomDetails(room);
      setFiles(room.files);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Are you sure this room exists?", {
        id: "room-details",
      });
    }
  }, [roomId, router]);

  // File Upload Handlers
  const handleUploadComplete = useCallback(async () => {
    try {
      const newFiles = await refreshRoomFiles(roomId);
      setFiles(newFiles);
      toast.success("File uploaded successfully", { id: "upload-files" });
    } catch (error) {
      console.error(error);
    }
  }, [roomId]);

  const checkRoomExistence = useCallback(
    async (files: any[]) => {
      try {
        toast.loading("Checking room's validity...", { id: "upload-files" });
        const isValid = await checkBeforeUpload(roomId);

        if (!isValid) {
          toast.error("Room does not exist anymore", { id: "upload-files" });
          router.replace("/");
          return [];
        }
        return files;
      } catch {
        return [];
      }
    },
    [roomId, router],
  );

  // File Deletion Handlers
  const handleDeleteSelectedFiles = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    try {
      const deleteIds = selectedFiles.map((file) => file.mediaId);
      await deleteFile(deleteIds);

      const newFiles = await refreshRoomFiles(roomId);
      setFiles(newFiles);

      toast.success("Selected files deleted successfully");
      setShowConfirmMultiDelete(false);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error deleting selected files");
      toast.error("Failed to delete selected files");
    }
  }, [roomId, selectedFiles]);

  // File Download Handler
  const handleDownloadSelectedFiles = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    try {
      setDownloadLoading(true);
      const zip = new JSZip();

      for (let fileItem of selectedFiles) {
        const file = files.find((f) => f.id === fileItem.id);
        const response = await fetch(file.mediaAccessLink);
        const blob = await response.blob();
        zip.file(file.name, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = `${roomId}-files.zip`;
      downloadLink.click();

      URL.revokeObjectURL(url);
      toast.success("Files downloaded as zip");
    } catch (error) {
      console.error("Error downloading files as zip");
      toast.error("Failed to download files as zip");
    } finally {
      setDownloadLoading(false);
    }
  }, [files, roomId, selectedFiles]);

  // Room Expiry Timer
  useEffect(() => {
    if (!roomDetails) return;

    const roomCreationTime = new Date(roomDetails.createdAt).getTime();
    const expiryTime = roomCreationTime + ROOM_EXPIRY_TIME;

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
  }, [roomDetails]);

  // Supabase Real-time Listener
  useEffect(() => {
    const channel = supabase
      .channel(roomId.toString())
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "File",
        },
        (payload) => {
          // Process events based on event type
          if (payload.eventType === "DELETE") {
            setFiles((currentFiles) =>
              currentFiles.filter((file) => file.id !== payload.old.id),
            );
          } else if (payload.eventType === "INSERT") {
            if (payload.new.roomId === roomId) {
              setFiles((currentFiles) => {
                const exists = currentFiles.some(
                  (file) => file.id === payload.new.id,
                );
                return exists ? currentFiles : [...currentFiles, payload.new];
              });
            }
          }
        },
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // Initial Room Details Fetch
  useEffect(() => {
    fetchRoomDetails();
  }, [fetchRoomDetails]);

  // File Selection Handlers
  const selectAllHandler = () => setSelectedFiles(files);
  const deselectAllHandler = () => setSelectedFiles([]);

  // Loading State
  if (!roomDetails) return <Loading />;

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
                  href={`${URL_PREFIX}${roomId}`}
                  target="_blank"
                  className="hover:underline"
                >
                  {`${URL_PREFIX}${roomId}`}
                </Link>
              </h3>
              <button
                onClick={() => {
                  toast.success("Copied to clipboard");
                  navigator.clipboard.writeText(`${URL_PREFIX}${roomId}`);
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
              fileIds={files.map((file) => file.mediaId)}
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
            onBeforeUploadBegin={(files) => checkRoomExistence(files)}
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
            onClientUploadComplete={(data) => handleUploadComplete()}
            onUploadError={(err) => toast.error(err.message)}
          />
        </div>
      </div>
      <div className="mx-auto mt-5 max-w-screen-xl px-4 pb-16">
        <div className="flex w-full flex-col justify-between gap-3 md:flex-row md:items-center">
          <h2 className="text-4xl font-extrabold">Files</h2>

          {selectedFiles.length > 0 && (
            <>
              <MultiDeletionConfirmationModal
                showConfirmDelete={showConfirmMultiDelete}
                setShowConfirmDelete={setShowConfirmMultiDelete}
                deleteFiles={handleDeleteSelectedFiles}
              />
              <div className="mx-auto flex items-center gap-3 md:mx-0 md:flex">
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
                  {downloadLoading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Download Selected as Zip"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
        {files.length > 0 && (
          <div className="my-2 flex w-full items-center gap-6">
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
            <div className="grid grid-cols-1 gap-2 pb-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
