import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

export type Student = Record<string, string>;

export const readStudentList = (filePath: string): Promise<Student[]> => {
    return new Promise((resolve, reject) => {
        // Validate file extension
        if (!filePath.toLowerCase().endsWith(".csv")) {
            reject(
                new Error("Invalid file format. Only CSV files are supported.")
            );
            return;
        }

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            reject(new Error(`File not found: ${filePath}`));
            return;
        }

        const results: Student[] = [];
        fs.createReadStream(filePath)
            .pipe(
                csvParser({
                    headers: false,
                    skipLines: 0,
                })
            )
            .on("data", (row: any) => {
                const email = Object.values(row)[0];
                if (email && typeof email === "string" && email.trim()) {
                    results.push({ email: email.trim() });
                }
            })
            .on("end", () => {
                if (results.length === 0) {
                    reject(
                        new Error(
                            "The CSV file is empty or no valid data found"
                        )
                    );
                    return;
                }
                resolve(results);
            })
            .on("error", (err) => {
                console.error("Error reading CSV:", err);
                reject(new Error(`Error reading CSV file: ${err.message}`));
            });
    });
};

export const getStudentLists = async (
    file1: string,
    file2: string
): Promise<{ list1: Student[]; list2: Student[] }> => {
    try {
        const [list1, list2] = await Promise.all([
            readStudentList(file1),
            readStudentList(file2),
        ]);

        return { list1, list2 };
    } catch (error) {
        console.error("Error in getStudentLists:", error);
        throw error;
    }
};
