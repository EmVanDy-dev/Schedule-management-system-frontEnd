"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
  getGroupMembers,
  addGroupMember,
  deleteGroupMember,
  getAllStudents,
} from "../../../api/academic/studentGroupMemmeber"
import type { Member , Student } from "../../../model"


function StudentGroupMembers() {
  const { groupId } = useParams<{ groupId: string }>()
  const [members, setMembers] = useState<Member[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0)
  const [search, setSearch] = useState("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [studentSearch, setStudentSearch] = useState("")

  const loadMembers = async () => {
    if (!groupId) return
    setLoading(true)
    try {
      const data = await getGroupMembers(Number(groupId))
      setMembers(data || [])
    } catch (e: any) {
      setError("Failed to load members")
    } finally {
      setLoading(false)
    }
  }

  const loadStudents = async () => {
    try {
      const data = await getAllStudents()
      setStudents(data || [])
    } catch (e: any) {
      setError("Failed to load students")
    }
  }

  useEffect(() => {
    loadMembers()
    loadStudents()
  }, [groupId])

  const handleAddMember = async () => {
    if (!selectedStudentId) {
      setError("Please select a student")
      setTimeout(() => setError(""), 3000)
      return
    }

    // Check if student is already a member
    const isAlreadyMember = members.some((m) => m.studentID === selectedStudentId)
    if (isAlreadyMember) {
      setError("This student is already a member of the group")
      setTimeout(() => setError(""), 3000)
      return
    }

    try {
      setError("")
      setLoading(true)
      await addGroupMember({
        studentID: selectedStudentId,
        groupID: Number(groupId),
      })
      setSelectedStudentId(0)
      setStudentSearch("")
      await loadMembers()
      setSuccess("Student added successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (e: any) {
      setError(e.message || "Failed to add student")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return

    try {
      setLoading(true)
      await deleteGroupMember(id)
      setMembers((prev) => prev.filter((m) => m.id !== id))
      setSuccess("Student removed successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (e: any) {
      setError("Failed to remove student")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members.filter((m) => m.studentName.toLowerCase().includes(search.toLowerCase()))

  // Filter available students (not already members)
  const memberStudentIds = new Set(members.map((m) => m.studentID))
  const availableStudents = students.filter((s) => !memberStudentIds.has(s.id))

  const filteredStudents = availableStudents.filter(
    (s) =>
      s.first_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.last_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.id.toString().includes(studentSearch),
  )

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <Link to="/admin/studentgroups" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Groups
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")} aria-label="Close"></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess("")} aria-label="Close"></button>
        </div>
      )}

      <div className="row g-4">
        {/* Add Student Section */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-4">
                <i className="bi bi-person-plus-fill me-2 text-primary"></i>
                Add Student
              </h5>

              <div className="mb-3">
                <label htmlFor="studentSearch" className="form-label small text-muted">
                  Search Students
                </label>
                <input
                  id="studentSearch"
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, or ID..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="studentSelect" className="form-label small text-muted">
                  Select Student
                </label>
                <select
                  id="studentSelect"
                  className="form-select"
                  size={8}
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(+e.target.value)}
                  disabled={loading}
                >
                  <option value={0} disabled>
                    -- Choose a student --
                  </option>
                  {filteredStudents.length === 0 ? (
                    <option disabled>{studentSearch ? "No students found" : "All students are already members"}</option>
                  ) : (
                    filteredStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id} {s.first_name} {s.last_name} ({s.email})
                      </option>
                    ))
                  )}
                </select>
                <div className="form-text">{availableStudents.length} student(s) available</div>
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={handleAddMember}
                disabled={!selectedStudentId || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle me-2"></i>
                    Add to Group
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">
                  <i className="bi bi-people-fill me-2 text-primary"></i>
                  Group {groupId} Members
                  <span className="badge bg-primary ms-2">{members.length}</span>
                </h5>
              </div>

              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search members..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {loading && members.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-3">Loading members...</p>
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted"></i>
                  <p className="text-muted mt-3">
                    {search ? "No members match your search" : "No members in this group yet"}
                  </p>
                </div>
              ) : (
                <div className="list-group">
                  {filteredMembers.map((member, index) => (
                    <div key={member.id} className="list-group-item list-group-item-action d-flex align-items-center">
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "40px",
                          height: "40px",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        {getInitials(member.studentName)}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{member.studentName}</div>
                        <small className="text-muted">Student ID: {member.studentID}</small>
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemoveMember(member.id, member.studentName)}
                        disabled={loading}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentGroupMembers
