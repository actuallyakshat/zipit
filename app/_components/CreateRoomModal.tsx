import React, { useEffect } from "react";
import { createRoom } from "../_actions/actions";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateRoomModal({
  showCreateRoomModal,
  setShowCreateRoomModal,
}: {
  showCreateRoomModal: boolean;
  setShowCreateRoomModal: (value: boolean) => void;
}) {
  const [roomCode, setRoomCode] = React.useState<number>(0);
  const [success, setSuccess] = React.useState(false);
  const ref = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const [error, setError] = React.useState("");

  const createRoomHandler = async () => {
    setLoading(true);
    try {
      const newRoom = await createRoom();
      setRoomCode(newRoom.roomId);
      toast.success("Room created");
      setSuccess(true);
      router.push(`/${newRoom.roomId}`);
    } catch (e: any) {
      console.error("We couldn't create a room. Please try again later.");
      setError("We couldn't create a room. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError("");
  }, [showCreateRoomModal]);

  useEffect(() => {
    if (showCreateRoomModal && ref.current) {
      ref.current.focus();
    }
  }, [showCreateRoomModal]);

  if (!showCreateRoomModal) return null;

  return (
    <div
      onClick={() => setShowCreateRoomModal(false)}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-8 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content w-full max-w-lg rounded-lg bg-white p-4 px-8"
      >
        {!success ? (
          <>
            <h1 className="text-2xl font-bold">Create Room</h1>
            <h4 className="text-sm text-zinc-500">
              Assign a code to your room to allow other devices to join
            </h4>
            <div className="mt-4 flex w-full items-center justify-end gap-3">
              <button
                className="secondary-button"
                onClick={() => setShowCreateRoomModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={createRoomHandler}
                className="primary-button"
                disabled={loading}
              >
                {!loading ? (
                  "Create"
                ) : (
                  <LoaderCircle className="animate-spin" />
                )}
              </button>
            </div>
          </>
        ) : (
          <div>
            <h1 className="text-2xl font-bold">Room created</h1>
            <h4 className="text-sm text-zinc-500">
              You will be redirected to the room page shortly
            </h4>
            <h2 className="mb-3 mt-6 text-center text-2xl font-extrabold">
              Room Code: {roomCode}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
