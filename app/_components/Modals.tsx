"use client";
import React from "react";
import CreateRoomModal from "./CreateRoomModal";
import JoinRoomModal from "./JoinRoomModal";
export default function Modals() {
  const [showCreateRoomModal, setShowCreateRoomModal] = React.useState(false);
  const [showJoinRoomModal, setShowJoinRoomModal] = React.useState(false);
  return (
    <div className="mt-3 flex justify-center gap-3 lg:justify-start">
      <CreateRoomModal
        showCreateRoomModal={showCreateRoomModal}
        setShowCreateRoomModal={setShowCreateRoomModal}
      />
      <JoinRoomModal
        showJoinRoomModal={showJoinRoomModal}
        setShowJoinRoomModal={setShowJoinRoomModal}
      />
      <button
        className="primary-button"
        onClick={() => setShowCreateRoomModal(true)}
      >
        Create Room
      </button>
      <button
        className="secondary-button"
        onClick={() => setShowJoinRoomModal(true)}
      >
        Join Room
      </button>
    </div>
  );
}
