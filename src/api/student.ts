import axios from "axios";

const API = "http://localhost:4000";

export const getStudents = async () => {
  return axios.get(`${API}/students`);
};

export const createStudent = async (data: any) => {
  return axios.post(`${API}/students/create`, data);
};

export const deleteStudent = async (id: number) => {
  return axios.delete(`${API}/students/${id}`);
};

export const updateStudent = async (id: number, data: any) => {
  return axios.put(`${API}/students/${id}`, data);
};
