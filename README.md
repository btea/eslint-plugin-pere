# eslint-plugin-pere

An ESLint plugin for optimizing JavaScript/TypeScript code performance, focusing on string operation performance improvements.

[中文版](README.zh.md)

## Installation

```bash
npm install --save-dev eslint-plugin-pere
# or
yarn add --dev eslint-plugin-pere
# or
pnpm add --save-dev eslint-plugin-pere
```

## Configuration

### Using ESLint Flat Config (Recommended)

```javascript
// eslint.config.js
import pere from 'eslint-plugin-pere';

export default [
  {
    plugins: {
      pere,
    },
    rules: {
      'pere/no-startswith-one-char': 'error',
      'pere/duplicate-constructor': 'error',
      'pere/no-indexof-match-zero': 'error',
    },
  },
];
```

### Using Legacy Configuration

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['pere'],
  rules: {
    'pere/no-startswith-one-char': 'error',
    'pere/duplicate-constructor': 'error',
    'pere/no-indexof-match-zero': 'error',
  },
};
```

## Rules

### `pere/no-startswith-one-char`

Disallow using `startsWith()` method to check single characters. Recommend using more efficient character index access.

#### ❌ Incorrect

```javascript
// Using startsWith to check single character
if (str.startsWith('a')) {
  // ...
}

// Negated form
if (!str.startsWith('-')) {
  // ...
}

// Complex expression
if (obj.prop.startsWith('x')) {
  // ...
}
```

#### ✅ Correct

```javascript
// Using character index access
if (str[0] === 'a') {
  // ...
}

// Negated form
if (str[0] !== '-') {
  // ...
}

// Complex expression
if (obj.prop[0] === 'x') {
  // ...
}

// Multi-character check (not affected by rule)
if (str.startsWith('hello')) {
  // ...
}
```

#### Auto-fix

This rule supports auto-fixing:

```bash
npx eslint --fix your-file.js
```

Fix results:
- `str.startsWith('a')` → `str[0] === 'a'`
- `!str.startsWith('a')` → `str[0] !== 'a'`

### `pere/no-indexof-match-zero`

Disallow using `indexOf()` method to find the first element. Recommend using more direct character index access.

#### ❌ Incorrect

```javascript
// Using indexOf to check first element
if (str.indexOf('a') === 0) {
  // ...
}

if (array.indexOf(item) === 0) {
  // ...
}
```

#### ✅ Correct

```javascript
// Using character index access
if (str[0] === 'a') {
  // ...
}

// Using startsWith
if (str.startsWith('a')) {
  // ...
}

// Using array index
if (array[0] === item) {
  // ...
}

// Other indexOf usage (not affected by rule)
if (str.indexOf('a') === 1) {
  // ...
}
```

### `pere/duplicate-constructor`

Disallow repeatedly creating the same instances within loops. Recommend moving instance creation outside the loop to improve performance.

#### ❌ Incorrect

```javascript
// Repeatedly creating regex in loop
for (let i = 0; i < items.length; i++) {
  if (/pattern/.test(items[i])) {
    // ...
  }
}

// Repeatedly creating Date object in loop
for (const item of items) {
  const now = new Date();
  // ...
}
```

#### ✅ Correct

```javascript
// Move regex creation outside loop
const pattern = /pattern/;
for (let i = 0; i < items.length; i++) {
  if (pattern.test(items[i])) {
    // ...
  }
}

// Move Date creation outside loop
const now = new Date();
for (const item of items) {
  // ...
}
```

## Performance Benefits

### `startsWith` vs Character Index

```javascript
// Performance test example
const str = 'hello world';

// Slower - method call overhead
str.startsWith('h')

// Faster - direct memory access
str[0] === 'h'
```

### `indexOf` vs Character Index

```javascript
// Slower - method call + search algorithm
str.indexOf('a') === 0

// Faster - direct comparison
str[0] === 'a'
```

### Instance Creation in Loops

```javascript
// Performance issue - creating new instance every iteration
for (let i = 0; i < 1000; i++) {
  const regex = /pattern/;  // Created 1000 times
  // ...
}

// Performance optimization - create once
const regex = /pattern/;
for (let i = 0; i < 1000; i++) {
  // Reuse the same instance
  // ...
}
```

In scenarios with heavy string processing, using character index access performs better than method calls. Avoiding repeated instance creation in loops can significantly improve performance.
