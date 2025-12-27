import { authHeader } from "../auth";
const API_URL = import.meta.env.VITE_API_URL

export async function getStudentGroup() {
    const res = await fetch(`${API_URL}/studentgroups/`,{headers: authHeader()})
    return res.json()
}
export async function addStudentGroup(data: any){
    const res = await fetch(`${API_URL}/studentgroups/`,{
        method: "POST",
        headers: authHeader(),
        body:JSON.stringify(data)
    });
    console.log(data)
    console.log(res.text)
    return res.json();
}
export async function updateStudentGroup(id: number,data:any) {
    const res = await fetch(`${API_URL}/studentgroups/${id}/`,{
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(data)
    });
    return res.json();
}
export async function deleteStudentGroup(id: number) {
    const res = await fetch(`${API_URL}/studentgroups/${id}/`,{
        method: "DELETE",  
        headers: authHeader(),
    })
    return res.ok;
}

export async function getSubjectInStudentGroup() {
    const res = await fetch(`${API_URL}/majorInSubjects/`,{
        headers: authHeader()
    })
    return res.json()
}