import { useEffect, useState } from "react";
import { useCrud } from "../../../hooks/useCrud";
import { useFilter } from "../../../hooks/useFilter";
import Pagination from "../../../components/Pagination";
import CrudModal from "../../../components/CrudModal";
import DeleteModal from "../../../components/DeleteModal";
import { addSubject, deleteSubject, getMajorInSubject, getSubject, updateSubject } from "../../../api/academic/subject";

type SubjectData = {
  id: number;
  subjectName: string;
  subjectCode: string;
  credit: number;
  majorID: number;
  majorName: string;
};

type MajorData = {
  id: number;
  majorName: string;
};

function Subject() {
  const {
    data: subjects,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud<SubjectData>({
    fetchFn: getSubject,
    createFn: addSubject,
    updateFn: updateSubject,
    deleteFn: deleteSubject,
  });

  // LOAD Major DATA
  const [majorList, setMajorList] = useState<MajorData[]>([]);
  useEffect(() => {
    async function loadData() {
      const res = await getMajorInSubject();
      setMajorList(res);
    }
    loadData();
  }, []);

  // UI state
  const [showModal, setShowModal] = useState(false);
  const [editSubject, setEditSubject] = useState<SubjectData | null>(null);
  const [subject, setSubject] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [majorID, setMajorID] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Search + Pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const filtered = useFilter({
    data: subjects,
    search,
    searchFields: ["subjectName", "subjectCode", "majorName"],
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // ---------------- HANDLERS ----------------
  const openCreate = () => {
    setEditSubject(null);
    setSubject("");
    setSubjectCode("");
    setMajorID(0);
    setCredit(0);
    setShowModal(true);
  };

  const openEdit = (sub: SubjectData) => {
    setEditSubject(sub);
    setSubject(sub.subjectName);
    setSubjectCode(sub.subjectCode);
    setMajorID(sub.majorID);
    setCredit(sub.credit);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (editSubject) {
      await updateItem(editSubject.id, { subjectName: subject, subjectCode, majorID, credit });
    } else {
      await createItem({ subjectName: subject, subjectCode, majorID, credit });
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
      {/* Header */}
      <div className="d-flex justify-content-between mb-3">
        <h4>📚 Subject Management</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Subject
        </button>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search subjects..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="card p-3 shadow-sm mb-3">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject Name</th>
              <th>Code</th>
              <th>Credit</th>
              <th>Major</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.id}</td>
                <td>{sub.subjectName}</td>
                <td>{sub.subjectCode}</td>
                <td>{sub.credit}</td>
                <td>{sub.majorName}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(sub)}>
                    ✏ Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(sub.id)}>
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Create/Edit Modal */}
      <CrudModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        title={editSubject ? "Edit Subject" : "Add Subject"}
        submitText={editSubject ? "Update" : "Create"}
        isValid={!!subject.trim() && !!subjectCode.trim() && !!majorID && credit > 0}
      >
        <div className="mb-2">
          <label className="form-label">Subject Name *</label>
          <input className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="mb-2">
          <label className="form-label">Subject Code *</label>
          <input className="form-control" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} />
        </div>
        <div className="mb-2">
          <label className="form-label">Credit *</label>
          <input type="number" className="form-control" value={credit} onChange={(e) => setCredit(Number(e.target.value))} />
        </div>
        <div className="mb-2">
          <label className="form-label">Major *</label>
          <select className="form-select" value={majorID} onChange={(e) => setMajorID(Number(e.target.value))}>
            <option value={0}>Select Major</option>
            {majorList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.majorName}
              </option>
            ))}
          </select>
        </div>
      </CrudModal>

      {/* Delete Modal */}
      <DeleteModal
        show={showDelete}
        onCancel={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this subject?"
      />
    </div>
  );
}

export default Subject;
