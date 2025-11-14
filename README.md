# AdGuard Whitelist Editor

Editor web para gestionar listas blancas de AdGuard con una interfaz intuitiva y moderna.

## Características

- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar reglas
- 🔄 **Sincronización en Tiempo Real**: Los cambios se guardan directamente en `whitelist.txt`
- 🤖 **Auto-completar Sintaxis**: Convierte automáticamente dominios a formato AdGuard
- 🌐 **Extracción de Host**: Extrae el dominio de URLs completas
- ⚡ **Modificador $important**: Opción para agregar prioridad alta a las reglas
- 🚫 **Validación de Duplicados**: Previene reglas duplicadas
- 💾 **Descarga Directa**: Descarga el archivo `whitelist.txt` actualizado
- 🎨 **Interfaz Moderna**: UI oscura con Tailwind CSS
- ⏰ **Versionado Automático**: Actualiza fecha, hora y versión en cada cambio (zona horaria México)

## Requisitos

- PHP 7.0 o superior
- Servidor web local (Laragon, XAMPP, WAMP, etc.)

## Instalación

1. Clona o descarga este repositorio en tu directorio web:
   ```bash
   git clone https://github.com/YonathanR11/AdGuard-Whitelist.git
   ```

2. Asegúrate de que tu servidor web tenga permisos de escritura en `whitelist.txt`

3. Accede a la aplicación en tu navegador:
   ```
   http://localhost/AdGuardWhitelist/
   ```

## Uso

### Agregar una Regla

1. Haz clic en el botón **"Agregar Regla"**
2. En el modal, tienes tres opciones:
   - **Extraer solo el host**: Extrae el dominio de URLs completas
   - **Auto-completar sintaxis**: Agrega automáticamente la sintaxis AdGuard
   - **Agregar modificador $important**: Da prioridad alta a la regla
3. Escribe el dominio o URL:
   - Básico: `example.com` → `@@||example.com^$document`
   - Con URL completa: `https://example.com/page` → `@@||example.com^$document`
   - Con $important: `example.com` → `@@||example.com^$important,document`
4. Haz clic en **"Agregar"**

### Editar una Regla

1. Haz clic en el botón **"Edit"** junto a la regla que deseas editar
2. Modifica la regla en el modal
3. Haz clic en **"Guardar"**

### Eliminar una Regla

1. Haz clic en el botón **"Delete"** junto a la regla
2. Confirma la eliminación en el modal
3. La regla se elimina de `whitelist.txt`

### Descargar Whitelist

1. Haz clic en el botón **"Descargar whitelist.txt"**
2. El archivo actualizado se descarga automáticamente

### Importar en AdGuard

Puedes importar esta whitelist directamente en AdGuard usando una URL:

#### AdGuard para Windows/Mac/Android

1. Abre AdGuard
2. Ve a **Configuración** → **Filtros** → **Listas blancas**
3. Haz clic en **"Agregar filtro personalizado"** o **"Añadir lista blanca"**
4. Ingresa la URL de tu archivo `whitelist.txt`:
   
   **Opción 1: GitHub Raw (con caché)**
   ```
   https://raw.githubusercontent.com/YonathanR11/AdGuard-Whitelist/main/whitelist.txt
   ```
   
   **Opción 2: GitHack (menos caché, más actualizado)** - Recomendado
   ```
   https://raw.githack.com/YonathanR11/AdGuard-Whitelist/main/whitelist.txt
   ```
   
   **Opción 3: Servidor propio**
   ```
   https://tu-servidor.com/AdGuardWhitelist/whitelist.txt
   ```
5. Haz clic en **"Agregar"** o **"Siguiente"**

#### AdGuard Home

1. Accede al panel de AdGuard Home
2. Ve a **Filtros** → **Listas de permitidos DNS**
3. Haz clic en **"Añadir lista de permitidos"**
4. Ingresa:
   - **Nombre**: Yonathan's Whitelist
   - **URL**: `https://raw.githack.com/YonathanR11/AdGuard-Whitelist/main/whitelist.txt` (Recomendado)
   - Alternativa: `https://raw.githubusercontent.com/YonathanR11/AdGuard-Whitelist/main/whitelist.txt`
5. Haz clic en **"Guardar"**

#### Actualización Automática

AdGuard actualizará automáticamente la lista según el parámetro `Expires` en el archivo (configurado para 1 día). Esto significa que cualquier cambio que hagas en el editor se reflejará automáticamente en AdGuard después de la siguiente actualización.

#### Notas Importantes

- **GitHack vs GitHub Raw**: GitHack tiene menos caché que GitHub Raw, lo que significa que los cambios se reflejan más rápido
- Si usas GitHub, asegúrate de hacer commit y push de los cambios en `whitelist.txt`
- Si usas un servidor propio, asegúrate de que el archivo sea accesible públicamente
- La URL debe apuntar directamente al archivo de texto sin procesar (raw)
- AdGuard verificará actualizaciones según el intervalo definido en `Expires` (1 día)

## Estructura de Archivos

```
AdGuardWhitelist/
├── index.html         # Interfaz principal
├── api.php           # Backend para operaciones CRUD
├── whitelist.txt     # Archivo de reglas de AdGuard
├── favicon.ico       # Ícono del sitio
├── AGENTS.md         # Guía para agentes de código
└── README.md         # Este archivo
```

## Formato de Reglas AdGuard

Las reglas siguen el formato estándar de AdGuard:

### Regla Básica
```
@@||dominio.com^$document
```

- `@@` - Indica que es una regla de whitelist (permitir)
- `||` - Coincide con el inicio del nombre de dominio
- `^` - Separador (fin del dominio)
- `$document` - Modificador que aplica la regla a documentos principales

### Regla con Prioridad Alta
```
@@||dominio.com^$important,document
```

- `$important` - Hace que la regla tenga prioridad sobre otras reglas de filtrado
- Útil para asegurar que ciertos sitios siempre estén permitidos
- Se coloca antes del modificador `$document`

## Características Técnicas

### Frontend (index.html)

- Vanilla JavaScript (sin frameworks)
- Tailwind CSS vía CDN
- Interfaz reactiva con modales
- Validación en tiempo real
- Manejo de errores inline

### Backend (api.php)

- API RESTful con PHP
- Operaciones GET y POST
- Validación de duplicados
- Actualización automática de fecha, hora y versión (con segundos)
- Zona horaria: America/Mexico_City
- Preservación del formato del archivo

## Validaciones

- ✅ Las reglas deben comenzar con `@@`
- ✅ No se permiten reglas duplicadas
- ✅ Validación en frontend y backend
- ✅ Mensajes de error visuales en los modales

## Ejemplo de whitelist.txt

```
! Title: Yonathan's AdGuard Whitelist
! Description: Lista personalizada de sitios permitidos para AdGuard.
! Version: 2025.11.14.153045
! Last modified: 2025-11-14 15:30:45
! Expires: 1 day
! Homepage: https://github.com/YonathanR11/AdGuard-Whitelist
! Author: Yonathan Roman

@@||chatgpt.com^$document
@@||claude.ai^$document
@@||github.com^$document
@@||worldtimeapi.org^$important,document
@@||google.com^$document
```

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Autor

**Yonathan Roman**
- GitHub: [@YonathanR11](https://github.com/YonathanR11)

## Soporte

Si encuentras algún problema o tienes alguna sugerencia, por favor abre un issue en GitHub.

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub
