import { HttpStatus } from '@nestjs/common';

export interface PrismaErrorDetail {
  status: HttpStatus;
  message: (meta: any) => string;
}

export const PrismaErrorRegistry: Record<string, PrismaErrorDetail> = {
  P2002: {
    status: HttpStatus.CONFLICT,
    message: (meta) => {
      const target = (meta?.target as string[])?.join(', ') || 'field';
      return `Duplicate entry: The ${target} is already in use.`;
    },
  },
  P2025: {
    status: HttpStatus.NOT_FOUND,
    message: (meta) => (meta?.cause as string) || 'Record not found.',
  },
  P2003: {
    status: HttpStatus.BAD_REQUEST,
    message: () => 'Foreign key constraint failed. Related record not found.',
  },
  P2000: {
    status: HttpStatus.BAD_REQUEST,
    message: () => 'The provided value for the column is too long for the column\'s type.',
  },
  P2014: {
    status: HttpStatus.CONFLICT,
    message: () => 'The change you are trying to make would violate a required relation.',
  },
};
