export abstract class HttpException extends Error {
  readonly status: number;
  readonly error: string;
  readonly code?: string;
  readonly details?: unknown;
  readonly expose: boolean;
  readonly cause?: Error;

  constructor(
    status: number,
    error: string,
    options?: {
      message?: string;
      code?: string;
      details?: unknown;
      expose?: boolean;
      cause?: Error;
    },
  ) {
    super(options?.message || error);

    this.name = this.constructor.name;
    this.status = status;
    this.error = error;
    this.code = options?.code;
    this.details = options?.details;
    this.expose = options?.expose ?? status < 500;
    this.cause = options?.cause;
  }

  toJSON() {
    return {
      status: this.status,
      error: this.error,
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}
