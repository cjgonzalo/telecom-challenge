# Telecom Challenge

## Iniciar el proyecto
<ul>
  <li>
    <u>Clonar el repositorio:</u> <br>
    <code>git clone https://github.com/cjgonzalo/telecom-challenge.git</code> <br>
  </li>
  <li>
    <u>Instalar dependencias:</u> <br>
    <code>npm i / npm install</code> <br>
  </li>
  <li>
    <u>Para levantar el servidor usar:</u> <br>
    <code>npm run dev</code> <br>
    Si no se especifica un entorno por defecto se inicia con local. Para especificar un entorno distinto se debe anteponer NODE_ENV=development/production al comando para inicar el servidor. <br> 
    Ejemplo: <code>NODE_ENV=production npm run dev</code> <br>
    O bien, crear un archivo .env en la raíz del proyecto y setear NODE_ENV en el entorno deseado
  </li>
</ul>

<hr>

## Uso con Postman

### Rutas: 
(para los ejemplos se utiliza el entorno local, si se utiliza otro entorno los puertos varían. Ver archvio <code>config-json.json</code> para saber cual usar)

#### <code>http://localhost:4002/employee</code>
#### Metodos
<ul>
  <li>
    GET: Retorna lista completa de empleados en la base de datos
  <li>
    POST: Crea un nuevo empleado con los datos ingresados en el body, los datos envíados deben respetar la interfaz Employee (declarada en employee.controller)
  </li>
</ul>

#### <code>http://localhost:4002/employee/:filter</code> <br>
<b>Filter puede ser un id o un legajo</b>

#### Metodos

<ul>
  <li>
    GET: Retorna un empleado que satisfaga el filtro indicado
  </li>
  <li>
    PUT: Modifica el empleado según el filtro solicitado, los campos a modificar se envían en el body de la petición
  </li>
  <li>
    DELETE: Elimina el empleado que satisfaga el filtro solicitado
  </li>
</ul>

#### <code>http://localhost:4002/employee/info/:id</code>

#### Metodos

<ul>
  <li>
    POST: Crea un archivo Excel (.xlsx) con la información del empleado con el id solicitado y la información de todo su personal a cargo 
    y lo envía a las casillas de correo solicitadas. Las casillas deben enviarse en el body de la petición. Ejemplos: <br>
    "recipents": ["mail@ejemplo.com"] <br>
    "recipents": ["otroMail@ejemplo.com", "ejemplo@mail.com"]
  </li>
</ul>