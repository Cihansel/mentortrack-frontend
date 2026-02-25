import axios from "axios";

const API = "http://localhost:4000";

export const getCourses = () => {
  return axios.get(`${API}/courses`); // GET /courses
};

export const createCourse = (data: { name: string }) => {
  return axios.post(`${API}/courses/create`, data); // POST /courses/create
};

export const deleteCourse = (id: number) => {
  return axios.delete(`${API}/courses/${id}`); // DELETE /courses/:id
};
