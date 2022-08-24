import { Employee } from "../controllers/employee.controller"
import { getEmployeeInfo } from "./file-writer"

// Función recursiva para buscar los empleados que el solicitado tenga a cargo directa o indirectamente
export const getAllDependents = async (employee: Employee, accum: Array<string>): Promise<Array<string>> => {
  const dependents = await employee.getImmediateDependents()
  if(dependents.length === 0) {
    // caso base, corta la recursion y devuelve el acumulador
    return accum
  } else {
    // caso recursivo, por cada empleado a cargo busco si el mismo tiene a su vez otros empleados a cargo
    for(const dependent of dependents) {
      accum.push(getEmployeeInfo(dependent, `${employee.apellido} ${employee.nombre}`))
      /*
        si el rol del empleado es representante se sabe que no tiene empleados a cargo, por lo que no hace falta buscarlos.
        De esta forma el programa es mas performante ya que se evitan muchos accesos innecesarios a la base de datos,
        pero tambien es menos robusto, ya que si se agregaran niveles de dependencia o se cambiara el nombre del rol
        habría que cambiar la condición
      */
      if(dependent.rol.toLowerCase().trim() !== "representante") {
        await getAllDependents(dependent, accum)
      }
    }
  }
  return accum
}

export const validEmail = (email: string): boolean => {
  const emailRegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  return emailRegExp.test(email)
}