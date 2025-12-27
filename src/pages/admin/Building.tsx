// import React, { useEffect, useState } from "react";
// import {
//   addBuilding,
//   deleteBuilding,
//   getBuilding,
//   updateBuilding,
// } from "../../api/building";
// import { useFilter } from "../../hooks/useFilter";
// import Pagination from "../../components/Pagination";
// import { Modal, Button } from "react-bootstrap";

// type BuildingData = {
//   id: number;
//   buildingName: string;
// };

// function Building() {
//   // --- STATES ---
//   const [buildings, setbuildings] = useState<BuildingData[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editBuilding, setEditBuilding] = useState<BuildingData | null>(null);

//   const [buildingName, setBuildingName] = useState("");

//   // Pagination & search
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const PAGE_SIZE = 5;

//   // --- FETCH DATA ---
//   useEffect(() => {
//     async function loadData() {
//       try {
//         const buildingsData = await getBuilding();
//         setbuildings(buildingsData ?? []);
//       } catch (err) {
//         console.error(err);
//       }
//     }
//     loadData();
//   }, []);

//   // --- FILTER & PAGINATION ---
//   const filteredBuilding = useFilter({
//     data: buildings,
//     search,
//     searchFields: ["id", "buildingName"],
//   });

//   const totalPages = Math.ceil(filteredBuilding.length / PAGE_SIZE);
//   const paginatedBuildings = filteredBuilding.slice(
//     (page - 1) * PAGE_SIZE,
//     page * PAGE_SIZE
//   );

//   // --- FORM VALIDATION ---
//   const isFormValid = buildingName.trim() !== "";

//   // --- MODAL HANDLERS ---
//   const openCreateModal = () => {
//     setEditBuilding(null);
//     setBuildingName("");
//     setShowModal(true);
//   };

//   const openEditModal = (building: BuildingData) => {
//     setEditBuilding(building);
//     setBuildingName(building.buildingName);
//     setShowModal(true);
//   };

//   const closeModal = () => setShowModal(false);

//   const handleSubmit = async () => {
//     if (!isFormValid) return;

//     if (editBuilding) {
//       // TODO: Update room API call
//       try {
//         const res = await updateBuilding(editBuilding.id, { buildingName });
//         if (res) {
//           setbuildings(
//             buildings.map((r) =>
//               r.id === editBuilding.id ? { ...r, buildingName } : r
//             )
//           );
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     } else {
//       // TODO: Create room API call
//       try {
//         const res = await addBuilding({ buildingName });
//         setbuildings([...buildings, res]);
//       } catch (err) {
//         console.error(err);
//       }
//     }

//     setShowModal(false);
//   };

//   // DELTE
//   const [showDelete, setshowDelete] = useState(false);
//   const [idDelete, setIdDelete] = useState(Number);

//   const handleDelete = (room: BuildingData) => {
//     // TODO: Delete room API call
//     if (!room) return;
//     setshowDelete(true);
//     setIdDelete(room.id);
//   };
//   const confirmDelete = async () => {
//     try {
//       const res = await deleteBuilding(idDelete);
//       if (res) {
//         setbuildings(buildings.filter((r) => r.id !== idDelete));
//       }
//       setshowDelete(false);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       {/* HEADER */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h4>🏠 building Management</h4>
//         <button className="btn btn-primary" onClick={openCreateModal}>
//           + Add building
//         </button>
//       </div>

//       {/* TABLE */}
//       <div className="card p-3 shadow">
//         <table className="table table-hover table-striped mb-0">
//           <thead className="thead-dark">
//             <tr>
//               <th>ID</th>
//               <th>Building</th>
//               <th style={{ width: "160px" }}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedBuildings.length === 0 ? (
//               <tr className="bg-light text-center">
//                 <td colSpan={6}>No building found</td>
//               </tr>
//             ) : (
//               paginatedBuildings.map((r) => (
//                 <tr key={r.id}>
//                   <td>{r.id}</td>
//                   <td>{r.buildingName}</td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline-primary me-2"
//                       onClick={() => openEditModal(r)}
//                     >
//                       ✏ Edit
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => handleDelete(r)}
//                     >
//                       🗑 Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION */}
//       <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

