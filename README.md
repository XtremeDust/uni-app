# UNIVITA - Aplicación Frontend

Este repositorio contiene el frontend de la aplicación UNIVITA, desarrollado con **Next.js** y **React**.

Es el módulo digital de la Universidad de Margarita creado para transformar la gestión de las actividades deportivas y culturales. 
Su función principal es centralizar en un solo espacio virtual los procesos de inscripción, organización y divulgación de eventos,
facilitando la participación activa de estudiantes, docentes y personal administrativo. Su finalidad es optimizar la experiencia universitaria mediante la automatización y digitalización de estos procesos,
garantizando eficiencia, transparencia y accesibilidad, al tiempo que fortalece la identidad institucional y fomenta el sentido de pertenencia en la comunidad académica.

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

* **Node.js** (versión 18.x o superior)
* **NPM** o **Yarn** (Gestor de paquetes)

---

## ⚙️ Pasos de Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/tu-frontend.git](https://github.com/tu-usuario/tu-frontend.git)
    cd tu-frontend
    ```

2.  **Instalar las dependencias del proyecto:**
    * Usando npm:
    ```bash
    npm install
    npm install framer-motion
    ```
    * O usando yarn:
    ```bash
    yarn install
    ```

3.  **Crear el archivo de entorno local:**
    * Copia el archivo de ejemplo. (Este archivo está ignorado por Git y contiene tus claves de API).
    ```bash
    cp .env.local.example .env.local
    ```

4.  **Configurar las variables de entorno:**
    * Abre el archivo `.env.local` y añade las URLs de la API y otras claves necesarias.
    * Ejemplo:
    ```
    NEXT_PUBLIC_API_URL=[http://tu-backend.test/api](http://tu-backend.test/api)
    ```

5.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

La aplicación ahora estará corriendo en `http://localhost:3000`.