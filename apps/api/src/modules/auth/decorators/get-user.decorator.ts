import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    
    // If you passed a specific field name (like 'sub'), return just that field
    if (data) {
      return request.user?.[data];
    }
    
    // Otherwise return the whole user object
    return request.user;
  },
);
