# Links with Inline Attributes

Test inline attributes on links per SYNTAX.md §2.2.1 and §2.3

## Basic Link Attributes

[Regular link](https://example.com){.link-class}

[Button link](https://example.com){button primary}

[Link with multiple classes](url){.class-one .class-two .class-three}

## Link with Key-Value Attributes

[Click me](url){button modal="This is a simple alert!"}

[Learn more](url){modal="Extended information about this feature"}

[Help](url){tooltip="Helpful tip" id="my-tooltip"}

## Badge Links

[New](url){badge primary}

[Beta](url){badge info}

[Error](url){badge error}

## Combined Attributes

[Submit](url){button primary large modal="Form submitted successfully!"}

[Settings](url){button secondary .custom-class}
