# purple-cross-dashboard

A modern dashboard application built with [Vue 3](https://vuejs.org/), [Vite](https://vitejs.dev/), and [TypeScript](https://www.typescriptlang.org/), styled using [Bootstrap 5](https://getbootstrap.com/) and validated with [VeeValidate](https://vee-validate.logaretm.com/). Includes unit testing support via [Vitest](https://vitest.dev/).

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/xiomarapulido/purple-cross-dashboard.git
cd purple-cross-dashboard

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

---

## Recommended IDE Setup

- [Visual Studio Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)

---

## ðŸš€ Getting Started (Detailed)

### 1. Clone the Repository

```bash
git clone https://github.com/xiomarapulido/purple-cross-dashboard.git
cd purple-cross-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

---

## Usage

### Run for Development

```bash
npm run dev
```

### Build for Production (with Type Checking)

```bash
npm run build
```

### Run Unit Tests

```bash
npm run test:unit
```

### Lint the Code

```bash
npm run lint
```

### Format Code with Prettier

```bash
npm run format
```

---

## Project Structure

```
src/
assets/        # Images and static files
components/    # Reusable Vue components
views/         # Page-level components
styles/        # Global styles (Bootstrap-based)
router/        # Vue Router setup
store/         # Pinia store setup
main.ts        # App entry point
```

---

## Features

- Bootstrap 5 responsive design
- Form validation with VeeValidate + Yup
- Centralized event handling with `mitt`
- State management with Pinia
- Unit testing with Vitest
- Linting and formatting included

---

## Testing

This project uses [Vitest](https://vitest.dev/) with `@vue/test-utils` and `jsdom`. Test files are placed next to the components using `.spec.ts` extension.

To run unit tests:

```bash
npm run test:unit
```

---

## Author

**Xiomara Andrea Pulido**  



## License

This project is licensed under the [MIT License](./LICENSE).
