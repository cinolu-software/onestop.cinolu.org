import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { APP_CONFIG } from './config.constants';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  #initialConfig = inject(APP_CONFIG);
  #config = new BehaviorSubject(this.#initialConfig);

  set config(value: unknown) {
    const currentConfig = this.#config.getValue();
    const newConfig = this.deepMerge({}, currentConfig, value);
    this.#config.next(newConfig);
  }

  get config$(): Observable<unknown> {
    return this.#config.asObservable();
  }

  reset(): void {
    this.#config.next(this.#initialConfig);
  }

  private deepMerge(target: any, ...sources: any[]): any {
    if (!sources.length) return target;
    const source = sources.shift();
    if (this.#isObject(target) && this.#isObject(source)) {
      for (const key in source) {
        if (this.#isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, { [key]: {} });
          }
          this.deepMerge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    return this.deepMerge(target, ...sources);
  }

  #isObject(item: unknown) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
}
