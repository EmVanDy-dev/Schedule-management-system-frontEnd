import React, { useEffect, useState } from "react";
import { createRoom, deleteRoom, getRoom, updateRoom } from "../../api/room";
import { getBuilding } from "../../api/building";
import { useFilter } from "../../hooks/useFilter";
import Pagination from "../../components/Pagination";
import { Modal , Button } from "react-bootstrap";

type RoomData = {
  id: number;
  roomName: string;
  buildingID: number;
  capacity: number;
  roomType: string;
  buildingName: string;
};

type Building = {
  id: number;
  buildingName: string;
};

function Room() {
  // --- STATES ---
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [buildingList, setBuildingList] = useState<Building[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom] = useState<RoomData | null>(null);

  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState<number>(0);
  const [roomType, setRoomType] = useState("");
  const [buildingID, setBuildingID] = useState<number | "">("");
  const [buildingName , setBuildingName ] = useState("");

  // Pagination & search
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  // --- FETCH DATA ---
  useEffect(() => {
    async function loadData() {
      try {
        const roomsData = await getRoom();
        const buildingsData = await getBuilding();
        setRooms(roomsData ?? []);
        setBuildingList(buildingsData ?? []);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  // --- FILTER & PAGINATION ---
  const filteredRooms = useFilter({
    data: rooms,
    search,
    searchFields: ["id", "roomName", "buildingID", "roomType"],
  });

  const totalPages = Math.ceil(filteredRooms.length / PAGE_SIZE);
  const paginatedRooms = filteredRooms.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // --- FORM VALIDATION ---
  const isFormValid =
    roomName.trim() !== "" &&
    capacity > 0 &&
    roomType.trim() !== "" &&
    buildingID !== "";

  // --- MODAL HANDLERS ---
  const openCreateModal = () => {
    setEditRoom(null);
    setRoomName("");
    setCapacity(0);
    setRoomType("");
    setBuildingID("");
    setShowModal(true);
  };

  const openEditModal = (room: RoomData) => {
    setEditRoom(room);
    setRoomName(room.roomName);
    setCapacity(room.capacity);
    setRoomType(room.roomType);
    setBuildingID(room.buildingID);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    if (editRoom) {
      // TODO: Update room API call
      try {
        const res = await updateRoom(editRoom.id, {
          roomName,
          capacity,
          roomType,
          buildingID,
        });
        if (res) {
          const buildingNameUpdate = buildingList.find(n=> n.id === buildingID)?.buildingName
          setRooms(
            rooms.map((r) =>
              r.id === editRoom.id ? { ...r, roomName, roomType, capacity , buildingNameUpdate} : r
            )
          );
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // TODO: Create room API call
      try{
        const res = await createRoom({roomName,capacity,roomType,buildingID});
        setRooms([...rooms,res]);
      }catch(err){
        console.error(err);
      }
      console.log("Creating room:", {
        roomName,
        capacity,
        roomType,
        buildingID,
      });
    }

    setShowModal(false);
  };

  // DELTE 
  const [showDelete , setshowDelete] = useState(false);
  const [ idDelete , setIdDelete ] = useState(Number);

  const handleDelete = (room: RoomData) => {
    // TODO: Delete room API call
    if(!room) return;
    setshowDelete(true);
    setIdDelete(room.id);
    
  };
  const confirmDelete = ()=>{
    try{
      const res = deleteRoom(idDelete);
      setshowDelete(false);
      setRooms(rooms.filter(r=> r.id !== idDelete ))
    }catch(err){
      console.error(err)
    }
  }

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>🏠 Room Management</h4>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Add Room
        </button>
      </div>

      {/* TABLE */}
      <div className="card p-3 shadow">
        <table className="table table-hover table-striped mb-0">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Room Name</th>
              <th>Capacity</th>
              <th>Type</th>
              <th>Building</th>
              <th style={{ width: "160px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRooms.length === 0 ? (
              <tr className="bg-light text-center">
                <td colSpan={6}>No room found</td>
              </tr>
            ) : (
              paginatedRooms.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.roomName}</td>
                  <td>{r.capacity}</td>
                  <td>{r.roomType}</td>
                  <td>{r.buildingName}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEditModal(r)}
                    >
                      ✏ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(r)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* MODAL */}
      <Modal show={showModal} onHide={closeModal} centered>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Modal.Header closeButton className="bg-light">
            <Modal.Title className="fw-semibold">
              {editRoom ? "✏️ Edit Room" : "➕ Create Room"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Room Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                required
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Capacity <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                required
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(e.target.valueAsNumber)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Room Type <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                required
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Building <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                required
                value={buildingID}
                onChange={(e) => setBuildingID(Number(e.target.value) )}
              >
                <option value="">Select a building</option>
                {buildingList.map((b) => (
                  
                  <option key={b.id} value={b.id} >
                    {b.buildingName}
                  </option>
                ))}
              </select>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isFormValid}
            >
              {editRoom ? "Update Room" : "Create Room"}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Pop up Delete User  */}
      <Modal show={showDelete} onHide={() => setshowDelete(false)} centered>
        <Modal.Header>
          <Modal.Title>⚠️ Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delte this room ?
          <br />
          <strong></strong>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setshowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Room;
