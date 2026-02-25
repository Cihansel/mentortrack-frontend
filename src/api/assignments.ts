import api from "./axiosInstance";

export const assignTest = (studentId: number, testSetId: number) => {
  return api.post("/assignments", {
    studentId,
    testSetId,
  });
};

export const getStudentAssignments = (studentId: number) => {
  return api.get(`/assignments/student/${studentId}`);
};
