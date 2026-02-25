import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🔹 Public
import Login from "./pages/Login/Login";
import AdminLogin from "./pages/Admin/AdminLogin";

// 🔹 Layouts
import Layout from "./components/Layout/Layout";
import StudentLayout from "./components/Layout/StudentLayout";

// 🔹 Guards
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import RequireStudent from "./components/RequireStudent";
import RequireParent from "./components/RequireParent";

// 🔹 Admin Dashboard
import Dashboard from "./pages/Dashboard/Dashboard";
import LiveStudents from "./pages/Dashboard/LiveStudents";

// 🔹 Student Pages
import StudentDashboard from "./pages/Student/StudentDashboard";
import AssignedTests from "./pages/Student/AssignedTests";
import StudentRecords from "./pages/Student/StudentRecords";
import TestSolve from "./pages/Student/TestSolve";

// 🔹 Students (ADMIN)
import StudentList from "./pages/Students/StudentList";
import AddStudent from "./pages/Students/AddStudent";
import EditStudent from "./pages/Students/EditStudent";
import StudentDetail from "./pages/Students/StudentDetail";
import StudentProfile from "./pages/Students/StudentProfile";

// 🔹 Parents (ADMIN)
import ParentsList from "./pages/Parents/ParentsList";

// 🔹 Parent (PARENT)
import ParentDashboard from "./pages/Parents/ParentDashboard";
import ParentStudentDetail from "./pages/Parents/ParentStudentDetail";

// 🔹 Courses
import CoursesList from "./pages/Courses/CoursesList";
import CoursesAdd from "./pages/Courses/CoursesAdd";
import CoursesEdit from "./pages/Courses/CoursesEdit";

// 🔹 Units
import UnitsList from "./pages/Units/UnitsList";
import UnitsAdd from "./pages/Units/UnitsAdd";
import UnitsEdit from "./pages/Units/UnitsEdit";

// 🔹 Topics
import TopicList from "./pages/Topics/TopicList";
import TopicsAdd from "./pages/Topics/TopicsAdd";
import TopicsEdit from "./pages/Topics/TopicsEdit";
import TopicAnalytics from "./pages/Topics/TopicAnalytics";

// 🔹 Sources
import SourcesList from "./pages/Sources/SourcesList";
import SourcesAdd from "./pages/Sources/SourcesAdd";
import SourcesEdit from "./pages/Sources/SourcesEdit";

// 🔹 TestSets
import TestSetsList from "./pages/TestSets/TestSetsList";
import TestSetsAdd from "./pages/TestSets/TestSetsAdd";
import TestSetsEdit from "./pages/TestSets/TestSetsEdit";

// 🔹 StudyRecords (ADMIN)
import StudyRecordList from "./pages/StudyRecords/StudyRecordList";
import StudyRecordAdd from "./pages/StudyRecords/StudyRecordAdd";
import StudyRecordEdit from "./pages/StudyRecords/StudyRecordEdit";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireAdmin>
                <Layout />
              </RequireAdmin>
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="live" element={<LiveStudents />} />

          <Route path="students" element={<StudentList />} />
          <Route path="students/add" element={<AddStudent />} />
          <Route path="students/edit/:id" element={<EditStudent />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="students/profile/:id" element={<StudentProfile />} />

          <Route path="courses" element={<CoursesList />} />
          <Route path="courses/add" element={<CoursesAdd />} />
          <Route path="courses/edit/:id" element={<CoursesEdit />} />

          <Route path="units" element={<UnitsList />} />
          <Route path="units/add" element={<UnitsAdd />} />
          <Route path="units/edit/:id" element={<UnitsEdit />} />

          <Route path="topics" element={<TopicList />} />
          <Route path="topics/add" element={<TopicsAdd />} />
          <Route path="topics/edit/:id" element={<TopicsEdit />} />
          <Route path="topics/analytics" element={<TopicAnalytics />} />

          <Route path="sources" element={<SourcesList />} />
          <Route path="sources/add" element={<SourcesAdd />} />
          <Route path="sources/edit/:id" element={<SourcesEdit />} />

          <Route path="testsets" element={<TestSetsList />} />
          <Route path="testsets/add" element={<TestSetsAdd />} />
          <Route path="testsets/edit/:id" element={<TestSetsEdit />} />

          <Route path="studyrecords" element={<StudyRecordList />} />
          <Route path="studyrecords/add" element={<StudyRecordAdd />} />
          <Route path="studyrecords/edit/:id" element={<StudyRecordEdit />} />

          <Route path="parents" element={<ParentsList />} />
        </Route>

        {/* ================= STUDENT ================= */}
        <Route
          path="/student"
          element={
            <RequireAuth>
              <RequireStudent>
                <StudentLayout />
              </RequireStudent>
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="tests" element={<AssignedTests />} />
          <Route path="records" element={<StudentRecords />} />
          <Route path="test/:assignmentId" element={<TestSolve />} />
        </Route>

        {/* ================= PARENT ================= */}
        <Route
          path="/parent"
          element={
            <RequireAuth>
              <RequireParent>
                <ParentDashboard />
              </RequireParent>
            </RequireAuth>
          }
        />

        {/* 🔥 Parent Student Detail */}
        <Route
          path="/parent/student/:studentId"
          element={
            <RequireAuth>
              <RequireParent>
                <ParentStudentDetail />
              </RequireParent>
            </RequireAuth>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}