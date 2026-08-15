import { BadRequestException } from '@nestjs/common';

export function parseJson<T>(
  value: string | undefined,
  field: string,
): T | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    throw new BadRequestException(`Invalid ${field} format.`);
  }
}
