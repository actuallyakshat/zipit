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
  const handleCheckboxChange = (file: any) => {
    setChecked(!checked);
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  useEffect(() => {
    setChecked(selectedFiles.includes(file));
  }, [selectedFiles, setChecked, file]);

  return (
    <div
      key={file.id}
      className={`grid grid-cols-4 gap-2 overflow-hidden rounded-lg border bg-gray-50 ${checked ? "border border-primary" : ""}`}
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
          <button onClick={(e) => e.stopPropagation()}>
            <Link href={file.mediaAccessLink} target="_blank">
              <DownloadIcon className="size-5" />
            </Link>
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
