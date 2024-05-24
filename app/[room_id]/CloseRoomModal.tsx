import React from "react";
import { deleteRoom } from "../_actions/actions";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function CloseRoomModal({
  showCloseRoomModal,
  roomId,
  setShowCloseRoomModal,
}: {
  showCloseRoomModal: boolean;
  roomId: string;
  setShowCloseRoomModal: (value: boolean) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const router = useRouter();
  const submitHandler = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      toast.loading("Closing room", { id: "close-room" });
      await deleteRoom(roomId);
      setLoading(false);
      toast.success("Room closed", { id: "close-room" });
      setShowCloseRoomModal(false);
      router.push("/");
    } catch (e: any) {
      console.log("error", e);
      setError(e.message);
      toast.error(e.message, { id: "close-room" });
    } finally {
      setLoading(false);
    }
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
            className="destructive-button"
          >
            {!loading ? "Close" : <LoaderCircle className="animate-spin" />}
          </button>
        </div>
      </div>
    </div>
  );
}
