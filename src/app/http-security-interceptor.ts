import { Location } from '@angular/common';
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpSecurityInterceptor implements HttpInterceptor {

    constructor(private injector: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return Observable.fromPromise(this.handleAccess(request, next));
    }

    private async handleAccess(request: HttpRequest<any>, next: HttpHandler):
        Promise<HttpEvent<any>> {
        let changedRequest = request;
        // HttpHeader object immutable - copy values
        const headerSettings: { [name: string]: string | string[]; } = {};

        for (const key of request.headers.keys()) {
            headerSettings[key] = request.headers.getAll(key);
        }
        // const auth = this.injector.get(Service1Service);
        const authToken = localStorage.getItem('token');


        if (authToken) {
            headerSettings['Authorization'] = 'Bearer ' + authToken;
        }
        headerSettings['Content-Type'] = 'application/json';
        const newHeader = new HttpHeaders(headerSettings);

        changedRequest = request.clone({
            headers: newHeader
        });
        return next.handle(changedRequest).toPromise();
    }

}

// export class HttpSecurityInterceptor {
// }
