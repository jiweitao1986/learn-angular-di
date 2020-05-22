import { Injectable } from '@angular/core';
import { ParentDepService } from './parent-dep.service';

@Injectable()
class ParentService {

  public name: string;

  constructor(public depService: ParentDepService) {
    this.name = 'Parent';
  }

  public intro() {
    console.log(`I am ${this.name}.`);
  }
}

export { ParentService };
