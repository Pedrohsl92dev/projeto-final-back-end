import Exception from './exception';

export default class UnauthorizedException extends Exception {
  // #pegabandeira
  constructor(message: string, status: number = 500) {
    super(message, status);
  }
}
