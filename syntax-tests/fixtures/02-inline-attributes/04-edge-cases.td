# Inline Attributes Edge Cases

Test edge cases per SYNTAX.md §2.4

## Empty Attribute Block

# Heading {}

# Heading {  }

## Literal Braces in Code

Use backticks: `{.not-a-class}`

Code block test:
```
{.not-a-class}
```

## Malformed Attributes

# Heading {class-without-dot}

# Heading .class}

Text with {.class

## Whitespace Handling

# Valid {.class-one .class-two}

# Valid {.class-one  .class-two}

# Valid { .class-one .class-two }

## Multiple Attribute Blocks

# Heading {.class-one}

Not valid: {.class-one}{.class-two}

## Attributes in Invalid Positions

{.invalid} # Heading

Middle {.attrs} text
