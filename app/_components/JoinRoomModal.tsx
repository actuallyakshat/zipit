import React from "react";

export default function JoinRoomModal({
  showJoinRoomModal,
  setShowJoinRoomModal,
}: {
  showJoinRoomModal: boolean;
  setShowJoinRoomModal: (value: boolean) => void;
}) {
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Joining Room");
    setShowJoinRoomModal(false);
  };

  if (!showJoinRoomModal) return null;

  return (
    <div
      onClick={() => setShowJoinRoomModal(false)}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content w-full max-w-lg rounded-lg bg-white p-4"
      >
        <h1 className="text-2xl font-bold">Join Room</h1>
        <h4 className="text-sm text-zinc-500">
          Enter the code to join the room.
        </h4>
        <form className="my-4" onSubmit={(e) => submitHandler(e)}>
          <input
            type="text"
            placeholder="Room Code"
            className="w-full rounded-lg border px-2 py-2 text-sm placeholder:font-medium"
          />

          <div className="mt-4 flex w-full items-center justify-end gap-3">
            <button
              className="secondary-button"
              onClick={() => setShowJoinRoomModal(false)}
            >
              Cancel
            </button>
            <button className="primary-button" type="submit">
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
