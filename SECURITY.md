# Security Policy

## Supported Versions

We actively support the following versions of viewport-sense with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of viewport-sense seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT create a public issue

Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.

### 2. Send a private report

Instead, please send an email to **nishadkindre@gmail.com** with the following information:

- **Subject Line**: `[SECURITY] Vulnerability Report for viewport-sense`
- **Description**: A clear description of the vulnerability
- **Impact**: Potential impact and severity assessment
- **Reproduction**: Step-by-step instructions to reproduce the issue
- **Environment**: Browser versions, operating systems, or other relevant environment details
- **Proposed Fix**: If you have suggestions for how to fix the issue (optional)

### 3. Response Timeline

- **Acknowledgment**: We will acknowledge your email within **48 hours**
- **Initial Response**: We will provide a detailed response within **7 days** with our assessment and planned actions
- **Progress Updates**: We will keep you informed of our progress on addressing the vulnerability
- **Resolution**: We will notify you when the vulnerability has been fixed

### 4. Coordinated Disclosure

We follow a coordinated disclosure process:

1. We will work with you to understand and reproduce the vulnerability
2. We will develop and test a fix
3. We will prepare a security advisory and coordinate timing for public disclosure
4. We will release the fix and publish the security advisory
5. We will credit you in the security advisory (if you wish to be credited)

## Security Considerations

### Client-Side Library

viewport-sense is a client-side library that runs in web browsers. Security considerations include:

- **XSS Prevention**: The library does not inject HTML or execute arbitrary code
- **Data Sanitization**: All user agent parsing and device detection use safe string operations
- **No External Requests**: The library does not make network requests or load external resources
- **CSP Compliance**: Compatible with strict Content Security Policies

### Browser APIs

The library uses standard browser APIs:

- `ResizeObserver` - For viewport change detection
- `IntersectionObserver` - For element visibility tracking
- `matchMedia` - For media query matching
- `navigator.userAgent` - For device detection (read-only)

These APIs are used safely and do not expose sensitive information.

### Dependencies

viewport-sense is designed to have zero runtime dependencies to minimize security risks:

- No third-party runtime dependencies
- Development dependencies are regularly updated
- All dependencies are scanned for known vulnerabilities

## Security Best Practices for Users

When using viewport-sense in your applications:

### 1. Content Security Policy (CSP)

The library is compatible with strict CSP policies. No special CSP directives are needed.

### 2. Subresource Integrity (SRI)

When loading from CDN, use SRI hashes:

```html
<script 
  src="https://unpkg.com/viewport-sense@1.0.1/dist/index.umd.js"
  integrity="sha384-[hash-will-be-provided]"
  crossorigin="anonymous">
</script>
```

### 3. Input Validation

While viewport-sense doesn't accept user input directly, validate any configuration passed to the library:

```javascript
// Good: Validate configuration
const config = {
  customBreakpoints: validateBreakpoints(userConfig.breakpoints),
  debounceDelay: Math.max(0, Math.min(1000, userConfig.delay || 100))
};

const bp = createBreakpointJS(config);
```

### 4. Error Handling

Implement proper error handling:

```javascript
try {
  const bp = createBreakpointJS(config);
  // Use breakpoint instance
} catch (error) {
  console.error('Failed to initialize viewport-sense:', error);
  // Fallback behavior
}
```

## Vulnerability Disclosure History

No security vulnerabilities have been reported for viewport-sense as of the current version.

## Contact

For security concerns, please contact:

- **Email**: nishadkindre@gmail.com
- **Response Time**: Within 48 hours
- **Languages**: English

For general questions about security practices or this policy, you can also:

- Open a [GitHub Discussion](https://github.com/nishadkindre/viewport-sense/discussions)
- Review our [Contributing Guidelines](CONTRIBUTING.md)

## Recognition

We appreciate security researchers who help keep viewport-sense safe. Depending on the severity and impact of the vulnerability, we may:

- Credit you in our security advisory
- Mention your contribution in our changelog
- Offer a public thank you on our project page

Thank you for helping keep viewport-sense and our users safe!

---

Last updated: September 27, 2025