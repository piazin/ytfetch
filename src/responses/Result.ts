import { HttpStatus } from '@nestjs/common';

export class Response<T> {
  constructor(props: { status: HttpStatus; data: T }) {
    Object.assign(this, props);
  }

  status: HttpStatus;
  data: T;
}
