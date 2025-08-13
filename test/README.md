# Test Suite for eslint-plugin-pere

This directory contains comprehensive tests for all rules in the eslint-plugin-pere package.

## Test Structure

### Individual Rule Tests

- **`no-startswith-one-char.test.ts`** - Tests for the `no-startswith-one-char` rule
- **`no-indexof-match-zero.test.ts`** - Tests for the `no-indexof-match-zero` rule
- **`duplicate-constructor.test.ts`** - Tests for the `duplicate-constructor` rule

### Integration Tests

- **`integration.test.ts`** - Tests for plugin integration and real-world scenarios
- **`index.test.ts`** - Test runner that imports all test files

## Test Coverage

### `no-startswith-one-char` Rule Tests

#### Valid Cases (Should NOT trigger the rule):
- Multi-character strings: `str.startsWith("hello")`
- Empty strings: `str.startsWith("")`
- Non-literal arguments: `str.startsWith(variable)`
- Different methods: `str.endsWith("a")`, `str.includes("a")`
- Already optimized patterns: `str[0] === "a"`

#### Invalid Cases (Should trigger the rule):
- Single character strings: `str.startsWith("a")` → `str[0] === "a"`
- Negated forms: `!str.startsWith("a")` → `str[0] !== "a"`
- Complex object access: `obj.prop.startsWith("x")` → `obj.prop[0] === "x"`
- Function results: `getName().startsWith("J")` → `getName()[0] === "J"`
- Special characters: `str.startsWith("-")`, `str.startsWith("_")`
- Numeric strings: `str.startsWith("1")`
- Different quote styles: `str.startsWith('a')`

### `no-indexof-match-zero` Rule Tests

#### Valid Cases (Should NOT trigger the rule):
- Different comparison values: `str.indexOf("a") === 1`
- Multi-character search: `str.indexOf("hello") === 0`
- Different operators: `str.indexOf("a") !== 0`
- Different methods: `str.lastIndexOf("a") === 0`
- Non-literal search values: `str.indexOf(variable) === 0`
- Already optimized patterns: `str[0] === "a"`

#### Invalid Cases (Should trigger the rule):
- Basic cases: `str.indexOf("a") === 0` → `str[0] === "a"`
- Complex object access: `obj.prop.indexOf("a") === 0` → `obj.prop[0] === "a"`
- Function results: `getName().indexOf("J") === 0` → `getName()[0] === "J"`
- Special characters: `str.indexOf("-") === 0`
- Unicode characters: `str.indexOf("€") === 0`
- Whitespace characters: `str.indexOf(" ") === 0`

### `duplicate-constructor` Rule Tests

#### Valid Cases (Should NOT trigger the rule):
- Outside of loops: literal arrays and objects
- Dynamic values: `[i, i + 1]`, `{ key: variable }`
- Empty collections: `[]`, `{}`
- Pre-defined variables being used
- Loops without constructor patterns

#### Invalid Cases (Should trigger the rule):
- Array literals in loops: `const arr = [1, 2, 3]` in for/while/do-while loops
- Object literals in loops: `const obj = { a: 1, b: 2 }`
- Array method calls on literals: `[1, 2, 3].forEach(callback)`
- Object method calls on literals: `{ a: 1 }.hasOwnProperty("a")`
- Mixed type literals: `[1, "two", true]`
- Nested loop scenarios

## Integration Tests

The integration tests verify:

1. **Plugin exports** - All rules are properly exported
2. **Meta information** - Plugin name and version are correct
3. **Multi-rule scenarios** - Code that triggers multiple rules
4. **Real-world examples** - Complex code patterns
5. **Optimized code verification** - Ensuring optimized code doesn't trigger rules

## Running Tests

```bash
# Install dependencies
pnpm install

# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test no-startswith-one-char.test.ts

# Run tests with coverage
pnpm test --coverage
```

## Test Scenarios

### Real-World Example 1: Data Processing

```javascript
function processItems(items) {
  for (let i = 0; i < items.length; i++) {
    const config = { processed: true }; // duplicate-constructor

    if (item.name.startsWith("A")) { // no-startswith-one-char
      config.priority = "high";
    }

    if (item.description.indexOf("!") === 0) { // no-indexof-match-zero
      config.urgent = true;
    }
  }
}
```

### Optimized Version:

```javascript
function processItems(items) {
  const defaultConfig = { processed: true }; // Moved outside loop

  for (let i = 0; i < items.length; i++) {
    const config = { ...defaultConfig };

    if (item.name[0] === "A") { // Optimized
      config.priority = "high";
    }

    if (item.description[0] === "!") { // Optimized
      config.urgent = true;
    }
  }
}
```

## Performance Benefits Tested

1. **String Operations**: Character index access vs method calls
2. **Loop Optimization**: Moving invariant constructions outside loops
3. **Memory Efficiency**: Avoiding repeated object/array creation

## Auto-fix Testing

The tests verify that auto-fix works correctly for:
- `str.startsWith("a")` → `str[0] === "a"`
- `!str.startsWith("a")` → `str[0] !== "a"`
- `str.indexOf("a") === 0` → `str[0] === "a"`

## Edge Cases Covered

- Unicode characters: `"€"`, `"中"`
- Special characters: `"-"`, `"+"`, `"_"`
- Whitespace: `" "`, `"\\t"`, `"\\n"`
- Quote styles: Both single and double quotes
- Complex member expressions: `obj.prop.method()`
- Nested function calls: `getObject().getProp().startsWith("a")`
