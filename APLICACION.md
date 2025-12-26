# Documentación de la Aplicación Zarahemla

## Descripción General

Zarahemla es una aplicación móvil de tipo "Tinder Social" que permite a los usuarios conectarse, hacer match y socializar. La aplicación está construida con React Native y sigue una arquitectura modular.

## Estructura del Proyecto

```
.
├── .vscode/
│   └── .react/
├── assets/
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── src/
│   ├── components/
│   ├── data/
│   │   └── mockData.js
│   ├── i18n/
│   │   ├── en.json
│   │   ├── es.json
│   │   └── index.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── Matches/
│   │   │   ├── index.js
│   │   │   └── MatchesScreen.js
│   │   ├── Profile/
│   │   │   ├── EditProfileScreen.js
│   │   │   ├── index.js
│   │   │   └── ProfileScreen.js
│   │   ├── Register/
│   │   │   ├── components/
│   │   │   ├── index.js
│   │   │   └── RegisterScreen.js
│   │   └── Swipe/
│   │       ├── components/
│   │       ├── index.js
│   │       └── SwipeScreen.js
│   └── theme/
│       ├── colors.js
│       └── ThemeContext.js
├── .gitignore
├── App.js
├── app.json
├── babel.config.js
├── CLAUDE.md
├── index.js
├── package-lock.json
├── package.json
├── prd_tinder_social_match.md
└── technical_architecture_tinder_social.md
```

## Componentes Principales

### 1. Pantallas (Screens)

#### MatchesScreen
- **Ubicación**: `src/screens/Matches/`
- **Descripción**: Muestra los matches del usuario.
- **Archivos**:
  - `MatchesScreen.js`: Lógica principal de la pantalla de matches.
  - `index.js`: Exportación de la pantalla.

#### ProfileScreen
- **Ubicación**: `src/screens/Profile/`
- **Descripción**: Muestra el perfil del usuario.
- **Archivos**:
  - `ProfileScreen.js`: Lógica principal de la pantalla de perfil.
  - `EditProfileScreen.js`: Lógica para editar el perfil.
  - `index.js`: Exportación de la pantalla.

#### RegisterScreen
- **Ubicación**: `src/screens/Register/`
- **Descripción**: Maneja el registro de nuevos usuarios.
- **Archivos**:
  - `RegisterScreen.js`: Lógica principal de la pantalla de registro.
  - `components/`: Componentes específicos para el registro.
  - `index.js`: Exportación de la pantalla.

#### SwipeScreen
- **Ubicación**: `src/screens/Swipe/`
- **Descripción**: Implementa la funcionalidad de deslizar para hacer match.
- **Archivos**:
  - `SwipeScreen.js`: Lógica principal de la pantalla de swipe.
  - `components/`: Componentes específicos para el swipe.
  - `index.js`: Exportación de la pantalla.

### 2. Navegación

- **Ubicación**: `src/navigation/AppNavigator.js`
- **Descripción**: Configura la navegación entre pantallas utilizando React Navigation.

### 3. Tema

- **Ubicación**: `src/theme/`
- **Descripción**: Maneja el tema de la aplicación.
- **Archivos**:
  - `colors.js`: Define los colores utilizados en la aplicación.
  - `ThemeContext.js`: Proporciona un contexto para el tema.

### 4. Internacionalización (i18n)

- **Ubicación**: `src/i18n/`
- **Descripción**: Maneja la internacionalización de la aplicación.
- **Archivos**:
  - `en.json`: Traducciones en inglés.
  - `es.json`: Traducciones en español.
  - `index.js`: Configuración de i18n.

### 5. Datos

- **Ubicación**: `src/data/mockData.js`
- **Descripción**: Contiene datos de prueba para la aplicación.

### 6. Componentes Reutilizables

- **Ubicación**: `src/components/`
- **Descripción**: Contiene componentes reutilizables en toda la aplicación.

## Arquitectura Técnica

La aplicación sigue una arquitectura basada en componentes y pantallas, con un enfoque en la reutilización de código y la modularidad. Se utiliza React Navigation para la navegación entre pantallas y un contexto de tema para manejar la apariencia de la aplicación.

## Flujos Principales

### Flujo de Registro
1. El usuario abre la aplicación.
2. Se redirige a la pantalla de registro si no está autenticado.
3. El usuario completa el formulario de registro.
4. Se crea un nuevo perfil de usuario.

### Flujo de Swipe
1. El usuario ve perfiles de otros usuarios.
2. El usuario puede deslizar a la derecha para hacer match o a la izquierda para rechazar.
3. Si hay un match mutuo, se notifica al usuario.

### Flujo de Matches
1. El usuario accede a la pantalla de matches.
2. Se muestran los matches actuales.
3. El usuario puede interactuar con sus matches.

### Flujo de Perfil
1. El usuario accede a su perfil.
2. Puede ver y editar su información personal.
3. Puede subir o cambiar su foto de perfil.

## Dependencias Principales

- **React Native**: Framework principal para el desarrollo de la aplicación móvil.
- **React Navigation**: Para la navegación entre pantallas.
- **i18next**: Para la internacionalización.
- **Context API**: Para el manejo del tema y otros estados globales.

## Configuración del Proyecto

- **App.js**: Punto de entrada principal de la aplicación.
- **index.js**: Configuración inicial de React Native.
- **babel.config.js**: Configuración de Babel para la transpilación de código.
- **app.json**: Configuración de la aplicación para React Native.

## Recursos Adicionales

- **prd_tinder_social_match.md**: Documento de requisitos del producto.
- **technical_architecture_tinder_social.md**: Documento de arquitectura técnica.
- **CLAUDE.md**: Información adicional sobre el proyecto.

## Conclusión

Zarahemla es una aplicación móvil moderna construida con React Native que sigue buenas prácticas de desarrollo, incluyendo modularidad, reutilización de componentes y una arquitectura clara y mantenible.