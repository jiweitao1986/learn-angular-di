import { Injectable } from '@angular/core';

@Injectable()
class ParentDepService {

  public name: string;

  constructor() {
    this.name = 'ParentDep';
  }

  public intro() {
    console.log(`I am ${this.name}.`);
  }
}

export { ParentDepService };
