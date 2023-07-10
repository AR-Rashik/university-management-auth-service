import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import routes from "./app/routes";
import httpStatus from "http-status";
// import { generateFacultyId } from "./app/modules/user/user.utils";
const app: Application = express();

// cors
app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes
// app.use("/api/v1/users/", UserRoutes);
// app.use("/api/v1/academic-semesters/", AcademicSemesterRoutes);
app.use("/api/v1/", routes);

// Testing
// app.get("/", async (req: Request, res: Response, next: NextFunction) => {
//   // console.log(x);
//   throw new Error("Testing error logger");
// });

// Global Error Handler
app.use(globalErrorHandler);

// handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: httpStatus.NOT_FOUND,
    message: "Not found",
    errorMessages: [{ path: req.originalUrl, message: "API not found" }],
  });

  next();
});

// const academicSemester = {
//   year: "2030",
//   code: "01",
// };

// const testId = async () => {
//   const testId = await generateFacultyId();
//   console.log(testId);
// };
// testId();

export default app;
