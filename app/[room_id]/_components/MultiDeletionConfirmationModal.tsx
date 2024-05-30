import { LoaderCircle } from "lucide-react";
import React from "react";

export default function MultiDeletionConfirmationModal({
  showConfirmDelete,
  setShowConfirmDelete,
  deleteFiles,
}: {
  showConfirmDelete: boolean;
  setShowConfirmDelete: (value: boolean) => void;
  deleteFiles: () => void;
}) {
  const [loading, setLoading] = React.useState(false);
  async function deleteFileHandler() {
    setLoading(true);
    await deleteFiles();
    setLoading(false);
  }
  if (!showConfirmDelete) return null;
  return (
    <div
      onClick={() => setShowConfirmDelete(false)}
      className="modal-overlay fixed left-0 top-0 z-50 mx-0 flex h-full w-full items-center justify-center bg-black/50 px-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content w-full max-w-lg rounded-lg bg-white p-4"
      >
        <h1 className="text-2xl font-bold">Are you sure?</h1>
        <h4 className="text-sm text-zinc-500">
          You are about to delete the selected files from the room.
        </h4>
        <div className="mt-4 flex w-full justify-end gap-2">
          <button
            onClick={() => deleteFileHandler()}
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
