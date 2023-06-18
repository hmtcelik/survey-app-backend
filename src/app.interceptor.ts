import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  export interface Response<T> {
    success: boolean;
    message: string;
    data: T;
  }
  
  @Injectable()
  export class BaseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(
      context: ExecutionContext,
      next: CallHandler
    ): Observable<Response<T>> {
      return next.handle().pipe(
        map((data) => ({
          success: data?.success || (context.switchToHttp().getResponse().statusCode.toString()[0] == '2' ? true : false ),
          message: data?.message || '',
          data: data?.data || data,
        }))
      );
    }
  }