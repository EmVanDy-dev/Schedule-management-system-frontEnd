// import { useEffect, useState } from "react";
// import {
//   addGroupMember,
//   deleteGroupMember,
//   getAllGroupMembers,
//   getAllStudents,
//   updateGroupMember,
// } from "../../../api/academic/studentGroupMemmeber";
// import { useCrud } from "../../../hooks/useCrud";
// import { useFilter } from "../../../hooks/useFilter";
// import { getStudentGroup } from "../../../api/academic/studentGroup";
// import Pagination from "../../../components/Pagination";
// import DeleteModal from "../../../components/DeleteModal";
// import CrudModal from "../../../components/CrudModal";
// import StudentGroupMembers from "./StudentGroupMemmber";
// import type {
//   StudentGroupMemberData,
//   StudentGroupData,
//   Student,
// } from "../../../model";

// function StudentGroupMemberTap() {
//   const {
//     data: studentGroupMembers,
//     createItem,
//     updateItem,
//     deleteItem,
//   } = useCrud<StudentGroupMemberData>({
//     fetchFn: getAllGroupMembers,
//     createFn: addGroupMember,
//     updateFn: updateGroupMember,
//     deleteFn: deleteGroupMember,
//   });

//   // UI state
//   const [showModal, setShowModal] = useState(false);
//   const [editStudentGroup, setEditStudentGroup] =
//     useState<StudentGroupMemberData | null>(null);
//   const [studentGroups, setStudentGroups] = useState<StudentGroupData[]>([]);

//   const [studentID, setStudentID] = useState<number>(0);
//   const [groupID, setGroupID] = useState<number>(0);

//   const [showDelete, setShowDelete] = useState(false);
//   const [deleteID, setDeleteID] = useState<number | null>(null);

//   // This relate to student
//   const [studentSearch, setStudentSearch] = useState("");
//   const [selectedStudentId, setSelectedStudentId] = useState<number>(0);
//   const [loading, setLoading] = useState(false);
//   const [students, setStudent] = useState<Student[]>([]);

//   const loadStudents = async () => {
//     try {
//       const res = await getAllStudents();
//       setStudent(res || []);
//     } catch (e: any) {
//       console.error(e);
//     }
//   };

//   // LOAD STUDENT
//   useEffect(() => {
//     loadStudents();
//   }, []);

//   // FILTER AVAILABLE STUDENTS (not already members)
//   const memberStudentIds = new Set(studentGroupMembers.map((m) => m.studentID));
//   const availableStudents = students.filter((s) => !memberStudentIds.has(s.id));

//   const filteredStudents = availableStudents.filter(
//     (s) =>
//       s.first_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
//       s.last_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
//       s.email.toLocaleLowerCase().includes(studentSearch.toLowerCase()) ||
//       s.id.toString().includes(studentSearch)
//   );

//   // Search + Pagination
//   const [search, setSearch] = useState("");
//   const [filterGroup, setFilterGroup] = useState("ALL");
//   const [page, setPage] = useState(1);
//   const PAGE_SIZE = 7;

//   const filtered = useFilter({
//     data: studentGroupMembers,
//     search: search,
//     searchFields: ["id", "studentID", "groupID", "groupName", "studentName"],
//     roleField: "groupName",
//     roleValue: filterGroup,
//   });

//   const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
//   const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

//   // ---------------- HANDLERS ----------------

//   const openCreate = () => {
//     setEditStudentGroup(null);
//     setStudentID(0);
//     setGroupID(0);
//     setShowModal(true);
//   };

//   const openEdit = (groupMember: StudentGroupMemberData) => {
//     setEditStudentGroup(groupMember);
//     setStudentID(groupMember.studentID);
//     setGroupID(groupMember.groupID);
//     setShowModal(true);
//   };

//   const handleSubmit = async () => {
//     if (!studentID && !groupID) return;

//     if (editStudentGroup) {
//       await updateItem(editStudentGroup.id, { studentID, groupID });
//     } else {
//       await createItem({ studentID, groupID });
//     }
//     setShowModal(false);
//   };

//   const handleDeleteClick = (id: number) => {
//     setDeleteID(id);
//     setShowDelete(true);
//   };
//   const confirmDelete = async () => {
//     if (deleteID !== null) {
//       await deleteItem(deleteID);
//     }
//     setShowDelete(false);
//   };

//   // Get Group Name
//   useEffect(() => {
//     getStudentGroup().then(setStudentGroups);
//   }, []);

//   // ---------------- UI ----------------

//   return (
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between mb-3">
//         <h3>📦 Group Student Section </h3>
//         <button className="btn btn-primary" onClick={openCreate}>
//           + Add Student to Group
//         </button>
//       </div>

