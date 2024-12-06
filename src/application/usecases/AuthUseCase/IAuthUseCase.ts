export interface IAuthUseCase {
  login(email: string, plainPassword: string): Promise<string>;
}
