import type { RegisterUserInput } from "../../inputs/RegisterUserInput";
import type { BaseUseCase } from "../BaseUseCase";

export interface RegisterUserUseCase extends BaseUseCase<RegisterUserInput> {
  hashPassword: (password: string) => Promise<string>;
  save: () => Promise<void>;
}
