import { apiRequest } from "./apiReuse";

// Get members of a specific group
export const getGroupMembers = (groupId: number) =>
  apiRequest(`/studentgroupmembers/?groupID=${groupId}`);
export const getAllGroupMembers = ()=>
  apiRequest(`/studentgroupmembers/`);

// Add a student to the group
export const addGroupMember = (data: { studentID: number; groupID: number }) =>
  apiRequest(`/studentgroupmembers/`, {
    method: "POST",
    body: JSON.stringify(data),
  });

// Remove a student from the group
export const deleteGroupMember = (id: number) =>
  apiRequest(`/studentgroupmembers/${id}/`, {
    method: "DELETE",
  });

// // Update a student from the group
// export const updateGroupMember = (id:number , data: any)=> apiRequest(`/studentgroupmembers/${id}/`,{
//   method: "PUT"
// })
// Update a student group member (PARTIAL UPDATE)
export const updateGroupMember = (id: number, data: any) =>
  apiRequest(`/studentgroupmembers/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

// Optional: get all students for dropdown
export const getAllStudents = () => apiRequest("/getstudentforgroups/");
