# 🚀 API REST con Node.js + SQLite3

Proyecto de una **API REST** para gestionar tareas (*todos*) usando **Node.js (Express)** y **SQLite3**.  
La base de datos es un archivo local (`app.db`) que se crea automáticamente al iniciar la aplicación. El recurso principal es `todos` con operaciones CRUD completas.

## 🧰 Tecnologías usadas
- 🟩 **Node.js 20** + **Express**: servidor HTTP y enrutamiento.
- 🗃️ **SQLite3**: base de datos embebida (archivo `app.db`).
- 🌐 **CORS**: habilita solicitudes desde otros orígenes.
- 🔁 **JSON**: formato de entrada/salida en los endpoints.

> 💡 **Nota:** el campo `done` se maneja como **entero** `0 | 1` (pendiente | terminado).

## 🔌 Endpoints (explicación)

| # | 🧭 Método | 🛣️ Ruta             | 🎯 Propósito                                  | 🧳 Body (JSON)                                   | ✅ Respuesta OK (ejemplo)                                                             | ⚠️ Errores típicos |
|---|-----------|----------------------|-----------------------------------------------|--------------------------------------------------|---------------------------------------------------------------------------------------|-------------------|
| 1 | GET       | `/`                  | Healthcheck del servicio                       | —                                                | `{"ok":true,"service":"node-sqlite-api","ts":"<ISO>"}`                                | —                 |
| 2 | GET       | `/api/todos`         | Listar todos los *todos*                       | —                                                | `[{"id":1,"title":"Ejemplo","done":0,"created_at":"YYYY-MM-DD HH:MM:SS"}]`            | `500` fallo BD    |
| 3 | GET       | `/api/todos/:id`     | Obtener un *todo* por `id`                     | —                                                | `{"id":1,"title":"Ejemplo","done":0,"created_at":"YYYY-MM-DD HH:MM:SS"}`              | `404` no existe; `500` BD |
| 4 | POST      | `/api/todos`         | Crear un nuevo *todo*                          | `{"title":"Mi primera tarea","done":0}`          | `{"id":2,"title":"Mi primera tarea","done":0}`                                        | `400` falta `title`; `500` BD |
| 5 | PUT       | `/api/todos/:id`     | Actualizar `title` y/o `done` de un *todo*     | `{"title":"Nuevo título","done":1}` *(opc.)*     | `{"updated":1}` *(número de filas afectadas)*                                         | `500` BD          |
| 6 | DELETE    | `/api/todos/:id`     | Eliminar un *todo* por `id`                    | —                                                | `{"deleted":1}` *(número de filas afectadas)*                                         | `500` BD          |

## 🖥️ Comandos usados en la VM de AWS (EC2) para correr el servidor

> Ejecutados **en la instancia Ubuntu** (vía SSH). Asegúrate de abrir el **puerto 3000** en el *Security Group* y usar la **IP pública** de tu instancia para probar en Postman.

```bash
# 1) Utilidades básicas
sudo apt update -y
sudo apt install -y curl git sqlite3

# 2) Instalar NVM y Node.js 20
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 20
nvm use 20
nvm alias default 20
node -v
npm -v

# 3) Carpeta de trabajo
mkdir -p ~/taller1 && cd ~/taller1

# 4) Clonar el repositorio del proyecto
git clone https://github.com/Xharlie982/S02_Taller_1.git
cd S02_Taller_1

# 5) Instalar dependencias e iniciar el servidor
npm install
npm run start
# -> API escuchando en http://localhost:3000 (expuesto en 0.0.0.0 dentro del código)
```
# 6) Seguridad (abrir puerto 3000 en el Security Group de AWS)
#   - EC2 > Instances > selecciona tu instancia
#   - Pestaña "Security" > clic en el Security group
#   - Edit inbound rules > Add rule:
#       Type: Custom TCP
#       Port: 3000
#       Source: 0.0.0.0/0 (para este caso)
#   - Guardar
#
#   Pruebas (Postman) usando mi IP pública:
#   http://<IP_PUBLICA_EC2>:3000/
#   http://<IP_PUBLICA_EC2>:3000/api/todos
