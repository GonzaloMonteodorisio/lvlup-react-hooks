# Lib de utilidades

## Consignas: Crear librería de hooks

Requisitos mínimos:

1. Al menos un hook
2. Testing de el / los hooks (@testing-library/react-hooks)
3. Mutation testing
4. Documentación
5. PR's

### Ideas

- Hook de fetching (+ interceptors)
- Validación / manejo de formularios
- Animaciones
- Utilidades (useToggle, useModal)

### Armado de nuestra lib

```
  yarn add -D @types/node vite-plugin-dts // exponer los tipos
```

Eslint
```
 yarn add -D eslint-plugin-react-hooks eslint-plugin-simple-import-sort
```

### Testing
yarn add -D 
  vitest 
  @testing-library/react-hooks
  @testing-library/jest-dom jsdom
  @testing-library/react