import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { HttpMockRequestInterceptor } from './http-mock-request.interceptor';
import { HttpMock } from './model/http-mock.model';

export const HTTP_MOCK_CONFIG = new InjectionToken<HttpMock[]>(
  'HTTP_MOCK_CONFIG'
);

@NgModule({})
export class HttpMockModule {
  constructor(@Optional() @SkipSelf() module?: HttpMockModule) {
    if (module) {
      throw new Error(
        'HttpMockModule is already loaded. It should only be imported once'
      );
    }
  }
  static forRoot(config: HttpMock[]): ModuleWithProviders<HttpMockModule> {
    return {
      ngModule: HttpMockModule,
      providers: [
        {
          provide: HTTP_MOCK_CONFIG,
          useValue: config,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpMockRequestInterceptor,
          multi: true,
        },
      ],
    };
  }
}
