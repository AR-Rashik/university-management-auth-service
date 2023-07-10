import { IAcademicSemester } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";

// Find last student id
export const findLastStudentId = async (): Promise<string | undefined> => {
  const lastStudent = await User.findOne({ role: "student" }, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastStudent?.id ? lastStudent.id.substring(4) : undefined;
};

// Student id generate (Last two digit od academic year + academic semester code + 5 digit code)
export const generateStudentId = async (
  academicSemester: IAcademicSemester | null
): Promise<string> => {
  const currentId =
    (await findLastStudentId()) || (0).toString().padStart(5, "0"); // 00000

  // Increment by one cause the first id is now 00000
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, "0");

  // Last two digit od academic year + academic semester code + 5 digit code
  incrementedId = `${academicSemester?.year.substring(2)}${
    academicSemester?.code
  }${incrementedId}`;

  // console.log(incrementedId);

  return incrementedId;

  // lastUSerId++
  // return String(lastUSerId).padStart(5, '0')
};

// Find last faculty id
export const findLastFacultyId = async (): Promise<string | undefined> => {
  const lastFaculty = await User.findOne({ role: "faculty" }, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

// Generate Faculty Id
export const generateFacultyId = async (): Promise<string> => {
  const currentId =
    (await findLastFacultyId()) || (0).toString().padStart(5, "0"); // 00000

  // Increment by one cause the first id is now 00000
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, "0");

  // F- + 5 digit code
  incrementedId = `F-${incrementedId}`; // we can't increment this id with F-. We have to remove F- then increment it

  // console.log(incrementedId);

  return incrementedId;
};

// Find last admin id
export const findLastAdminId = async (): Promise<string | undefined> => {
  const lastFaculty = await User.findOne({ role: "admin" }, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

// Generate admin id
export const generateAdminId = async (): Promise<string> => {
  const currentId =
    (await findLastAdminId()) || (0).toString().padStart(5, "0");

  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, "0");

  incrementedId = `A-${incrementedId}`;

  return incrementedId;
};