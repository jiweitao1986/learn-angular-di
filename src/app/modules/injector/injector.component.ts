import { Component, Inject, Injector, StaticProvider } from '@angular/core';
import { ChildDepService, ChildService, ParentDepService, ParentService} from './services/index';

@Component({
  selector: 'app-injector',
  template: `<h2>DI in Angular</h2>`,
})
export class InjectorComponent {
  constructor() {

    const parentProviders: StaticProvider[] = [
      { provide: ParentDepService, useClass: ParentDepService, deps: [] },
      { provide: ParentDepService, useClass: ParentService, deps: []},
      { provide: 'PK1', useValue: 'PK1-1', multi: true },
      { provide: 'PK1', useValue: 'PK1-2', multi: true }
    ];

    const parentInjector = Injector.create({
      providers: parentProviders,
      parent: null
    });

    const childProviders: StaticProvider[] = [
      { provide: ChildDepService,  useClass: ChildDepService, deps: [] },
      { provide: ChildService,  useClass: ChildService, deps: [ ChildDepService ]},
      { provide: 'PK1', useValue: 'PK1-11', multi: true },
      { provide: 'PK1', useValue: 'PK1-21', multi: true }
    ];

    const childInjector = Injector.create({
      providers: childProviders,
      parent: null
    });

    // const childService = childInjector.get(ChildService);
    // console.log(childService);
  }
}
