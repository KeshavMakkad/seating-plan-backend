import ClassLayoutModel from "./../models/ClassLayoutSchema";

export const getClassLayout = async (className: string) => {
    try {
        const classroomLayout = await ClassLayoutModel.findOne({ className });
        if (!classroomLayout) {
            throw new Error(`Class layout for ${className} not found`);
        }
        return classroomLayout;
    } catch (error: any) {
        throw new Error(
            `Error fetching class layout for ${className}: ${error.message}`
        );
    }
};

export const getDefaultHolder = async (className: string) => {
    try {
        const classroomLayout = await getClassLayout(className);
        if (!classroomLayout) {
            throw new Error(`Default holder for ${className} not found`);
        }
        const layoutArray = classroomLayout.classLayout;
        const numberOfRows = layoutArray.length;
        const holder = layoutArray[numberOfRows - 2];
        return holder;
    } catch (error: any) {
        throw new Error(
            `Error fetching default holder for ${className}: ${error.message}`
        );
    }
};
