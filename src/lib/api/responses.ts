import { NextResponse } from 'next/server';

export type ApiErrorResponse = { error: string };
export type ApiSuccessResponse = { success: true };

export function ok<T extends Record<string, unknown>>(body: T, init?: ResponseInit) {
  return NextResponse.json(body, init);
}

export function success(init?: ResponseInit) {
  return ok<ApiSuccessResponse>({ success: true }, init);
}

export function apiError(error: string, status = 500) {
  return NextResponse.json<ApiErrorResponse>({ error }, { status });
}

export function badRequest(error: string) {
  return apiError(error, 400);
}

export function unauthorized(error = 'Unauthorized') {
  return apiError(error, 401);
}

export function notFound(error = 'Not found') {
  return apiError(error, 404);
}

export function rateLimited(error = 'Too many requests. Please try again later.') {
  return apiError(error, 429);
}

export function serverError(error = 'Something went wrong. Please try again.') {
  return apiError(error, 500);
}
