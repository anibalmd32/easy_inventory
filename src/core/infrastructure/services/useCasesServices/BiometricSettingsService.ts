import type { UserRepository } from "../../repositories/UserRepository";

/**
 * Preferencia de desbloqueo biométrico de cada usuario.
 *
 * Solo persiste la decisión: comprobar la huella es cosa de
 * `BiometricService`. Quien active la opción debe haber superado antes esa
 * comprobación, para no dejar guardada una preferencia que el dispositivo no
 * puede cumplir.
 */
export class BiometricSettingsService {
  constructor(private repository: UserRepository) {}

  async setEnabled(userId: number, enabled: boolean): Promise<void> {
    await this.repository.setBiometricEnabled(userId, enabled);
  }

  /** El usuario dijo que no: no se vuelve a preguntar por su cuenta. */
  async dismissPrompt(userId: number): Promise<void> {
    await this.repository.markBiometricPrompted(userId);
  }
}
