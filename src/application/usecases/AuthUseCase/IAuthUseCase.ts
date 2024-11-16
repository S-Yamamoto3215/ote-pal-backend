export interface IAuthUseCase {
  login(email: string, password: string): Promise<string>;
}