//       {/* MODAL */}
//       <Modal show={showModal} onHide={closeModal} centered>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSubmit();
//           }}
//         >
//           <Modal.Header closeButton className="bg-light">
//             <Modal.Title className="fw-semibold">
//               {editBuilding ? "✏️ Edit building" : "➕ Create building"}
//             </Modal.Title>
//           </Modal.Header>

//           <Modal.Body>
//             <div className="mb-3">
//               <label className="form-label fw-semibold">
//                 Building <span className="text-danger">*</span>
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 required
//                 value={buildingName}
//                 onChange={(e) => setBuildingName(e.target.value)}
//               />
//             </div>
//           </Modal.Body>

//           <Modal.Footer>
//             <button
//               type="button"
//               className="btn btn-outline-secondary"
//               onClick={closeModal}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={!isFormValid}
//             >
//               {editBuilding ? "Update building" : "Create building"}
//             </button>
//           </Modal.Footer>
//         </form>
//       </Modal>

//       {/* Pop up Delete User  */}
//       <Modal show={showDelete} onHide={() => setshowDelete(false)} centered>
//         <Modal.Header>
//           <Modal.Title>⚠️ Confirm Delete</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           Are you sure you want to delte this building ?
//           <br />
//           <strong></strong>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setshowDelete(false)}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={confirmDelete}>
//             yes, Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default Building;

import React, { useState } from "react"; 
import {
  getBuilding,
  addBuilding,
  updateBuilding,
  deleteBuilding,
} from "../../api/building";
import { useCrud } from "../../hooks/useCrud";
import CrudModal from "../../components/CrudModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { useFilter } from "../../hooks/useFilter";

type BuildingData = {
  id: number;
  buildingName: string;
};

function Building() {
  const {
    data: buildings,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud<BuildingData>({
    fetchFn: getBuilding,
    createFn: addBuilding,
    updateFn: updateBuilding,
    deleteFn: deleteBuilding,
  });

  // UI state
  const [showModal, setShowModal] = useState(false);
  const [editBuilding, setEditBuilding] = useState<BuildingData | null>(null);
  const [buildingName, setBuildingName] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // search + pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const filtered = useFilter({
    data: buildings,
    search,
    searchFields: ["id", "buildingName"],
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // ---------------- HANDLERS ----------------

  const openCreate = () => {
    setEditBuilding(null);
    setBuildingName("");
    setShowModal(true);
  };

  const openEdit = (building: BuildingData) => {
    setEditBuilding(building);
    setBuildingName(building.buildingName);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!buildingName.trim()) return;

    if (editBuilding) {
      await updateItem(editBuilding.id, { buildingName });
    } else {
      await createItem({ buildingName });
    }

    setShowModal(false);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      await deleteItem(deleteId);
    }
    setShowDelete(false);
  };

  // ---------------- UI ----------------

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>🏠 Building Management</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Building
        </button>
      </div>

      {/* FILTER SEARCH */}
      <div className="card p-3 mb-3 shadow-sm">
        <div className="row g-2">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="🔍 Search by ID OR Name "
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card p-3 shadow">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Building</th>
              <th style={{ width: "160px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.buildingName}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => openEdit(b)}
                  >
                    ✏ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteClick(b.id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* CREATE / EDIT MODAL */}
      <CrudModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        title={editBuilding ? "Edit Building" : "Create Building"}
        submitText={editBuilding ? "Update" : "Create"}
        isValid={!!buildingName.trim()}
      >
        <label className="form-label fw-semibold">Building Name</label>
        <input
          className="form-control"
          value={buildingName}
          onChange={(e) => setBuildingName(e.target.value)}
        />
      </CrudModal>

      {/* DELETE MODAL */}
      <DeleteModal
        show={showDelete}
        onCancel={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this building?"
      />
    </div>
  );
}

export default Building;
