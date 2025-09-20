import { dtoValidator } from "../../../../libs/dtoValidator";
import {
  RegisterUserDto,
  type RegisterUserInput,
} from "../../dtos/RegisterUserDto";
import type { UserRepository } from "../../repositories/UserRepository";
import type { ErrorHandlerService } from "../sharedServices/ErrorHandlerService";

export class SignInService {
  constructor(
    // private passwordService: PasswordService,
    private errorService: ErrorHandlerService<RegisterUserInput>,
    private repository: UserRepository,
  ) {}

  async execute(data: RegisterUserInput): Promise<void> {
    const { validData, error } = dtoValidator(RegisterUserDto, data);

    if (error) {
      this.errorService.handleValiError(error);
    }

    if (validData) {
      await this.repository.storeUser({
        ...validData,
        password: data.password,
      });
    }

    return;
  }
}
