import api from "./axiosInstance";

export const getCourses = () => {
  return api.get("/courses");
};

export const createCourse = (data: { name: string }) => {
  return api.post("/courses/create", data);
};

export const deleteCourse = (id: number) => {
  return api.delete(`/courses/${id}`);
};