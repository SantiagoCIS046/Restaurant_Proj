# 🚀 Especificación de Requerimientos de Backend - Restaurant Epicure Pro

Este documento define la estructura de datos, lógica de negocio y endpoints de API necesarios para soportar el sistema de gestión de restaurant "Epicure Pro", basándose en la implementación actual del frontend.

---

## 🏛️ 1. Arquitectura Recomendada

Para un proyecto con los requerimientos actuales, se recomienda el siguiente stack tecnológico:

*   **Entorno**: Node.js v20.11.0 o superior.
*   **Framework**: Express o Fastify.
*   **Base de Datos**: MongoDB (NoSQL) con Mongoose para facilitar la gestión de esquemas.
*   **Autenticación**: JWT (JSON Web Tokens) con almacenamiento de contraseñas mediante `bcrypt`.
*   **Gestión de Archivos**: Almacenamiento local (con ruta estática) o servicios como AWS S3 para imágenes de productos.

---

## 💾 2. Modelo de Datos (Esquemas)

Todas las entidades deben incluir automáticamente:
*   `createdAt`: Fecha de creación.
*   `updatedAt`: Fecha de última actualización.

### 👥 2.1. Personal (Staff) / Usuarios
Gestión de empleados y acceso al sistema.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | ObjectID | Identificador único interno. |
| `nombre` | String | Nombre completo del empleado. |
| `email` | String | Email único para login (obligatorio). |
| `password` | String | Hash de la contraseña. |
| `rol` | Enum | [admin, mesero, cocinero, cajero, user]. |
| `turno` | Enum | [Mañana, Tarde, Noche]. |
| `salario` | Number | Salario base. |
| `propinaAutomatica` | Boolean | Participación en reparto de propinas. |
| `mesasAtendidas` | Number | Contador manual de mesas (para propinas). |
| `estado` | Enum | [Activo, Inactivo]. |

### 🏘️ 2.2. Gestión de Mesas (Tables)
Ubicación y estado en tiempo real.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `number` | String | ID visual (ej: "mesa1", "mesa2"). |
| `capacidad` | Number | Cantidad de personas máxima. |
| `ubicacion` | Enum | [Terraza, Salón Principal, Barra, VIP Privado]. |
| `estado` | Enum | [disponible, reservada, ocupada, deshabilitada]. |
| `pedidoActual` | ObjectID | Referencia al pedido activo (opcional). |

### 👤 2.3. Clientes (Clients)
Perfil y fidelización del cliente.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `nombre` | String | Nombre completo del cliente. |
| `email` | String | Correo electrónico único. |
| `telefono` | String | Número de contacto. |
| `direcciones` | Array | Direcciones para domicilios. |
| `totalPagos` | Number | Consumo histórico total. |
| `historialReservas` | Array | [ ObjectID ] Referencia a Reservas. |
| `historialPagos` | Array | [ ObjectID ] Referencia a Pagos/Finanzas. |

### 🗓️ 2.4. Reservas (Reservations)
Agenda de clientes.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `cliente` | ObjectID | Referencia al Cliente. |
| `mesa` | ObjectID | Referencia a la Mesa. |
| `dia` | Date | Fecha de la reserva. |
| `hora` | String | Hora reservada (HH:mm). |
| `personas` | Number | Cantidad de comensales. |
| `ocasion` | String | Motivo (Cumpleaños, Cena de negocios, etc.). |
| `estado` | Enum | [Confirmada, Cancelada, Finalizada, No-Show]. |

### 📦 2.5. Inventario (Products & Ingredients)
Control de stock y costos.

#### Categorías del Menú
*   `nombre`: String.
*   `tipo`: Enum [Bebidas, Entradas, Platos Fuertes, Ensaladas, Pescados, Carnes, Pastas, Postres, Adicionales].

