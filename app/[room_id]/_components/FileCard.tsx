import formatBytes from "@/utils/formatBytes";
import { DownloadIcon, LoaderCircle, Trash2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { deleteFile, refreshRoomFiles } from "../_actions/actions";
import toast from "react-hot-toast";
import FileDeletionConfirmationModal from "./FileDeletionConfirmationModal";

export default function FileCard({
  file,
  roomId,
  setFiles,
}: {
  file: any;
  roomId: number;
  setFiles: (files: any[]) => void;
}) {
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);

  return (
    <div
      key={file.id}
      className="grid grid-cols-3 gap-2 overflow-hidden rounded-lg border bg-gray-50 p-4"
    >
      <div className="col-span-2">
        <h1 className="max-w-[150px] overflow-hidden truncate font-semibold">
          {file.name}
        </h1>
        <h4 className="text-sm text-zinc-600">{formatBytes(file.size)}</h4>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Link href={file.mediaAccessLink} target="_blank">
          <DownloadIcon className="size-5" />
        </Link>
        <button
          disabled={deleteLoading}
          onClick={() => setShowConfirmDelete(true)}
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
