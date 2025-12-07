# Sistema de Diseño Unificado - Pingui Alert

## 📋 Resumen de Cambios

Se ha unificado todo el sistema de estilos del frontend de Pingui Alert en un solo archivo CSS (`styles.css`) que funciona como un **Design System completo**.

### Archivos Eliminados

- ❌ `css/userDataStyles.css` - Eliminado (estilos consolidados en styles.css)
- ❌ `css/login.css` - Eliminado (estilos consolidados en styles.css)

### Archivos Actualizados

- ✅ `css/styles.css` - Sistema de diseño unificado completo
- ✅ `index.html` - Sin cambios (ya usaba el sistema correcto)
- ✅ `docs.html` - Sin cambios (ya usaba el sistema correcto)
- ✅ `login.html` - Mejorado con mejor diseño visual
- ✅ `user_data.html` - Actualizado para usar Outfit y styles.css únicamente
- ✅ `not_found.html` - Mejorado con mejor diseño visual

## 🎨 Sistema de Diseño

### Tipografía

- **Fuente Principal**: `Outfit` (300, 400, 600, 700)
- **Fuente Monoespaciada**: `JetBrains Mono` (400, 700)

### Paleta de Colores

#### Fondos

```css
--bg-color: #0a0a0c
--bg-gradient: linear-gradient(135deg, #0a0a0c 0%, #1a1a2e 100%)
```

#### Texto

```css
--text-primary: #ffffff
--text-secondary: #a1a1aa
--text-muted: #71717a
```

#### Acentos

```css
--accent-primary: #3b82f6 (Azul)
--accent-secondary: #8b5cf6 (Púrpura)
--accent-success: #10b981 (Verde)
--accent-warning: #f59e0b (Naranja)
--accent-error: #ef4444 (Rojo)
```

#### Superficies

```css
--card-bg: rgba(255, 255, 255, 0.03)
--card-bg-hover: rgba(255, 255, 255, 0.08)
--border-color: rgba(255, 255, 255, 0.1)
```

### Espaciado y Bordes

```css
--border-radius: 12px
--border-radius-lg: 16px
--border-radius-sm: 8px
```

### Transiciones

```css
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--transition-fast: all 0.15s ease
```

## 🧩 Componentes Disponibles

### Layout

- `.background-glow` - Efecto de resplandor de fondo
- `.container` - Contenedor principal con max-width
- `.navbar` - Barra de navegación
- `main` - Contenedor principal de contenido

### Navegación

- `.logo` - Logo de la aplicación
- `.badge` - Badge (Beta, etc.)
- `.nav-links` - Contenedor de enlaces de navegación
- `.nav-link` - Enlaces de navegación
- `.nav-link.active` - Enlace activo

### Tipografía

- `.title` - Título con gradiente
- `.subtitle` - Subtítulo
- `.gradient-text` - Texto con gradiente
- `.text-center` - Texto centrado

### Botones

- `.btn` - Botón base
- `.btn-primary` - Botón primario (blanco)
- `.btn-secondary` - Botón secundario (transparente con borde)
- `.btn-gradient` - Botón con gradiente azul-púrpura

### Tarjetas

- `.card` - Tarjeta base
- `.card-header` - Encabezado de tarjeta
- `.card-label` - Etiqueta de tarjeta
- `.card-value` - Valor de tarjeta
- `.card-value-large` - Valor grande con gradiente
- `.info-card` - Tarjeta de información (para user_data)
- `.info-card.highlight` - Tarjeta destacada
- `.info-grid` - Grid de tarjetas de información

### Formularios

- `.form` - Formulario base
- `.form-group` - Grupo de campo de formulario
- `.login-form` - Formulario de login (con estilos especiales)

### Código

- `code` - Código inline
- `pre` - Bloque de código
- `.code-window` - Ventana de código estilo editor
- `.window-header` - Encabezado de ventana de código
- `.code-content` - Contenido de código
- `.code-snippet-small` - Snippet pequeño de código

### Componentes Especiales

- `.secret-section` - Sección para mostrar secretos
- `.secret-code` - Código secreto
- `.secret-code.blurred` - Código secreto difuminado
- `.reveal-button` - Botón para revelar secreto
- `.copy-button` - Botón para copiar
- `.secret-warning` - Advertencia de seguridad

### Secciones

- `.hero` - Sección hero
- `.features` - Grid de características
- `.feature-card` - Tarjeta de característica
- `.integration-options` - Sección de opciones de integración
- `.options-grid` - Grid de opciones
- `.option-card` - Tarjeta de opción

### Documentación

- `.docs-container` - Contenedor de documentación
- `.sidebar` - Barra lateral
- `.sidebar-group` - Grupo de enlaces en sidebar
- `.sidebar-link` - Enlace de sidebar
- `.docs-content` - Contenido de documentación
- `.steps-list` - Lista de pasos
- `.info-box` - Caja de información
- `.endpoint-badge` - Badge de endpoint API
- `.docs-table` - Tabla de documentación

### Footer

- `footer` - Pie de página
- `.footer` - Pie de página alternativo (para user_data)
- `.close-button` - Botón de cerrar

### Animaciones

- `.fade-in-down` - Animación de entrada desde arriba
- `.fade-in-up` - Animación de entrada desde abajo

## 📱 Responsive Design

El sistema incluye breakpoints para:

- **Mobile**: < 640px
- **Tablet**: < 900px
- **Desktop**: > 900px

## 🎯 Uso

### Importar en HTML

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap"
  rel="stylesheet"
/>
<link rel="stylesheet" href="/css/styles.css" />
```

### Ejemplo de Tarjeta

```html
<div class="info-card">
  <div class="card-label">Chat ID</div>
  <div class="card-value">123456789</div>
</div>
```

### Ejemplo de Botón

```html
<button class="btn btn-gradient">Click Me</button>
```

### Ejemplo de Formulario

```html
<form class="login-form">
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" placeholder="Enter your email" />
  </div>
  <button type="submit" class="btn btn-gradient">Submit</button>
</form>
```

## ✨ Beneficios

1. **Consistencia**: Todos los componentes usan las mismas variables y estilos
2. **Mantenibilidad**: Un solo archivo CSS para mantener
3. **Performance**: Menos archivos CSS para cargar
4. **Escalabilidad**: Fácil agregar nuevos componentes usando el sistema existente
5. **Accesibilidad**: Colores con buen contraste y transiciones suaves
6. **Responsive**: Diseño adaptable a todos los tamaños de pantalla

## 🔄 Migración Completada

Todas las páginas ahora usan el mismo sistema de diseño:

- ✅ Fuente unificada (Outfit)
- ✅ Variables CSS consistentes
- ✅ Componentes reutilizables
- ✅ Estilos coherentes en todas las páginas
- ✅ Sin archivos CSS redundantes
