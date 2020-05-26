import { Injectable } from '@angular/core';
import { ChildDepService } from './child-dep.service';

@Injectable()
class ChildService {

  public name: string;

  constructor(public depService: ChildDepService) {
    this.name = 'Child';
  }

  public intro() {
    console.log(`I am ${this.name}.`);
  }
}

export { ChildService };
