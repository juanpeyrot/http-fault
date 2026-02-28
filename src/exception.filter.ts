import type { IncomingMessage, ServerResponse } from "node:http";
import { HttpException } from "./http.exception";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExceptionResponse {
  status: number;
  error: string;
  message: string;
  code?: string;
  details?: unknown;
  path: string;
  timestamp: string;
}

export interface ExceptionFilterOptions {
  /**
   * Called for every error that reaches the filter.
   * Use this to plug in your logger (pino, winston, console, …).
   * Defaults to `console.error` for 5xx errors.
   */
  onError?: (err: unknown, response: ExceptionResponse) => void;
  /**
   * Override how the path is extracted from the request.
   * Defaults to `req.url ?? '/'`.
   */
  resolvePath?: (req: IncomingMessage) => string;
  /**
   * When `true`, internal error messages are always hidden regardless of
   * the `expose` flag. Useful to force production-safe behaviour in tests.
   */
  forceHideDetails?: boolean;
}

// ---------------------------------------------------------------------------
// Core serializer
// ---------------------------------------------------------------------------

export function serializeException(
  err: unknown,
  path: string,
  forceHideDetails = false,
): ExceptionResponse {
  const timestamp = new Date().toISOString();

  if (err instanceof HttpException) {
    const expose = err.expose && !forceHideDetails;
    return {
      status: err.status,
      error: err.error,
      message: expose ? err.message : err.error,
      code: err.code,
      details: expose ? err.details : undefined,
      path,
      timestamp,
    };
  }

  // Unknown / raw Error → 500
  const isDev = !forceHideDetails && process.env.NODE_ENV !== "production";
  const message =
    isDev && err instanceof Error
      ? err.message
      : "An unexpected error occurred";

  return {
    status: 500,
    error: "Internal Server Error",
    message,
    path,
    timestamp,
  };
}

// ---------------------------------------------------------------------------
// Framework-agnostic handler
// ---------------------------------------------------------------------------

/**
 * Handles any thrown value and writes a structured JSON error response.
 *
 * Works with raw Node.js `http.ServerResponse` — and therefore with any
 * framework that sits on top of it (Express, Fastify, Koa, Hono, …).
 *
 * @example
 * // Raw Node.js
 * http.createServer((req, res) => {
 *   try { ... }
 *   catch (err) { ExceptionFilter(err, req, res) }
 * })
 *
 * @example
 * // Express (register last)
 * app.use((err, req, res, _next) => ExceptionFilter(err, req, res))
 *
 * @example
 * // Fastify (register as setErrorHandler)
 * fastify.setErrorHandler((err, req, reply) =>
 *   ExceptionFilter(err, req.raw, reply.raw)
 * )
 */
export function ExceptionFilter(
  err: unknown,
  req: IncomingMessage,
  res: ServerResponse,
  options: ExceptionFilterOptions = {},
): void {
  const {
    onError,
    resolvePath = (r) => r.url ?? "/",
    forceHideDetails = false,
  } = options;

  const path = resolvePath(req);
  const body = serializeException(err, path, forceHideDetails);
  const json = JSON.stringify(body);

  // Logging
  if (body.status >= 500) {
    const logger = onError ?? defaultLogger;
    logger(err, body);
  } else if (onError) {
    onError(err, body);
  }

  // Write response only if headers haven't been sent yet
  if (!res.headersSent) {
    res.writeHead(body.status, {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(json),
    });
    res.end(json);
  }
}

// ---------------------------------------------------------------------------
// Default logger
// ---------------------------------------------------------------------------

function defaultLogger(err: unknown, response: ExceptionResponse): void {
  console.error("[ExceptionFilter]", {
    ...response,
    stack: err instanceof Error ? err.stack : undefined,
    cause:
      err instanceof HttpException && err.cause ? err.cause.stack : undefined,
  });
}

// ---------------------------------------------------------------------------
// Factory — useful when you want a pre-configured handler
// ---------------------------------------------------------------------------

/**
 * Creates a pre-configured exception handler.
 *
 * @example
 * const ExceptionFilter = createExceptionFilter({
 *   onError: (err, res) => logger.error({ err, res }, 'Unhandled error'),
 * })
 */
export function createExceptionFilter(options: ExceptionFilterOptions = {}) {
  return (err: unknown, req: IncomingMessage, res: ServerResponse): void =>
    ExceptionFilter(err, req, res, options);
}
