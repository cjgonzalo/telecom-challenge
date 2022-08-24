# Telecom Challenge

## Iniciar el proyecto
Clonar el repositorio: <br>
<code>git clone https://github.com/cjgonzalo/telecom-challenge.git</code> <br>
Instalar dependencias: <br>
<code>npm i / npm install</code> <br>
Para levantar el servidor usar: <br>
<code>NODE_ENV=local npm run dev</code>

## Uso con Postman

### Rutas:
#### <code>http://localhost:4002/employee</code>

GET: Retorna lista completa de empleados en la base de datos <br>
POST: Crea un nuevo empleado con los datos ingresados en el body, los datos envíados deben respetar la interfaz Employee

#### <code>http://localhost:4002/employee/:filter</code>

GET: Si filter es un id retorna el empleado con ese id, si es un legajo retorna el empleado con ese legajo <br>
PUT: Modifica el empleado con el id solicitado, los campos a modificar se envían en el body de la petición <br>
DELETE: Elimina el empleado con el id solicitado

#### <code>http://localhost:4002/employee/info/:id</code>

POST: Crea un archivo Excel (.xlsx) con la información del empleado con el id solicitado y la información de todo su personal a cargo 
y lo envía a las casillas de correo solicitadas. Las casillas deben enviarse en el body de la petición. Ejemplos <br>
"recipents": ["mail@ejemplo.com"] <br>
"recipents": ["otroMail@ejemplo.com", "ejemplo@mail.com"]