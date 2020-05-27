import { Component, Inject } from '@angular/core';
import { StaticProvider, Injector, createInjector , InjectionToken, InjectFlags } from './di';
import { ParentService, ParentDepService } from './services/index';


@Component({
  selector: 'app-my-injector',
  template: `<h2>My Injector in Angular</h2>`,
})
export class MyInjectorComponent {
  constructor() {

    this.injectFlagTest();
  }

  public getTest() {
    const providers: StaticProvider[] = [
      { provide: ParentDepService, useClass: ParentDepService, deps: [] },
    ];
    const injector = createInjector(providers);

    const parentService1 = injector.get<ParentDepService>(ParentDepService);
    const parentService2 = injector.get<ParentDepService>(ParentDepService);

    console.log(parentService1 === parentService2);

  }

  public injectFlagTest() {

    const bothToken       = new InjectionToken<string>('BothToken');
    const parentToken     = new InjectionToken<string>('ParentToken');
    const childToken      = new InjectionToken<string>('ChildToken');
    const inexistentToken = new InjectionToken<string>('InExistentToken');

    const parentProviders = [
      { provide: bothToken,   useValue: 'ParentBothValue...' },
      { provide: parentToken, useValue: 'ParentValue...' }
    ];
    // const parentInjector = createInjector({
    //   providers: parentProviders,
    //   parent: null
    // });

    // 不传递parent，默认为NULL_INJECTOR
    const parentInjector = createInjector(parentProviders);

    const childProviders = [
      { provide: bothToken, useValue: 'ChildBothValue...'},
      { provide: childToken, useValue: 'ChildValue...' },
    ];
    const childInjector = createInjector({
      providers: childProviders,
      parent: parentInjector
    });

    // // Self
    // const parentValue = childInjector.get<string>(parentToken, undefined, InjectFlags.Default);
    // console.log(parentValue);

    // // SkipSelf
    // const parentBothValue = childInjector.get<string>(bothToken, null, InjectFlags.SkipSelf);
    // console.log(parentBothValue);

    // Optional
    const inexistentValue = childInjector.get<string>(inexistentToken, null, InjectFlags.Optional);
    console.log(inexistentValue);

  }


  public createInjectorTest() {
    const parentProviders: StaticProvider[] = [
      { provide: ParentDepService, useClass: ParentDepService, deps: [] },
      { provide: ParentService, useClass: ParentService, deps: [ ParentDepService ]},
      { provide: 'ParentMultiToken', useValue: 'ParentMultiValue-1', multi: true },
      { provide: 'ParentMultiToken', useValue: 'ParentMultiToken-2', multi: true }
    ];
    const parentInjector = createInjector({
      providers: parentProviders,
      parent: null
    });

    const parentMultiValue = parentInjector.get('ParentMultiToken');
    const parentService = parentInjector.get(ParentService);

  }

  public injectionTokenTest() {
    const stringToken = new InjectionToken<string>('StringToken Desc');
    const factoryToken = new InjectionToken<string>('FactoryToken Desc', {
      providedIn: 'any',
      factory: () => {
        return 'FactoryValue';
      }
    });
    const providers: StaticProvider[] = [
      { provide: stringToken, useValue: 'StringValue' },
    ];
    const injector = createInjector(providers);

    // const stringValue = injector.get<string>(stringToken);
    // console.log(stringValue);

    const factoryValue = injector.get<string>(factoryToken);
    console.log(factoryValue);

  }
  
  
  
  
}
