export enum HttpStatus {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  TooManyRequests = 429,
  ServerError = 500,
}

export enum HttpMethod {
  Connect = 'CONNECT',
  Delete = 'DELETE',
  Get = 'GET',
  Head = 'HEAD',
  Options = 'OPTIONS',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
  Trace = 'TRACE',
}

export const ok = (body?: object, init?: ResponseInit) =>
  Response.json(body, { ...init, status: HttpStatus.Ok });

export const created = (body?: object, init?: ResponseInit) =>
  Response.json(body, { ...init, status: HttpStatus.Created });

export const noContent = (body?: object, init?: ResponseInit) =>
  Response.json(body, { ...init, status: HttpStatus.NoContent });

export const badRequest = (body?: object, init?: ResponseInit) =>
  Response.json(body, { ...init, status: HttpStatus.BadRequest });

export const unauthorized = (body?: object, init?: ResponseInit) =>
  Response.json(body, { ...init, status: HttpStatus.Unauthorized });

export const forbidden = (body?: object, init?: ResponseInit) =>
  Response.json(body, { ...init, status: HttpStatus.Forbidden });

export const notFound = (body?: object, init?: ResponseInit) =>
  Response.json(body, { ...init, status: HttpStatus.NotFound });

export const conflict = (body?: object, init?: ResponseInit) =>
  Response.json(body, { ...init, status: HttpStatus.Conflict });

export const serverError = (body?: object, init?: ResponseInit) =>
  Response.json(body, { ...init, status: HttpStatus.ServerError });
