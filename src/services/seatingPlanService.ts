import { Request } from "express";
import { getClassLayout, getDefaultHolder } from "./classroomService";

interface ClassroomRequestBody {
    classroom: any;
}

export const generateSeatingPlan = async (req: any) => {
    let classroom;
    if (!req.params || !req.params.classroom) {
        throw new Error("Classroom data is required to generate seating plan");
    }

    classroom = req.params.classroom;
    const classLayout = (await getClassLayout(classroom.className)).classLayout;
    let holder;
    if (classroom.holder) {
        holder = classroom.holder;
    } else {
        const numberOfRows = classLayout.length;
        holder = classLayout[numberOfRows - 2];
    }

    console.log(holder);
};
