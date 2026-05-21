import { Injectable } from '@angular/core';
import { Subscription, Subject, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SplashscreenService {
  
  subject = new Subject();

   subscribe(onNext: Partial<Observer<unknown>> | ((value: unknown) => void) | undefined): Subscription {
      return this.subject.subscribe(onNext);
   }

   stop() {
      this.subject.next(false);
   }
}
