import { useEffect, useState } from "react";
import { useCrud } from "../../../hooks/useCrud";
import { useFilter } from "../../../hooks/useFilter";
import Pagination from "../../../components/Pagination";
import CrudModal from "../../../components/CrudModal";
import DeleteModal from "../../../components/DeleteModal";
import {
  addMajor,
  deleteMajor,
  getMajor,
  updateMajor,
} from "../../../api/academic/major";
import { getDeparetment } from "../../../api/department";

type MajorData = {
  id: number;
  majorName: string;
  majorCode: string;
  departmentID: number;
  departmentName: string;
};

type DepartmentData = {
  id: number;
  departmentName: string;
};

function Major() {
  const {
    data: majors,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud<MajorData>({
    fetchFn: getMajor,
    createFn: addMajor,
    updateFn: updateMajor,
    deleteFn: deleteMajor,
  });

  // LOAD DEPARTMENT DATA
  const [departmentList, setdepartmentList] = useState<DepartmentData[]>([]);
  useEffect(() => {
    async function loadData() {
      const res = await getDeparetment();
      setdepartmentList(res);
    }
    loadData();
  }, []);

  // UI state
  const [showModal, setShowModal] = useState(false);
  const [editeMajor, setEditMajor] = useState<MajorData | null>(null);
  const [majorName, setMajorName] = useState("");
  const [majorCode, setMajorCode] = useState("");
  const [departmentID, setDepartmentID] = useState<number>(0);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Search + Pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const filtered = useFilter({
    data: majors,
    search,
    searchFields: ["id", "majorName", "majorCode"],
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // ---------------- HANDLERS ----------------

  const openCreate = () => {
    setEditMajor(null);
    setMajorName("");
    setMajorCode("");
    setDepartmentID(0);
    setShowModal(true);
  };

  const openEdit = (major: MajorData) => {
    setEditMajor(major);
    setMajorName(major.majorName);
    setMajorCode(major.majorCode);
    setDepartmentID(major.departmentID);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    // if (!departmentName.trim()) return;

    if (editeMajor) {
      await updateItem(editeMajor.id, { majorName, majorCode, departmentID });
    } else {
      await createItem({ majorName, majorCode, departmentID });
    }

    setShowModal(false);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) await deleteItem(deleteId);
    setShowDelete(false);
  };

  // ---------------- UI ----------------
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>🏬 Major Management</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Major
        </button>
      </div>

      {/* FILTER SEARCH */}
      <div className="card p-3 mb-3 shadow-sm">
        <div className="rom g-2">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="🔍 Search by .."
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
              <th>Major</th>
              <th>Code</th>
              <th>Department</th>
              <th style={{ width: "160px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.majorName}</td>
                <td>{d.majorCode}</td>
                <td>{d.departmentName}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => openEdit(d)}
                  >
                    ✏ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteClick(d.id)}
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
        title={editeMajor ? "Edite Department" : "Create Department"}
        submitText={editeMajor ? "Update" : "Create"}
        isValid={!!majorCode.trim() && !!majorName.trim() && !!departmentID}
      >
        <label className="form-label fw-semibold">Major Name </label>
         <span className="text-danger">*</span>
        <input
          className="form-control"
          value={majorName}
          onChange={(e) => setMajorName(e.target.value)}
        />
        <label className="form-label fw-semibold">Major Code </label>
         <span className="text-danger">*</span>
        <input
          className="form-control"
          value={majorCode}
          onChange={(e) => setMajorCode(e.target.value)}
        />

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Department <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            required
            value={departmentID}
            onChange={(e) => setDepartmentID(Number(e.target.value))}
          >
            <option value="">Select a department</option>
            {departmentList.map((d) => (
              <option key={d.id} value={d.id}>
                {d.departmentName}
              </option>
            ))}
          </select>
        </div>
      </CrudModal>

      {/* DELETE MODAL */}
      <DeleteModal
        show={showDelete}
        onCancel={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this department ?"
      />
    </div>
  );
}

export default Major;