//       {/* FILTER SEARCH */}
//       <div className="card p-3 mb-3 shadow-sm">
//         <div className="row g-2">
//           <div className="col-md-3">
//             <input
//               className="form-control"
//               placeholder="🔍 Search ..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//             />
//           </div>
//           <div className="col-md-3">
//             <select
//               className="form-select"
//               value={filterGroup}
//               onChange={(e) => {
//                 setFilterGroup(e.target.value);
//                 setPage(1);
//               }}
//             >
//               <option value="ALL">All Groups</option>
//               {studentGroups.map((s) => (
//                 <option key={s.id} value={s.groupName}>
//                   {s.groupName}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* TABLE  */}
//       <div className="card p-3 shadow">
//         <table className="table table-striped">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Group</th>
//               <th>Student</th>
//               <th style={{ width: "160px" }}>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginated.map((g) => (
//               <tr key={g.id}>
//                 <td>{g.id}</td>
//                 <td>{g.groupName}</td>
//                 <td>{g.studentName}</td>
//                 <td>
//                   <button
//                     className="btn btn-sm btn-outline-primary me-2"
//                     onClick={() => openEdit(g)}
//                   >
//                     ✏ Edit
//                   </button>
//                   <button
//                     className="btn btn-sm btn-outline-danger"
//                     onClick={() => handleDeleteClick(g.id)}
//                   >
//                     🗑 Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

//       {/* CREATE / EDIT MODAL  */}
//       <CrudModal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         onSubmit={handleSubmit}
//         title={editStudentGroup ? "Edit Group" : "Create Group"}
//         submitText={editStudentGroup ? "Update" : "Create"}
//         isValid={!!groupID && !!studentID}
//       >
//         <div className="mb-3">
//           <h6 className="mb-3 text-primary">
//             <i className="bi bi-person-plus-fill me-2"></i>
//             {} {/* data add here  */}
//           </h6>

//           {/* Search */}
//           <label
//             htmlFor="studentSearch"
//             className="form-label small text-muted"
//           >
//             Search Students
//           </label>
//           <input
//             id="studentSearch"
//             type="text"
//             className="form-control mb-3"
//             placeholder="Search by name, email, or ID..."
//             value={studentSearch}
//             onChange={(e) => setStudentSearch(e.target.value)}
//           />

//           {/* Select group */}
//           <label
//             htmlFor="studentSelect"
//             className="form-label small text-muted"
//           >
//             Select Group
//           </label>
//           <select
//             id="studentSelect"
//             className="form-select"
//             size={6}
//             value={groupID}
//             onChange={(e) => {setGroupID(+e.target.value)}}
//             disabled={loading}
//           >
//             <option value={0} disabled>
//               -- Choose a group --
//             </option>

//             {studentGroups.length === 0 ? (
//               <option disabled>
//                 No Group found
//               </option>
//             ) : (
//               studentGroups.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.id} {s.groupName}
//                 </option>
//               ))
//             )}
//           </select>


//           {/* Select student */}
//           <label
//             htmlFor="studentSelect"
//             className="form-label small text-muted"
//           >
//             Select Student
//           </label>
//           <select
//             id="studentSelect"
//             className="form-select"
//             size={6}
//             value={studentID}
//             onChange={(e) => setStudentID(+e.target.value)}
//             disabled={loading}
//           >
//             <option value={0} disabled>
//               -- Choose a student --
//             </option>

//             {filteredStudents.length === 0 ? (
//               <option disabled>
//                 {studentSearch
//                   ? "No students found"
//                   : "All students are already members"}
//               </option>
//             ) : (
//               filteredStudents.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.id} {s.first_name} {s.last_name} ({s.email})
//                 </option>
//               ))
//             )}
//           </select>

//           <div className="form-text mt-1">
//             {availableStudents.length} student(s) available
//           </div>
//         </div>
//       </CrudModal>

//       {/* DELETE MODAL  */}
//       <DeleteModal
//         show={showDelete}
//         onCancel={() => setShowDelete(false)}
//         onConfirm={confirmDelete}
//         message="Are you sure you want to delete this group?"
//       />
//     </div>
//   );
// }

// export default StudentGroupMemberTap;


import { useEffect, useState } from "react";
import {
  addGroupMember,
  deleteGroupMember,
  getAllGroupMembers,
  getAllStudents,
  updateGroupMember,
} from "../../../api/academic/studentGroupMemmeber";
import { useCrud } from "../../../hooks/useCrud";
import { useFilter } from "../../../hooks/useFilter";
import { getStudentGroup } from "../../../api/academic/studentGroup";
import Pagination from "../../../components/Pagination";
import DeleteModal from "../../../components/DeleteModal";
import CrudModal from "../../../components/CrudModal";
import type {
  StudentGroupMemberData,
  StudentGroupData,
  Student,
} from "../../../model";

