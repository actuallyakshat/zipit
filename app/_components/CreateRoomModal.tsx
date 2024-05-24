import React, { useEffect } from "react";
import { createRoom } from "../_actions/actions";
import { useRouter } from "next/navigation";

export default function CreateRoomModal({
  showCreateRoomModal,
  setShowCreateRoomModal,
}: {
  showCreateRoomModal: boolean;
  setShowCreateRoomModal: (value: boolean) => void;
}) {
  const [roomCode, setRoomCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const [error, setError] = React.useState("");
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newRoom = await createRoom(roomCode);
      console.log("new room", newRoom);
      router.push(`/${newRoom.roomid}`);
    } catch (e: any) {
      console.log("error", e);
      setError(e.message);
    }
  };

  useEffect(() => {
    setError("");
  }, [showCreateRoomModal]);

  useEffect(() => {
    console.log(error);
  }, [error]);

  if (!showCreateRoomModal) return null;
  return (
    <div
      onClick={() => setShowCreateRoomModal(false)}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content w-full max-w-lg rounded-lg bg-white p-4"
      >
        <h1 className="text-2xl font-bold">Create Room</h1>
        <h4 className="text-sm text-zinc-500">
          Assign a code to your room to allow other devices to join
        </h4>
        <form className="my-4" onSubmit={(e) => submitHandler(e)}>
          {error && (
            <p className="mb-1 text-sm font-medium text-red-500">{error}</p>
          )}
          <input
            type="text"
            placeholder="Room Code"
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full rounded-lg border px-2 py-2 text-sm placeholder:font-medium"
          />
          <p className="py-1 pl-1 text-sm font-medium text-zinc-500">
            Try to use a unique code to prevent unauthorized access
          </p>

          <div className="mt-4 flex w-full items-center justify-end gap-3">
            <button
              className="secondary-button"
              onClick={() => setShowCreateRoomModal(false)}
            >
              Cancel
            </button>
            <button className="primary-button">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}