#### Productos (Platos del Menú)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `nombre` | String | Nombre del plato (ej: Pizza Margarita). |
| `categoria` | ObjectID | Referencia a Categoría. |
| `precioVenta` | Number | Precio en COP. |
| `stockActual` | Number | Unidades disponibles/stock inicial. |
| `ingredientesText` | String | Descripción de ingredientes (ej: "Tomate, Queso"). |
| `receta` | Array | [ {ingredienteID, cantidad} ] para descuento de stock automático. |

#### Ingredientes (Materias Primas)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `nombre` | String | Nombre del insumo. |
| `unidadMedida` | Enum | [Kg, Lt, Unidad, Gr, Oz]. |
| `stockActual` | Number | Cantidad disponible. |
| `proveedorPreferido` | ObjectID | Referencia a Proveedor id (opcional). |

### 🚛 2.6. Proveedores (Suppliers)
Empresas de suministro.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `nombre` | String | Razón social. |
| `email` | String | Correo de contacto comercial. |
| `telefono` | String | Teléfono de contacto. |
| `direccion` | String | Domicilio del proveedor. |
| `productos` | Array | IDs de productos que suministra. |
| `estado` | Enum | [Activo, Inactivo]. |

### 📝 2.7. Pedidos (Orders)
Módulo central de transacciones.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `orderNumber` | String | Código único (ej: #1001). |
| `tipo` | Enum | [Mesa, Mostrador, Domicilio]. |
| `cliente` | ObjectID | Referencia al Cliente (FK). |
| `mesa` | ObjectID | Referencia a Mesa (FK). |
| `items` | Array | [ {productoID, cantidad, precioUnidad, subtotal} ]. |
| `total` | Number | Monto total a pagar. |
| `estado` | Enum | [Pendiente, Cocina, Servido, Pagado, Cancelado]. |
| `metodoPago` | Enum | [Efectivo, Tarjeta de Crédito, Tarjeta de Débito, Transferencia, Cheque]. |
| `mesero` | ObjectID | Empleado que atiende. |
| `ocasion` | Enum | [Cumpleaños, Aniversario, Graduación, Reunión Familiar, Cena de Negocios, Compromiso, Amigos]. |

### 💰 2.8. Finanzas (Accounting)
Balance de ingresos y gastos.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `tipo` | Enum | [Ingreso, Egreso]. |
| `descripcion` | String | Motivo del movimiento. |
| `monto` | Number | Valor de la transacción. |
| `categoria` | Enum | [Ventas, Nómina, Proveedores, Servicios, Otros]. |
| `fecha` | Date | Fecha efectiva del movimiento. |
| `vinculo` | ObjectID | ID del pedido o pago a proveedor (opcional). |

---

## 🔌 3. Endpoints de API Sugeridos

### Autenticación
*   `POST /auth/login` -> JWT Login.
*   `POST /auth/register` -> Registro inicial (Admin).

### Operaciones
*   `GET /api/v1/pedidos/cocina` -> Lista de pedidos activos para el área de producción.
*   `PATCH /api/v1/pedidos/:id/estado` -> Actualizar flujo del pedido.
*   `PATCH /api/v1/inventario/stock` -> Descuento masivo de stock tras cierre de día.
*   `GET /api/v1/finanzas/reporte?periodo=mensual` -> Generación de balance.

---

## 🧠 4. Lógica de Negocio Crítica

1.  **Descuento de Stock**: Cuando un pedido cambia de estado a `Pagado`, se debe descontar automáticamente el stock de los productos. Si el producto tiene una "receta" vinculada, descontar los `ingredientes` proporcionalmente.
2.  **Cálculo de Propinas**: Basándose en el parámetro `mesasAtendidas` de los meseros activos con `propinaAutomatica = true`, distribuir el valor total del servicio (si aplica).
3.  **Alertas de Inventario**: Si `stockActual <= stockMinimo`, el sistema debe enviar una notificación al frontend o generar un ítem en una "Lista de Compra sugerida".
4.  **Sincronización de Reservas**: Si una reserva llega a su hora y el cliente asiste, cambiar automáticamente el estado de la mesa asignada a `Ocupada`.
