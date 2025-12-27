import { useState, useMemo, useEffect, use } from "react";
import { Modal, Button, ModalHeader, ModalTitle } from "react-bootstrap";
import type { User } from "../../model";
import type { AlertType } from "../../components/AlertFunction";

import { getUser, createUser, deleteUser, updateUser } from "../../api/auth";
import AlertFunction from "../../components/AlertFunction";
import { useFilter } from "../../hooks/useFilter";
import Pagination from "../../components/Pagination";

const PAGE_SIZE = 5;

export default function UserManagement() {
  // COMPORNENT FOR ALERT MESSAGE
  const [alertType, setAlertType] = useState<AlertType | undefined>();
  const [alertMessage, setAlertMessage] = useState<string | undefined>();

  const [users, setUsers] = useState<User[]>([]);

  // Fetch users
  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getUser();
        setUsers(userData.results ?? []);
      } catch (err) {
        console.error(err);
      }
    }
    loadUser();
  }, []);

  // Filters & pagination
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [page, setPage] = useState(1);

  // FILTER USER AND VALUE
  const filteredUsers = useFilter({
    data: users,
    search,
    searchFields: ["id", "email", "first_name", "last_name"],
    roleField: "roleName",
    roleValue: filterRole,
  });

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Modal state
  const [show, setShow] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<User["roleID"]>(3);
  const [first_name, setFirstName] = useState<User["first_name"]>("");
  const [last_name, setLastName] = useState<User["last_name"]>("");
  const [password, setPasword] = useState<User["password"]>("");
  const [id, setID] = useState<User["id"]>(Number);

  // Open create modal
  const openCreate = () => {
    setEditingUser(null);
    setEmail("");
    setRole(3);
    setShow(true);
  };

  // Open edit modal
  const openEdit = (user: User) => {
    setID(user.id);
    setEditingUser(user);
    setEmail(user.email);
    setRole(user.roleID);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setShow(true);
  };

  // Save user
  const saveUser = async () => {
    try {
      if (editingUser === null) {
        // Add new user
        const newUser = await createUser({
          first_name,
          last_name,
          email,
          roleID: role,
          password: password,
          username: `${first_name}${last_name}`,
        });
        setUsers([...users, newUser]);  

        // Success alert
        setAlertMessage(undefined);
        setAlertType("success");
        setAlertMessage(`${newUser.last_name} added successfully!`);
      } else {
        // Edite user
        const resUpdateUser = await updateUser(id, {
          first_name,
          last_name,
          email,
          roleID: role,
          password: password,
          username: `${first_name}${last_name}`,
        });
        //  UPDATE USER TABLE WHEN UPDATE
        if (resUpdateUser) {
          setUsers(
            users.map((u) =>
              u.id === id ? { ...u, id, first_name, last_name, email, role } : u
            )
          );

          // Success Alert
          setAlertMessage(undefined);
          setAlertType("success");
          setAlertMessage(`Update successfully! ✅`);
        }
      }

      setShow(false);
    } catch (err: any) {
      // If backen returns validatin errors
      if (err && typeof err === "object") {
        // Convert all errors fields into a readable string
        const message = Object.entries(err)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`
          )
          .join("\n");
        alert(message);
      } else {
        alert("An unexpecterd error occured");
      }
    }
  };

  // Delete user
  const [showDelete, setShowDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    const res = await deleteUser(userToDelete.id);
    if (res) {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setShowDelete(false);
      setUserToDelete(null);
      // Success Alert
      setAlertMessage(undefined);
      setAlertType("danger");
      setAlertMessage(`Delete successfully! ✅`);
    }
  };

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h4 className="mb-0">👤 User Management</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add User
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="card p-3 mb-3 shadow-sm">
        <div className="row g-2">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="🔍 Search by email"
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
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card p-3 shadow">
        <table className="table table-hover mb-0 table-striped">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ width: "160px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 && (
              <tr className="bg-danger">
                <td colSpan={6}>
                  <div className="d-flex justify-content-center align-items-center ">
                    No users found
                  </div>
                </td>
              </tr>
            )}
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`badge ${
                      user.roleName === "admin"
                        ? "bg-danger"
                        : user.roleName === "teacher"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {user.roleName}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => openEdit(user)}
                  >
                    ✏ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => openDeleteModal(user)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* MODAL */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Edit User" : "Create User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>First Name</label>
            <input
              className="form-control"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Last Name</label>
            <input
              className="form-control"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              className="form-control"
              value={password}
              onChange={(e) => setPasword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) =>
                setRole(parseInt(e.target.value) as User["roleID"])
              }
            >
              <option value={1}>Admin</option>
              <option value={2}>Teacher</option>
              <option value={3}>Student</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={saveUser}
            disabled={
              !first_name?.trim() ||
              !last_name?.trim() ||
              !email.trim() ||
              !role
            }
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pop up Delete User  */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header>
          <Modal.Title>⚠️ Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delte this user?
          <br />
          <strong>{userToDelete?.email}</strong>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Alert Message  */}
      {alertMessage && (
        <AlertFunction
          key={Date.now()}
          message={alertMessage}
          type={alertType}
          duration={5000}
          width="50%"
        />
      )}
    </div>
  );
}
