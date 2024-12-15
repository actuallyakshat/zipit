import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { checkRoomExists } from "../_actions/actions";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function JoinRoomModal({
  showJoinRoomModal,
  setShowJoinRoomModal,
}: {
  showJoinRoomModal: boolean;
  setShowJoinRoomModal: (value: boolean) => void;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  const [roomCode, setRoomCode] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      toast.loading("Checking room code", { id: "find-room" });
      const room = await checkRoomExists(roomCode);
      if (room) {
        toast.success("Joining Room", { id: "find-room" });
        router.push(`/${roomCode}`);
      }
    } catch (e: any) {
      toast.error("We couldn't join this room. Are you sure it exists?", {
        id: "find-room",
      });
      setError("Something went wrong.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showJoinRoomModal && ref.current) {
      setError("");
      ref.current?.focus();
    }
  }, [showJoinRoomModal, ref]);

  if (!showJoinRoomModal) return null;

  return (
    <div
      onClick={() => setShowJoinRoomModal(false)}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm"
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
          {error && (
            <p className="mb-1 text-sm font-medium text-red-500">{error}</p>
          )}
          <input
            type="number"
            placeholder="Room Code"
            ref={ref}
            onChange={(e) => setRoomCode(Number(e.target.value))}
            className="w-full rounded-lg border px-2 py-2 text-sm placeholder:font-medium"
          />

          <div className="mt-4 flex w-full items-center justify-end gap-3">
            <button
              className="secondary-button"
              type="button"
              disabled={loading}
              onClick={() => setShowJoinRoomModal(false)}
            >
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={loading}>
              {!loading ? "Join" : <LoaderCircle className="animate-spin" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
