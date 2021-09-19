import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpMock } from './model/http-mock.model';
import { HTTP_MOCK_CONFIG } from './http-mock-module';

@Injectable()
export class HttpMockRequestInterceptor implements HttpInterceptor {
  private urlHttpMockMap = new Map<string, HttpMock>();
  constructor(
    @Optional() @Inject(HTTP_MOCK_CONFIG) private config: HttpMock[]
  ) {
    (config || []).forEach((httpMock) =>
      this.urlHttpMockMap.set(httpMock.url, httpMock)
    );
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.config) {
      if (this.urlHttpMockMap.has(request.url)) {
        return this.getMockedResponse(this.urlHttpMockMap.get(request.url));
      } else {
        for (const httpMock of this.config || []) {
          const regExp = new RegExp(httpMock.url, 'i');
          if (regExp.exec(request.url)) {
            return this.getMockedResponse(httpMock);
          }
        }
      }
    }
    return next.handle(request);
  }

  private getMockedResponse(
    httpMock: HttpMock
  ): Observable<HttpResponse<unknown>> {
    return of(
      new HttpResponse({
        status: httpMock.status || 200,
        body: httpMock.response,
      })
    );
  }
}
