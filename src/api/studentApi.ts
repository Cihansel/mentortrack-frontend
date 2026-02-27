import api from "./axiosInstance";

export const getStudents = () => api.get("/students");

export const createStudent = (data: { name: string; grade: number }) =>
  api.post("/students/create", data);

export const deleteStudent = (id: number) =>
  api.delete(`/students/${id}`);