import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChartTwoComponent } from './chart-two/chart-two.component';
import { HttpSecurityInterceptor } from './http-security-interceptor';
import { AxisTest01Component } from './axis-test-01/axis-test-01.component';



@NgModule({
  declarations: [
    ChartTwoComponent,
    AxisTest01Component
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpSecurityInterceptor,
    multi: true
  }],
  bootstrap: [AxisTest01Component]
})
export class AppModule { }
