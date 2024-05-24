"use client";
import React from "react";
import JoinRoomModal from "./JoinRoomModal";
import CreateRoomModal from "./CreateRoomModal";
export default function NavbarModalTriggers() {
  const [showCreateRoomModal, setShowCreateRoomModal] = React.useState(false);
  const [showJoinRoomModal, setShowJoinRoomModal] = React.useState(false);
  return (
    <div>
      <button
        onClick={() => setShowCreateRoomModal(true)}
        className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-300/40"
      >
        Create Room
      </button>
      <button
        onClick={() => setShowJoinRoomModal(true)}
        className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-300/40"
      >
        Join Room
      </button>
      <CreateRoomModal
        showCreateRoomModal={showCreateRoomModal}
        setShowCreateRoomModal={setShowCreateRoomModal}
      />
      <JoinRoomModal
        showJoinRoomModal={showJoinRoomModal}
        setShowJoinRoomModal={setShowJoinRoomModal}
      />
    </div>
  );
}
