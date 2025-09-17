import type { LoginUserInput } from "../../inputs/LoginUserInput";
import type { BaseUseCase } from "../BaseUseCase";

export interface LoginUseCase
  extends BaseUseCase<
    LoginUserInput & {
      token?: string;
    }
  > {
  authenticate: (email: string, password: string) => Promise<string>;
}
