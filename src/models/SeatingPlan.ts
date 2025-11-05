export default interface SeatingPlan{
    examName: string;
    classesUsed: string[];
    seatingArrangement: {[className: string]: string[][]};
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
    is_active: boolean;
}