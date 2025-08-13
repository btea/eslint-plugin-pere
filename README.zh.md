# eslint-plugin-pere

一个用于优化 JavaScript/TypeScript 代码性能的 ESLint 插件，专注于字符串操作的性能改进。

[English](README.md)

## 安装

```bash
npm install --save-dev eslint-plugin-pere
# 或者
yarn add --dev eslint-plugin-pere
# 或者
pnpm add --save-dev eslint-plugin-pere
```

## 配置

### 使用 ESLint Flat Config (推荐)

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

### 使用传统配置

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

## 规则说明

### `pere/no-startswith-one-char`

禁止使用 `startsWith()` 方法检查单个字符，建议使用更高效的字符索引访问。

#### ❌ 错误示例

```javascript
// 使用 startsWith 检查单个字符
if (str.startsWith('a')) {
  // ...
}

// 否定形式
if (!str.startsWith('-')) {
  // ...
}

// 复杂表达式
if (obj.prop.startsWith('x')) {
  // ...
}
```

#### ✅ 正确示例

```javascript
// 使用字符索引访问
if (str[0] === 'a') {
  // ...
}

// 否定形式
if (str[0] !== '-') {
  // ...
}

// 复杂表达式
if (obj.prop[0] === 'x') {
  // ...
}

// 多字符检查（不会被规则影响）
if (str.startsWith('hello')) {
  // ...
}
```

#### 自动修复

该规则支持自动修复：

```bash
npx eslint --fix your-file.js
```

修复效果：
- `str.startsWith('a')` → `str[0] === 'a'`
- `!str.startsWith('a')` → `str[0] !== 'a'`

### `pere/no-indexof-match-zero`

禁止使用 `indexOf()` 方法查找第一个元素，建议使用更直接的字符索引访问。

#### ❌ 错误示例

```javascript
// 使用 indexOf 检查第一个元素
if (str.indexOf('a') === 0) {
  // ...
}

if (array.indexOf(item) === 0) {
  // ...
}
```

#### ✅ 正确示例

```javascript
// 使用字符索引访问
if (str[0] === 'a') {
  // ...
}

// 使用 startsWith
if (str.startsWith('a')) {
  // ...
}

// 使用数组索引
if (array[0] === item) {
  // ...
}

// 其他 indexOf 用法（不会被规则影响）
if (str.indexOf('a') === 1) {
  // ...
}
```

### `pere/duplicate-constructor`

禁止在循环中重复创建相同的实例，建议将实例创建移到循环外部以提高性能。

#### ❌ 错误示例

```javascript
// 在循环中重复创建正则表达式
for (let i = 0; i < items.length; i++) {
  if (/pattern/.test(items[i])) {
    // ...
  }
}

// 在循环中重复创建 Date 对象
for (const item of items) {
  const now = new Date();
  // ...
}
```

#### ✅ 正确示例

```javascript
// 将正则表达式移到循环外
const pattern = /pattern/;
for (let i = 0; i < items.length; i++) {
  if (pattern.test(items[i])) {
    // ...
  }
}

// 将 Date 创建移到循环外
const now = new Date();
for (const item of items) {
  // ...
}
```

## 性能优势

### `startsWith` vs 字符索引

```javascript
// 性能测试示例
const str = 'hello world';

// 较慢 - 需要方法调用开销
str.startsWith('h')

// 更快 - 直接内存访问
str[0] === 'h'
```

### `indexOf` vs 字符索引

```javascript
// 较慢 - 方法调用 + 搜索算法
str.indexOf('a') === 0

// 更快 - 直接比较
str[0] === 'a'
```

### 循环中的实例创建

```javascript
// 性能问题 - 每次循环都创建新实例
for (let i = 0; i < 1000; i++) {
  const regex = /pattern/;  // 创建1000次
  // ...
}

// 性能优化 - 只创建一次
const regex = /pattern/;
for (let i = 0; i < 1000; i++) {
  // 重复使用同一个实例
  // ...
}
```

在大量字符串处理场景下，使用字符索引访问比方法调用性能更好。在循环中避免重复创建实例可以显著提高性能。
