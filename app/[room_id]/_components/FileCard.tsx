import formatBytes from "@/utils/formatBytes";
import { DownloadIcon, LoaderCircle, Trash2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { deleteFile, refreshRoomFiles } from "../_actions/actions";
import toast from "react-hot-toast";

export default function FileCard({
  file,
  roomId,
  setFiles,
}: {
  file: any;
  roomId: string;
  setFiles: (files: any[]) => void;
}) {
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  async function deleteFileHandler(mediaId: string) {
    try {
      setDeleteLoading(true);
      toast.loading("Deleting file", { id: "delete-file-toast" });
      await deleteFile([mediaId]);
      const newFiles = await refreshRoomFiles(roomId);
      setFiles(newFiles);
      toast.success("File deleted", { id: "delete-file-toast" });
    } catch (e) {
      console.log(e);
      toast.error("Error deleting file", { id: "delete-file-toast" });
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div
      key={file.id}
      className="flex items-center justify-between gap-10 rounded-lg border bg-gray-50 p-4"
    >
      <div>
        <h1 className="truncate font-semibold">{file.name}</h1>
        <h4 className="text-sm text-zinc-600">{formatBytes(file.size)}</h4>
      </div>
      <div className="flex items-center gap-2">
        <Link href={file.mediaAccessLink} target="_blank">
          <DownloadIcon className="size-5" />
        </Link>
        <button
          disabled={deleteLoading}
          onClick={() => deleteFileHandler(file.mediaId)}
        >
          {!deleteLoading ? (
            <Trash2Icon className="size-5" />
          ) : (
            <LoaderCircle className="animate-spin" />
          )}
        </button>
      </div>
    </div>
  );
}
