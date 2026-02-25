import axios from "axios";

const API = "http://localhost:4000";

export const getStudents = () => axios.get(`${API}/students`);

export const createStudent = (data: { name: string; grade: number }) =>
  axios.post(`${API}/students/create`, data);

export const deleteStudent = (id: number) =>
  axios.delete(`${API}/students/${id}`);
