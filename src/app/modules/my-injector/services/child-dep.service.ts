import { Injectable } from '@angular/core';

@Injectable()
class ChildDepService {

  public name: string;

  constructor() {
    this.name = 'ChildDep';
  }

  public intro() {
    console.log(`I am ${this.name}.`);
  }
}

export { ChildDepService };
