import { findById } from "../repositories/employeeRepository";

export async function existEmployeeById(id: number) {
    return await findById(id);
}