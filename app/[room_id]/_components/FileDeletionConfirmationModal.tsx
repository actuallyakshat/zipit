import { DeleteIcon, LoaderCircle, TrashIcon } from "lucide-react";
import React from "react";
import { deleteFile, refreshRoomFiles } from "../_actions/actions";
import toast from "react-hot-toast";

export default function FileDeletionConfirmationModal({
  showConfirmDelete,
  setShowConfirmDelete,
  roomId,
  mediaId,
  setFiles,
}: {
  showConfirmDelete: boolean;
  roomId: number;
  mediaId: string;
  setFiles: (files: any[]) => void;
  setShowConfirmDelete: (value: boolean) => void;
}) {
  const [loading, setLoading] = React.useState(false);

  async function deleteFileHandler(mediaId: string) {
    try {
      setLoading(true);
      toast.loading("Deleting file", { id: "delete-file-toast" });
      await deleteFile([mediaId]);
      const newFiles = await refreshRoomFiles(roomId);
      setFiles(newFiles);
      toast.success("File deleted", { id: "delete-file-toast" });
    } catch (e) {
      console.error("Error deleting file");
      toast.error("Error deleting file", { id: "delete-file-toast" });
    } finally {
      setLoading(false);
    }
  }

  if (!showConfirmDelete) return null;
  return (
    <div
      onClick={() => setShowConfirmDelete(false)}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content w-full max-w-lg rounded-lg bg-white p-4"
      >
        <h1 className="text-2xl font-bold">Are you sure?</h1>
        <h4 className="text-sm text-zinc-500">
          You are about to delete this file from the room.
        </h4>
        <div className="mt-4 flex w-full justify-end gap-2">
          <button
            onClick={() => deleteFileHandler(mediaId)}
            disabled={loading}
            className="destructive-button"
          >
            {!loading ? "Delete" : <LoaderCircle className="animate-spin" />}
          </button>
        </div>
      </div>
    </div>
  );
}
