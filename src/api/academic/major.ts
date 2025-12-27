import { authHeader } from "../auth";
const API_URL = import.meta.env.VITE_API_URL

export async function getMajor() {
    const res = await fetch(`${API_URL}/majors/`,{headers: authHeader()})
    return res.json()
}
export async function addMajor(data: any){
    const res = await fetch(`${API_URL}/majors/`,{
        method: "POST",
        headers: authHeader(),
        body:JSON.stringify(data)
    });
    return res.json();
}
export async function updateMajor(id: number,data:any) {
    const res = await fetch(`${API_URL}/majors/${id}/`,{
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(data)
    });
    return res.json();
}
export async function deleteMajor(id: number) {
    const res = await fetch(`${API_URL}/majors/${id}/`,{
        method: "DELETE",  
        headers: authHeader(),
    })
    return res.ok;
}