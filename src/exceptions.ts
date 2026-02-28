// ***************************************************************************************
// * http-fault: A library for creating and handling HTTP exceptions in TypeScript *
// ***************************************************************************************

import { HttpException } from "./http.exception";

// ***************************************************************************************
// CLIENT EXCEPTIONS (4xx)
// ***************************************************************************************

type ClientExceptionOptions = {
  message?: string;
  code?: string;
  details?: unknown;
  expose?: boolean;
  cause?: Error;
};

// 400
export class BadRequestException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(400, "Bad Request", options);
  }
}

// 401
export class UnauthorizedException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(401, "Unauthorized", options);
  }
}

// 402
export class PaymentRequiredException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(402, "Payment Required", options);
  }
}

// 403
export class ForbiddenException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(403, "Forbidden", options);
  }
}

// 404
export class NotFoundException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(404, "Not Found", options);
  }
}

// 405
export class MethodNotAllowedException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(405, "Method Not Allowed", options);
  }
}

// 406
export class NotAcceptableException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(406, "Not Acceptable", options);
  }
}

// 407
export class ProxyAuthenticationRequiredException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(407, "Proxy Authentication Required", options);
  }
}

// 408
export class RequestTimeoutException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(408, "Request Timeout", options);
  }
}

// 409
export class ConflictException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(409, "Conflict", options);
  }
}

// 410
export class GoneException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(410, "Gone", options);
  }
}

// 411
export class LengthRequiredException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(411, "Length Required", options);
  }
}

// 412
export class PreconditionFailedException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(412, "Precondition Failed", options);
  }
}

// 413
export class ContentTooLargeException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(413, "Content Too Large", options);
  }
}

// 414
export class URITooLongException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(414, "URI Too Long", options);
  }
}

// 415
export class UnsupportedMediaTypeException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(415, "Unsupported Media Type", options);
  }
}

// 416
export class RangeNotSatisfiableException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(416, "Range Not Satisfiable", options);
  }
}

// 417
export class ExpectationFailedException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(417, "Expectation Failed", options);
  }
}

// 418
export class ImATeapotException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(418, "I'm a Teapot", options);
  }
}

// 421
export class MisdirectedRequestException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(421, "Misdirected Request", options);
  }
}

// 422
export class UnprocessableEntityException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(422, "Unprocessable Entity", options);
  }
}

// 423
export class LockedException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(423, "Locked", options);
  }
}

// 424
export class FailedDependencyException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(424, "Failed Dependency", options);
  }
}

// 425
export class TooEarlyException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(425, "Too Early", options);
  }
}

// 426
export class UpgradeRequiredException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(426, "Upgrade Required", options);
  }
}

// 428
export class PreconditionRequiredException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(428, "Precondition Required", options);
  }
}

// 429
export class TooManyRequestsException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(429, "Too Many Requests", options);
  }
}

// 431
export class RequestHeaderFieldsTooLargeException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(431, "Request Header Fields Too Large", options);
  }
}

// 451
export class UnavailableForLegalReasonsException extends HttpException {
  constructor(options?: ClientExceptionOptions) {
    super(451, "Unavailable For Legal Reasons", options);
  }
}

// ***************************************************************************************
// SERVER EXCEPTIONS (5xx)
// ***************************************************************************************

type ServerExceptionOptions = {
  message?: string;
  code?: string;
  details?: unknown;
  expose?: boolean;
  cause?: Error;
};

// 500
export class InternalServerErrorException extends HttpException {
  constructor(options?: ServerExceptionOptions) {
    super(500, "Internal Server Error", options);
  }
}

// 501
export class NotImplementedException extends HttpException {
  constructor(options?: ServerExceptionOptions) {
    super(501, "Not Implemented", options);
  }
}

// 502
export class BadGatewayException extends HttpException {
  constructor(options?: ServerExceptionOptions) {
    super(502, "Bad Gateway", options);
  }
}

// 503
export class ServiceUnavailableException extends HttpException {
  constructor(options?: ServerExceptionOptions) {
    super(503, "Service Unavailable", options);
  }
}

// 504
export class GatewayTimeoutException extends HttpException {
  constructor(options?: ServerExceptionOptions) {
    super(504, "Gateway Timeout", options);
  }
}

// 505
export class HTTPVersionNotSupportedException extends HttpException {
  constructor(options?: ServerExceptionOptions) {
    super(505, "HTTP Version Not Supported", options);
  }
}

// 506
export class VariantAlsoNegotiatesException extends HttpException {
  constructor(options?: ServerExceptionOptions) {
    super(506, "Variant Also Negotiates", options);
  }
}

// 507
export class InsufficientStorageException extends HttpException {
  constructor(options?: ServerExceptionOptions) {
    super(507, "Insufficient Storage", options);
  }
}

// 508
export class LoopDetectedException extends HttpException {
  constructor(options?: ServerExceptionOptions) {
    super(508, "Loop Detected", options);
  }
}

// 510
export class NotExtendedException extends HttpException {
  constructor(options?: ServerExceptionOptions) {
    super(510, "Not Extended", options);
  }
}

// 511
export class NetworkAuthenticationRequiredException extends HttpException {
  constructor(options?: ServerExceptionOptions) {
    super(511, "Network Authentication Required", options);
  }
}
