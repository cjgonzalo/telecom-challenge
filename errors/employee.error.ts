export class EmployeeError implements Error {
  private _message: string
  private _code: number
 
  constructor(code: number, message: string) {
    this._code = code;
    this._message = message
  }

  public get message(): string {
    return this._message
  }

  public get name(): string {
    return "EmployeeError"
  }

  public get code(): number {
    return this._code;
  }
}