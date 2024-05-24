import React from "react";

export default function CloseRoomModal({
  showCloseRoomModal,
  setShowCloseRoomModal,
}: {
  showCloseRoomModal: boolean;
  setShowCloseRoomModal: (value: boolean) => void;
}) {
  const submitHandler = (e: any) => {
    e.preventDefault();
    console.log("Closing Room");
    setShowCloseRoomModal(false);
  };

  if (!showCloseRoomModal) return null;
  return (
    <div
      onClick={() => setShowCloseRoomModal(false)}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content w-full max-w-lg rounded-lg bg-white p-4"
      >
        <h1 className="text-start text-2xl font-bold">Are you sure?</h1>
        <h4 className="my-1 max-w-sm text-start text-sm text-zinc-500">
          You are about to close the room. This will delete all the files
          uploaded to the room.
        </h4>
        <div className="mt-4 flex w-full items-center justify-end gap-3">
          <button
            className="secondary-button"
            onClick={() => setShowCloseRoomModal(false)}
          >
            Cancel
          </button>
          <button
            onClick={(e) => submitHandler(e)}
            className="destrutive-button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
