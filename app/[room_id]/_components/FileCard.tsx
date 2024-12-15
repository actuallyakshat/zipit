import formatBytes from "@/utils/formatBytes";
import { DownloadIcon, LoaderCircle, Trash2Icon } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { deleteFile, refreshRoomFiles } from "../_actions/actions";
import toast from "react-hot-toast";
import FileDeletionConfirmationModal from "./FileDeletionConfirmationModal";

export default function FileCard({
  file,
  roomId,
  setFiles,
  selectedFiles,
  setSelectedFiles,
}: {
  file: any;
  roomId: number;
  selectedFiles: any[];
  setSelectedFiles: (files: any[]) => void;
  setFiles: (files: any[]) => void;
}) {
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
  const [checked, setChecked] = React.useState(selectedFiles.includes(file));
  const [downloadLoading, setDownloadLoading] = React.useState(false);
  const handleCheckboxChange = (file: any) => {
    setChecked(!checked);
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  async function handleDownloadFile(file: any) {
    setDownloadLoading(true);
    try {
      const response = await fetch(file.mediaAccessLink);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a); // Append to body to ensure it works in all browsers
      a.click();
      document.body.removeChild(a); // Clean up
      URL.revokeObjectURL(url);
      toast.success("File downloaded");
    } catch (error) {
      console.error("Error downloading file");
      toast.error("Failed to download file");
    } finally {
      setDownloadLoading(false);
    }
  }

  useEffect(() => {
    setChecked(selectedFiles.includes(file));
  }, [selectedFiles, setChecked, file]);

  return (
    <div
      key={file.id}
      className={`col-span-1 grid grid-cols-4 gap-2 overflow-hidden rounded-lg border bg-gray-50 ${checked ? "border border-primary" : ""}`}
    >
      <div
        className="col-span-3 h-full cursor-pointer p-4"
        onClick={() => handleCheckboxChange(file)}
      >
        <div className="flex items-center gap-3 truncate">
          <div
            className={`custom-checkbox w-full ${checked ? "checked" : ""}`}
          />
          <div>
            <h1 className="font-semibold">{file.name}</h1>
            <h4 className="text-sm text-zinc-600">{formatBytes(file.size)}</h4>
          </div>
        </div>
      </div>
      <div className="col-span-1 ml-auto flex items-center gap-2 pr-4">
        {file.mediaAccessLink && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadFile(file);
            }}
          >
            {downloadLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <DownloadIcon className="size-5" />
            )}
          </button>
        )}
        <button
          disabled={deleteLoading}
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirmDelete(true);
          }}
        >
          {!deleteLoading ? (
            <Trash2Icon className="size-5" />
          ) : (
            <LoaderCircle className="animate-spin" />
          )}
        </button>
        <FileDeletionConfirmationModal
          showConfirmDelete={showConfirmDelete}
          setShowConfirmDelete={setShowConfirmDelete}
          roomId={roomId}
          mediaId={file.mediaId}
          setFiles={setFiles}
        />
      </div>
    </div>
  );
}
