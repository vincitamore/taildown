# Basic Markdown Support {huge-bold}

Taildown fully supports standard Markdown (CommonMark) and GitHub Flavored Markdown (GFM). {large}

## Text Formatting

You can use **bold text**, *italic text*, and ***bold italic text***.

You can also use ~~strikethrough~~ and `inline code`.

## Lists

### Unordered Lists

- First item
- Second item
- Third item
  - Nested item
  - Another nested item

### Ordered Lists

1. First step
2. Second step
3. Third step
   1. Sub-step A
   2. Sub-step B

### Task Lists (GFM)

- [x] Completed task
- [ ] Incomplete task
- [ ] Another task to do

## Links and Images

[Visit Taildown :icon[external-link]{xs}](https://taildown.dev)

![Alt text for image](https://via.placeholder.com/150)

## Code Blocks

```javascript
// JavaScript code block
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("Taildown");
```

```python
# Python code block
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

## Blockquotes

> This is a blockquote.
> It can span multiple lines.
>
> And have multiple paragraphs.

## Tables (GFM)

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | :icon[check]{success} | H1-H6 |
| Lists | :icon[check]{success} | Ordered and unordered |
| Code | :icon[check]{success} | Inline and blocks |
| Tables | :icon[check]{success} | GFM extension |

## Horizontal Rules

---

That's the basics of Markdown in Taildown!


