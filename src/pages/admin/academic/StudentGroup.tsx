import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCrud } from "../../../hooks/useCrud";
import { useFilter } from "../../../hooks/useFilter";
import Pagination from "../../../components/Pagination";
import CrudModal from "../../../components/CrudModal";
import DeleteModal from "../../../components/DeleteModal";
import {
  addStudentGroup,
  deleteStudentGroup,
  getStudentGroup,
  updateStudentGroup,
  getSubjectInStudentGroup,
} from "../../../api/academic/studentGroup";

/* ---------------- TYPES ---------------- */
type StudentGroupData = {
  id: number;
  groupName: string;
  generation: number;
  generationYear: number;
  majorID: number;
  majorName: string;
};

type SubjectData = {
  id: number;
  majorName: string;
};

function StudentGroups() {
  const {
    data: studentGroups,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud<StudentGroupData>({
    fetchFn: getStudentGroup,
    createFn: addStudentGroup,
    updateFn: updateStudentGroup,
    deleteFn: deleteStudentGroup,
  });

  const [majorList, setMajorList] = useState<SubjectData[]>([]);
  useEffect(() => {
    getSubjectInStudentGroup().then(setMajorList);
  }, []);

  console.log(studentGroups )

  /* ---------------- STATE ---------------- */
  const [showModal, setShowModal] = useState(false);
  const [editGroup, setEditGroup] = useState<StudentGroupData | null>(null);
  const [groupName, setGroupName] = useState("");
  const [generation, setGeneration] = useState<number>(0);
  const [generationYear, setGenerationYear] = useState<number>(0);
  const [majorID, setMajorID] = useState<number>(0);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* ---------------- SEARCH + PAGINATION ---------------- */
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const filtered = useFilter({
    data: studentGroups,
    search,
    searchFields: ["groupName", "generation", "generationYear", "majorName"],
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  /* ---------------- HANDLERS ---------------- */
  const openCreate = () => {
    setEditGroup(null);
    setGroupName("");
    setGeneration(0);
    setGenerationYear(0);
    setMajorID(0);
    setShowModal(true);
  };

  const openEdit = (g: StudentGroupData) => {
    setEditGroup(g);
    setGroupName(g.groupName);
    setGeneration(g.generation);
    setGenerationYear(g.generationYear);
    setMajorID(g.majorID);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const payload = { groupName, generation, generationYear, majorID };
    editGroup
      ? await updateItem(editGroup.id, payload)
      : await createItem(payload);
    setShowModal(false);
  };

  const confirmDelete = async () => {
    if (deleteId) await deleteItem(deleteId);
    setShowDelete(false);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>👥 Student Groups</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Group
        </button>
      </div>

      <input
        className="form-control mb-3"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <div className="card p-3 shadow-sm">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Group Name</th>
              <th>Generation</th>
              <th>Year</th>
              <th>Major</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((g) => (
              <tr key={g.id}>
                <td>{g.id}</td>

                {/* CLICKABLE GROUP NAME */}
                <td>
                  <Link
                    to={`/admin/studentgroupmembers/${g.id}`}
                    style={{color: "blue" , textDecoration: "underline"}}
                  >
                    {g.groupName}
                  </Link>
                </td>

                <td>{g.generation}</td>
                <td>{g.generationYear}</td>
                <td>{g.majorName}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => openEdit(g)}
                  >
                    ✏ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      setDeleteId(g.id);
                      setShowDelete(true);
                    }}
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

      {/* MODALS */}
      <CrudModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        title={editGroup ? "Edit Group" : "Add Group"}
        submitText={editGroup ? "Update" : "Create"}
        isValid={!!groupName && generation > 0 && generationYear > 0 && majorID > 0}
      >
        <input className="form-control mb-2" placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
        <input className="form-control mb-2" type="number" placeholder="Generation" value={generation} onChange={(e) => setGeneration(+e.target.value)} />
        <input className="form-control mb-2" type="number" placeholder="Year" value={generationYear} onChange={(e) => setGenerationYear(+e.target.value)} />
        <select className="form-select" value={majorID} onChange={(e) => setMajorID(+e.target.value)}>
          <option value={0}>Select Major</option>
          {majorList.map(s => <option key={s.id} value={s.id}>{s.majorName}</option>)}
        </select>
      </CrudModal>

      <DeleteModal
        show={showDelete}
        onCancel={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        message="Delete this group?"
      />
    </div>
  );
}

export default StudentGroups;
