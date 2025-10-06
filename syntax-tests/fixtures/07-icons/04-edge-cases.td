# Icon Edge Cases

Test icon edge cases per SYNTAX.md §2.6.5

## Invalid Icon Names

:icon[nonexistent-icon]

:icon[]

:icon[icon with spaces]

:icon[Icon]

:icon[123-icon]

:icon[icon_name]

## Escaped Syntax

Escaped: `\:icon[home]`

In code: `:icon[star]`

Code block:
```
:icon[star]
:icon[heart]
```

## Icons in Links

[Text with :icon[star] icon](url)

[:icon[home]](#)

[:icon[arrow-right]](#){button primary}

## Empty Attributes

:icon[home]{}

:icon[home]{  }

## Malformed Syntax

:icon[home

icon[home]

:icons[home]

## Multiple Icons Together

:icon[home]:icon[star]:icon[heart]

:icon[home] :icon[star] :icon[heart]
