import { Employee } from "../controllers/employee.controller"

// Función recursiva para buscar los empleados que el solicitado tenga a cargo directa o indirectamente
export const getAllDependents = async (employee: Employee, accum: Array<Employee>): Promise<Array<Employee>> => {
  const dependents = employee.getImmediateDependents()
  if(dependents.length === 0) {
    // caso base, corta la recursion y devuelve el acumulador
    return accum
  } else {
    // caso recursivo, por cada empleado a cargo busco si el mismo tiene a su vez otros empleados a cargo
    for(const dependent of dependents) {
      accum.push(dependent)
      await getAllDependents(dependent, accum)
    }
  }
  return accum
}