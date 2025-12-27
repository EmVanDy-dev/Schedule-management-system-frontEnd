import { authHeader } from "../auth";
const API_URL = import.meta.env.VITE_API_URL

export async function getSubject() {
    const res = await fetch(`${API_URL}/subjects/`,{headers: authHeader()})
    return res.json()
}
export async function addSubject(data: any){
    const res = await fetch(`${API_URL}/subjects/`,{
        method: "POST",
        headers: authHeader(),
        body:JSON.stringify(data)
    });
    return res.json();
}
export async function updateSubject(id: number,data:any) {
    const res = await fetch(`${API_URL}/subjects/${id}/`,{
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(data)
    });
    return res.json();
}
export async function deleteSubject(id: number) {
    const res = await fetch(`${API_URL}/subjects/${id}/`,{
        method: "DELETE",  
        headers: authHeader(),
    })
    return res.ok;
}

export async function getMajorInSubject() {
    const res = await fetch(`${API_URL}/majorInSubjects/`,{
        headers: authHeader()
    })
    return res.json()
}