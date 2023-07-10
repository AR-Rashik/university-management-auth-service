import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { StudentRoutes } from "../modules/student/student.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";
import { ManagementDepartmentRoutes } from "../modules/managementDepartment/managementDepartment.route";
import { AdminRoutes } from "../modules/admin/admin.route";

const router = express.Router();

// Individual Application routes
const moduleRoutes = [
  {
    path: "/users/",
    route: UserRoutes,
  },
  {
    path: "/academic-semesters/",
    route: AcademicSemesterRoutes,
  },
  {
    path: "/academic-faculties",
    route: AcademicFacultyRoutes,
  },
  {
    path: "/academic-departments",
    route: AcademicDepartmentRoutes,
  },
  {
    path: "/management-departments",
    route: ManagementDepartmentRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/faculties",
    route: FacultyRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route)); // optimize router.use with forEach method

// router.use("/users/", UserRoutes);
// router.use("/academic-semesters/", AcademicSemesterRoutes);

export default router;
