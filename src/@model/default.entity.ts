import { classToPlain } from 'class-transformer';

export class DefaultEntity {
  toJSON() {
    return classToPlain(this);
  }
}
