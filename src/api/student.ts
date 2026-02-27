import api from "./axiosInstance";

export const getStudents = () => {
  return api.get("/students");
};

export const createStudent = (data: any) => {
  return api.post("/students/create", data);
};

export const deleteStudent = (id: number) => {
  return api.delete(`/students/${id}`);
};

export const updateStudent = (id: number, data: any) => {
  return api.put(`/students/${id}`, data);
};