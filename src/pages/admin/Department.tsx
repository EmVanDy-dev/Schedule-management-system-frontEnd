import { useState } from "react";
import { useCrud } from "../../hooks/useCrud";
import { useFilter } from "../../hooks/useFilter";
import {
  addDepartment,
  deleteDepartment,
  getDeparetment,
  updateDepartment,
} from "../../api/department";
import Pagination from "../../components/Pagination";
import CrudModal from "../../components/CrudModal";
import DeleteModal from "../../components/DeleteModal";

type DepartmentData = {
  id: number;
  departmentName: string;
};

function Department() {
  const {
    data: departments,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud<DepartmentData>({
    fetchFn: getDeparetment,
    createFn: addDepartment,
    updateFn: updateDepartment,
    deleteFn: deleteDepartment,
  });

  // UI state
  const [showModal, setShowModal] = useState(false);
  const [editeDepartment, setEditDepartment] = useState<DepartmentData | null>(
    null
  );
  const [departmentName, setDepartmentName] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Search + Pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const filtered = useFilter({
    data: departments,
    search,
    searchFields: ["id", "departmentName"],
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // ---------------- HANDLERS ----------------

  const openCreate = () => {
    setEditDepartment(null);
    setDepartmentName("");
    setShowModal(true);
  };

  const openEdit = (department: DepartmentData) => {
    setEditDepartment(department);
    setDepartmentName(department.departmentName);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!departmentName.trim()) return;

    if (editeDepartment) {
      await updateItem(editeDepartment.id, { departmentName });
    } else {
      await createItem({ departmentName });
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
        <h4>🏬 Department Management</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Deparment
        </button>
      </div>

      {/* FILTER SEARCH */}
      <div className="card p-3 mb-3 shadow-sm">
        <div className="rom g-2">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="🔍 Search by ID OR Name"
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
              <th>Department</th>
              <th style={{ width: "160px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
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
        title={editeDepartment ? "Edite Department" : "Create Department"}
        submitText={editeDepartment ? "Update" : "Create"}
        isValid={!!departmentName.trim()}
      >
        <label className="form-label fw-semibold">Department Name</label>
        <input
          className="form-control"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
        />
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

export default Department;



// import { useState } from "react";

// const AcademicStructure = () => {
//   // Mock data
//   const departmentsData = [
//     { id: 1, departmentName: "Computer Science" },
//     { id: 2, departmentName: "Business Administration" }
//   ];

//   const majorsData = [
//     { id: 1, majorName: "Software Engineering", departmentID: 1 },
//     { id: 2, majorName: "Data Science", departmentID: 1 },
//     { id: 3, majorName: "Marketing", departmentID: 2 }
//   ];

//   const subjectsData = [
//     {
//       id: 1,
//       subjectName: "Web Development",
//       subjectCode: "CS301",
//       credit: 3,
//       majorID: 1
//     },
//     {
//       id: 2,
//       subjectName: "Machine Learning",
//       subjectCode: "CS401",
//       credit: 4,
//       majorID: 2
//     },
//     {
//       id: 3,
//       subjectName: "Digital Marketing",
//       subjectCode: "BA201",
//       credit: 3,
//       majorID: 3
//     }
//   ];

//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [selectedMajor, setSelectedMajor] = useState("");

//   const filteredMajors = majorsData.filter(
//     m => m.departmentID === Number(selectedDepartment)
//   );

//   const filteredSubjects = subjectsData.filter(
//     s => s.majorID === Number(selectedMajor)
//   );

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>Academic Structure</h2>

//       <div style={styles.card}>
//         {/* Department */}
//         <div style={styles.field}>
//           <label style={styles.label}>Department</label>
//           <select
//             style={styles.select}
//             value={selectedDepartment}
//             onChange={e => {
//               setSelectedDepartment(e.target.value);
//               setSelectedMajor("");
//             }}
//           >
//             <option value="">Select Department</option>
//             {departmentsData.map(dep => (
//               <option key={dep.id} value={dep.id}>
//                 {dep.departmentName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Major */}
//         <div style={styles.field}>
//           <label style={styles.label}>Major</label>
//           <select
//             style={{
//               ...styles.select,
//               backgroundColor: !selectedDepartment ? "#eee" : "#fff"
//             }}
//             value={selectedMajor}
//             onChange={e => setSelectedMajor(e.target.value)}
//             disabled={!selectedDepartment}
//           >
//             <option value="">Select Major</option>
//             {filteredMajors.map(major => (
//               <option key={major.id} value={major.id}>
//                 {major.majorName}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Subjects */}
//       {filteredSubjects.length > 0 && (
//         <div style={styles.card}>
//           <h3 style={styles.subtitle}>Subjects</h3>

//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Name</th>
//                 <th style={styles.th}>Code</th>
//                 <th style={styles.th}>Credit</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredSubjects.map(subject => (
//                 <tr key={subject.id}>
//                   <td style={styles.td}>{subject.subjectName}</td>
//                   <td style={styles.td}>{subject.subjectCode}</td>
//                   <td style={styles.td}>{subject.credit}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: "800px",
//     margin: "40px auto",
//     fontFamily: "Arial, sans-serif"
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: "20px"
//   },
//   subtitle: {
//     marginBottom: "10px"
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: "20px",
//     borderRadius: "6px",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//     marginBottom: "20px"
//   },
//   field: {
//     marginBottom: "15px"
//   },
//   label: {
//     display: "block",
//     marginBottom: "6px",
//     fontWeight: "bold"
//   },
//   select: {
//     width: "100%",
//     padding: "8px",
//     borderRadius: "4px",
//     border: "1px solid #ccc"
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse"
//   },
//   th: {
//     backgroundColor: "#f5f5f5",
//     textAlign: "left",
//     padding: "10px",
//     borderBottom: "1px solid #ddd"
//   },
//   td: {
//     padding: "10px",
//     borderBottom: "1px solid #eee"
//   }
// };

// export default AcademicStructure;
