# AdGuard Whitelist Editor

Editor web para gestionar listas blancas de AdGuard con una interfaz intuitiva y moderna.

## Características

- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar reglas
- 🔄 **Sincronización en Tiempo Real**: Los cambios se guardan directamente en `whitelist.txt`
- 🤖 **Auto-completar Sintaxis**: Convierte automáticamente dominios a formato AdGuard
- 🌐 **Extracción de Host**: Extrae el dominio de URLs completas
- 🚫 **Validación de Duplicados**: Previene reglas duplicadas
- 💾 **Descarga Directa**: Descarga el archivo `whitelist.txt` actualizado
- 🎨 **Interfaz Moderna**: UI oscura con Tailwind CSS

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
2. En el modal, tienes dos opciones:
   - **Extraer solo el host**: Extrae el dominio de URLs completas
   - **Auto-completar sintaxis**: Agrega automáticamente la sintaxis AdGuard
3. Escribe el dominio o URL:
   - Con ambos checks activados: `https://example.com/page` → `@@||example.com^$document`
   - Solo dominio: `example.com` → `@@||example.com^$document`
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

```
@@||dominio.com^$document
```

- `@@` - Indica que es una regla de whitelist (permitir)
- `||` - Coincide con el inicio del nombre de dominio
- `^` - Separador (fin del dominio)
- `$document` - Modificador que aplica la regla a documentos principales

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
- Actualización automática de fecha y versión
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
! Version: 2025.11.14
! Last modified: 2025-11-14
! Expires: 1 day
! Homepage: https://github.com/YonathanR11/AdGuard-Whitelist
! Author: Yonathan Roman

@@||chatgpt.com^$document
@@||claude.ai^$document
@@||github.com^$document
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
