# http-fault

A lightweight, framework-agnostic TypeScript library for creating and handling structured HTTP exceptions.

## Features

- **Full 4xx/5xx coverage** — one class per HTTP status code
- **Structured responses** — consistent JSON shape across every error
- **Framework agnostic** — works with Express, Fastify, Koa, Hono, raw `node:http`, or anything built on it
- **Safe by default** — 5xx details are hidden from clients unless explicitly exposed
- **Extensible** — create domain-specific exceptions by extending any class
- **Zero dependencies** — only uses `node:http` built-in types

---

## Installation

```bash
npm install http-fault
```

---

## File Structure

```
http.exception.ts        # Abstract base class
exceptions.ts       # All 4xx and 5xx exception classes
exception.filter.ts      # Framework-agnostic error handler
```

---

## Quick Start

```typescript
import { NotFoundException } from "http-fault";

throw new NotFoundException({ message: "User not found." });
```

Every error is serialized to a consistent JSON response:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "User not found.",
  "code": undefined,
  "details": undefined,
  "path": "/users/99",
  "timestamp": "2026-02-28T12:00:00.000Z"
}
```

---

## HttpException Base Class

All exceptions extend `HttpException`, which extends `Error`.

```typescript
abstract class HttpException extends Error {
  readonly status: number; // HTTP status code
  readonly error: string; // Standard HTTP error name
  readonly message: string; // Human-readable description (inherited from Error)
  readonly code?: string; // Optional machine-readable error code
  readonly details?: unknown; // Optional structured payload
  readonly expose: boolean; // Whether details are safe to send to the client
  readonly cause?: Error; // Optional originating error
}
```

### Constructor Options

All exception constructors accept an optional options object:

| Option    | Type      | Description                                                                                  |
| --------- | --------- | -------------------------------------------------------------------------------------------- |
| `message` | `string`  | Human-readable description. Defaults to the HTTP error name.                                 |
| `code`    | `string`  | Machine-readable error code (e.g. `"USER_NOT_FOUND"`).                                       |
| `details` | `unknown` | Structured payload (e.g. validation errors).                                                 |
| `expose`  | `boolean` | Whether `message` and `details` reach the client. Auto-set: `true` for 4xx, `false` for 5xx. |
| `cause`   | `Error`   | The originating error, for error chaining.                                                   |

---

## Built-in Exceptions

### 4xx Client Errors

| Class                                  | Status |
| -------------------------------------- | ------ |
| `BadRequestException`                  | 400    |
| `UnauthorizedException`                | 401    |
| `PaymentRequiredException`             | 402    |
| `ForbiddenException`                   | 403    |
| `NotFoundException`                    | 404    |
| `MethodNotAllowedException`            | 405    |
| `NotAcceptableException`               | 406    |
| `ProxyAuthenticationRequiredException` | 407    |
| `RequestTimeoutException`              | 408    |
| `ConflictException`                    | 409    |
| `GoneException`                        | 410    |
| `LengthRequiredException`              | 411    |
| `PreconditionFailedException`          | 412    |
| `ContentTooLargeException`             | 413    |
| `URITooLongException`                  | 414    |
| `UnsupportedMediaTypeException`        | 415    |
| `RangeNotSatisfiableException`         | 416    |
| `ExpectationFailedException`           | 417    |
| `ImATeapotException`                   | 418    |
| `MisdirectedRequestException`          | 421    |
| `UnprocessableEntityException`         | 422    |
| `LockedException`                      | 423    |
| `FailedDependencyException`            | 424    |
| `TooEarlyException`                    | 425    |
| `UpgradeRequiredException`             | 426    |
| `PreconditionRequiredException`        | 428    |
| `TooManyRequestsException`             | 429    |
| `RequestHeaderFieldsTooLargeException` | 431    |
| `UnavailableForLegalReasonsException`  | 451    |

### 5xx Server Errors

| Class                                    | Status |
| ---------------------------------------- | ------ |
| `InternalServerErrorException`           | 500    |
| `NotImplementedException`                | 501    |
| `BadGatewayException`                    | 502    |
| `ServiceUnavailableException`            | 503    |
| `GatewayTimeoutException`                | 504    |
| `HTTPVersionNotSupportedException`       | 505    |
| `VariantAlsoNegotiatesException`         | 506    |
| `InsufficientStorageException`           | 507    |
| `LoopDetectedException`                  | 508    |
| `NotExtendedException`                   | 510    |
| `NetworkAuthenticationRequiredException` | 511    |

---

## Throwing Exceptions

```typescript
import {
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
  ConflictException,
} from "http-fault";

// Minimal — just a status
throw new NotFoundException();

// With a message
throw new NotFoundException({ message: "User 42 not found." });

// With a machine-readable code
throw new ForbiddenException({
  message: "Only admins can perform this action.",
  code: "INSUFFICIENT_ROLE",
});

// With structured details (great for validation errors)
throw new UnprocessableEntityException({
  message: "Validation failed.",
  code: "VALIDATION_FAILED",
  details: {
    email: ["Must be a valid email address."],
    age: ["Must be at least 18."],
  },
});

// With error chaining
try {
  await db.insert(user);
} catch (cause) {
  throw new ConflictException({
    message: "A user with this email already exists.",
    code: "EMAIL_TAKEN",
    cause,
  });
}
```

---

## Custom Exceptions

Extend any built-in class to create reusable domain exceptions.

```typescript
import {
  UnauthorizedException,
  TooManyRequestsException,
  HttpException,
} from "http-fault";

// Fix the code and default message for a specific auth scenario
class TokenExpiredException extends UnauthorizedException {
  constructor(cause?: Error) {
    super({
      message: "Your session has expired. Please sign in again.",
      code: "TOKEN_EXPIRED",
      cause,
    });
  }
}