function StudentGroupMemberTap() {
  /* ---------------- CRUD ---------------- */
  const {
    data: studentGroupMembers,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud<StudentGroupMemberData>({
    fetchFn: getAllGroupMembers,
    createFn: addGroupMember,
    updateFn: updateGroupMember,
    deleteFn: deleteGroupMember,
  });

  /* ---------------- STATE ---------------- */
  const [showModal, setShowModal] = useState(false);
  const [editStudentGroup, setEditStudentGroup] =
    useState<StudentGroupMemberData | null>(null);

  const [studentGroups, setStudentGroups] = useState<StudentGroupData[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [groupID, setGroupID] = useState<number>(0);
  const [studentIDs, setStudentIDs] = useState<number[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteID, setDeleteID] = useState<number | null>(null);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    getAllStudents().then(setStudents);
    getStudentGroup().then(setStudentGroups);
  }, []);

  /* ---------------- FILTER AVAILABLE STUDENTS ---------------- */
  const memberStudentIds = new Set(
    studentGroupMembers.map((m) => m.studentID)
  );

  const availableStudents = students.filter(
    (s) => !memberStudentIds.has(s.id)
  );

  const filteredStudents = availableStudents.filter(
    (s) =>
      s.first_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.last_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.id.toString().includes(studentSearch)
  );

  /* ---------------- TABLE FILTER + PAGINATION ---------------- */
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("ALL");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 7;

  const filtered = useFilter({
    data: studentGroupMembers,
    search,
    searchFields: ["id", "studentID", "groupID", "groupName", "studentName"],
    roleField: "groupName",
    roleValue: filterGroup,
  });

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  /* ---------------- HANDLERS ---------------- */
  const openCreate = () => {
    setEditStudentGroup(null);
    setGroupID(0);
    setStudentIDs([]);
    setStudentSearch("");
    setShowModal(true);
  };

  const openEdit = (item: StudentGroupMemberData) => {
    setEditStudentGroup(item);
    setGroupID(item.groupID);
    setStudentIDs([item.studentID]); // edit = single
    setShowModal(true);
  };

  const handleStudentSelect = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const values = Array.from(
      e.target.selectedOptions,
      (o) => Number(o.value)
    );
    setStudentIDs(values);
  };

  const handleSubmit = async () => {
    if (!groupID || studentIDs.length === 0) return;

    setLoading(true);
    try {
      if (editStudentGroup) {
        await updateItem(editStudentGroup.id, {
          groupID,
          studentID: studentIDs[0]
        });
      } else {
        await Promise.all(
          studentIDs.map((sid) =>
            createItem({ groupID, studentID: sid })
          )
        );
      }
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteID(id);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (deleteID !== null) {
      await deleteItem(deleteID);
    }
    setShowDelete(false);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>📦 Group Student Section</h3>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Students
        </button>
      </div>

      {/* FILTER */}
      <div className="card p-3 mb-3 shadow-sm">
        <div className="row g-2">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="🔍 Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filterGroup}
              onChange={(e) => {
                setFilterGroup(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Groups</option>
              {studentGroups.map((g) => (
                <option key={g.id} value={g.groupName}>
                  {g.groupName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card p-3 shadow">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Group</th>
              <th>Student</th>
              <th style={{ width: 160 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((g) => (
              <tr key={g.id}>
                <td>{g.id}</td>
                <td>{g.groupName}</td>
                <td>{g.studentName}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => openEdit(g)}
                  >
                    ✏ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteClick(g.id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* CREATE / EDIT MODAL */}
      <CrudModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        title={
          editStudentGroup ? "Edit Group Member" : "Add Students to Group"
        }
        submitText={editStudentGroup ? "Update" : "Add"}
        isValid={!!groupID && studentIDs.length > 0}
      >
        <div className="mb-3">
          <label className="form-label small text-muted">
            Search Students
          </label>
          <input
            className="form-control mb-3"
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            placeholder="Search by name, email, or ID..."
          />

          <label className="form-label small text-muted">
            Select Group
          </label>
          <select
            className="form-select mb-3"
            value={groupID}
            onChange={(e) => setGroupID(+e.target.value)}
            disabled={loading}
          >
            <option value={0} disabled>
              -- Choose a group --
            </option>
            {studentGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.groupName}
              </option>
            ))}
          </select>

          <label className="form-label small text-muted">
            Select Students (Ctrl / Shift for multiple)
          </label>
          <select
            className="form-select"
            size={8}
            multiple={!editStudentGroup}
            value={studentIDs.map(String)}
            onChange={handleStudentSelect}
            disabled={loading || !groupID}
          >
            {filteredStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} {s.first_name} {s.last_name} ({s.email})
              </option>
            ))}
          </select>

          <div className="form-text mt-2">
            {studentIDs.length} selected •{" "}
            {availableStudents.length} available
          </div>
        </div>
      </CrudModal>

      {/* DELETE MODAL */}
      <DeleteModal
        show={showDelete}
        onCancel={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this record?"
      />
    </div>
  );
}

export default StudentGroupMemberTap;