// Carry typed runtime data in details
class QuotaExceededException extends TooManyRequestsException {
  constructor(used: number, limit: number) {
    super({
      message: `Daily quota exceeded (${used}/${limit}).`,
      code: "QUOTA_EXCEEDED",
      details: { used, limit },
    });
  }
}

// Build directly on HttpException for full control
class MaintenanceModeException extends HttpException {
  constructor(until: string) {
    super(503, "Service Unavailable", {
      message: "The service is under scheduled maintenance.",
      code: "MAINTENANCE_MODE",
      details: { until },
      expose: true, // safe to surface despite being 5xx
    });
  }
}

// Usage
throw new TokenExpiredException();
throw new QuotaExceededException(1000, 1000);
throw new MaintenanceModeException("2026-03-01T06:00:00Z");
```

---

## ExceptionFilter

The `ExceptionFilter` converts any thrown value into a structured JSON response. It handles both `HttpException` instances and unexpected raw errors.

### API

```typescript
// One-off call
ExceptionFilter(err, req, res, options?)

// Pre-configured factory — bind options once, reuse everywhere
const handleError = createExceptionFilter(options?)
handleError(err, req, res)
```

### Options

| Option             | Type                      | Description                                                                   |
| ------------------ | ------------------------- | ----------------------------------------------------------------------------- |
| `onError`          | `(err, response) => void` | Custom logger. Called for all errors if provided, or only 5xx by default.     |
| `resolvePath`      | `(req) => string`         | Override how the request path is extracted. Defaults to `req.url ?? "/"`.     |
| `forceHideDetails` | `boolean`                 | Always hide `message` and `details`, regardless of `expose`. Useful in tests. |

### Integrations

**Raw Node.js**

```typescript
import http from "node:http";
import { ExceptionFilter } from "http-fault";

http
  .createServer(async (req, res) => {
    try {
      await router(req, res);
    } catch (err) {
      ExceptionFilter(err, req, res);
    }
  })
  .listen(3000);
```

**Express**

```typescript
import express from "express";
import { ExceptionFilter } from "http-fault";

const app = express();

app.get("/users/:id", (req, res) => {
  throw new NotFoundException({ message: `User ${req.params.id} not found.` });
});

// Register last
app.use((err, req, res, _next) => ExceptionFilter(err, req, res));
```

**Fastify**

```typescript
import Fastify from "fastify";
import { ExceptionFilter } from "http-fault";

const fastify = Fastify();

fastify.setErrorHandler((err, req, reply) => {
  ExceptionFilter(err, req.raw, reply.raw);
});
```

**Koa**

```typescript
import Koa from "koa";
import { ExceptionFilter } from "http-fault";

const app = new Koa();

app.on("error", (err, ctx) => {
  ExceptionFilter(err, ctx.req, ctx.res);
});
```

### Custom Logger

```typescript
import pino from "pino";
import { createExceptionFilter } from "http-fault";

const logger = pino();

export const handleError = createExceptionFilter({
  onError: (err, response) => {
    if (response.status >= 500) {
      logger.error({ err, response }, "Unhandled server error");
    } else {
      logger.warn({ response }, "Client error");
    }
  },
});

// app.use((err, req, res, _next) => handleError(err, req, res));
```

---

## The `expose` Flag

This flag controls whether `message` and `details` are sent to the client.

| Scenario         | `expose` default | What the client sees              |
| ---------------- | ---------------- | --------------------------------- |
| 4xx exception    | `true`           | Full `message` and `details`      |
| 5xx exception    | `false`          | Only the standard HTTP error name |
| Custom exception | Your choice      | Depends on `expose` option        |

```typescript
// Client receives the full message and details (expose: true by default for 4xx)
throw new UnprocessableEntityException({
  message: "Email is invalid.",
  details: { field: "email" },
});
// → { message: "Email is invalid.", details: { field: "email" }, ... }

// Client receives only "Internal Server Error" (expose: false by default for 5xx)
throw new InternalServerErrorException({
  message: "Database connection lost at 192.168.1.5:5432",
});
// → { message: "Internal Server Error", details: undefined, ... }

// Force-expose a 5xx (use with care)
throw new ServiceUnavailableException({
  message: "Back online at 03:00 UTC.",
  expose: true,
});
// → { message: "Back online at 03:00 UTC.", ... }
```

---

## Error Response Shape

Every error response follows this structure:

```typescript
{
  status: number       // HTTP status code
  error: string        // Standard HTTP error name
  message: string      // Human-readable description (gated by expose)
  code?: string        // Machine-readable code (gated by expose)
  details?: unknown    // Structured payload (gated by expose)
  path: string         // Request path
  timestamp: string    // ISO 8601 timestamp
}
```

---

## Testing

`serializeException` is a pure function — no server required.

```typescript
import { serializeException, NotFoundException } from "http-fault";

it("returns 404 with message and code", () => {
  const err = new NotFoundException({
    message: "Post not found.",
    code: "POST_NOT_FOUND",
  });

  const result = serializeException(err, "/posts/99");

  expect(result).toMatchObject({
    status: 404,
    error: "Not Found",
    message: "Post not found.",
    code: "POST_NOT_FOUND",
    path: "/posts/99",
  });
});

it("hides details when forceHideDetails is true", () => {
  const err = new NotFoundException({ message: "Hidden." });
  const result = serializeException(err, "/", true);

  expect(result.message).toBe("Not Found"); // message hidden
  expect(result.details).toBeUndefined();
});

it("maps unknown errors to 500", () => {
  const result = serializeException(new Error("boom"), "/");
  expect(result.status).toBe(500);
});
```

---

## License

MIT
