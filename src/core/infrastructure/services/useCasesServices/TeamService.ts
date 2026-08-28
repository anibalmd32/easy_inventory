import { dtoValidator } from "../../../../libs/dtoValidator";
import type { RoleData } from "../../../domain/data/RoleData";
import type { TeamMemberData } from "../../../domain/data/TeamMemberData";
import { ROLES } from "../../../domain/enums/roles";
import { TEAM_ERROR_MESSAGES } from "../../../domain/enums/teamErrorMessages";
import { TeamError } from "../../../domain/errors/TeamError";
import {
  ChangeRoleDto,
  type ChangeRoleInput,
  CreateTeamUserDto,
  type CreateTeamUserInput,
} from "../../dtos/TeamDtos";
import type { RoleRepository } from "../../repositories/RoleRepository";
import type { UserRepository } from "../../repositories/UserRepository";

/**
 * Gestión del equipo: quién entra a la app y con qué rol.
 *
 * Las reglas que protege son tres, y todas evitan que el dueño se quede
 * fuera de su propio negocio:
 *   1. Solo existe un superadmin y no se toca (ni se borra, ni cambia de rol).
 *   2. Nadie puede borrarse ni cambiarse el rol a sí mismo.
 *   3. No se puede crear otro superadmin desde aquí.
 */
export class TeamService {
  constructor(
    private users: UserRepository,
    private roles: RoleRepository,
  ) {}

  listRoles(): Promise<RoleData[]> {
    return this.roles.findAllWithPermissions();
  }

  listMembers(): Promise<TeamMemberData[]> {
    return this.users.findTeamMembers();
  }

  async createMember(
    data: CreateTeamUserInput,
    language?: string,
  ): Promise<void> {
    const { validData } = dtoValidator(CreateTeamUserDto, data);

    if (!validData) {
      throw new TeamError(TEAM_ERROR_MESSAGES.invalid_form);
    }

    if (await this.users.existsEmail(validData.email)) {
      throw new TeamError(TEAM_ERROR_MESSAGES.email_already_taken);
    }

    await this.users.storeUser({
      name: validData.name,
      last_name: validData.last_name,
      email: validData.email,
      password: validData.password,
      role: validData.role,
      security_question_id: validData.security_question_id,
      security_answer: validData.security_answer,
      language,
    });
  }

  async changeRole(
    targetUserId: number,
    currentUserId: number,
    data: ChangeRoleInput,
  ): Promise<void> {
    const { validData } = dtoValidator(ChangeRoleDto, data);

    if (!validData) {
      throw new TeamError(TEAM_ERROR_MESSAGES.invalid_form);
    }

    await this.assertModifiable(targetUserId, currentUserId);

    const roleId = await this.roles.findIdByName(validData.role);

    if (roleId === null) {
      throw new TeamError(TEAM_ERROR_MESSAGES.role_not_found);
    }

    await this.users.updateUserRole(targetUserId, roleId);
  }

  async removeMember(
    targetUserId: number,
    currentUserId: number,
  ): Promise<void> {
    await this.assertModifiable(targetUserId, currentUserId);
    await this.users.softDeleteUser(targetUserId);
  }

  /**
   * Se comprueba contra la base de datos y no contra lo que diga la pantalla:
   * el rol de la sesión podría estar desactualizado, y estas dos reglas son
   * justo las que impiden dejar el negocio sin dueño.
   */
  private async assertModifiable(
    targetUserId: number,
    currentUserId: number,
  ): Promise<void> {
    if (targetUserId === currentUserId) {
      throw new TeamError(TEAM_ERROR_MESSAGES.cannot_modify_self);
    }

    const roleName = await this.users.findRoleNameByUserId(targetUserId);

    if (roleName === ROLES.SUPERADMIN) {
      throw new TeamError(TEAM_ERROR_MESSAGES.cannot_modify_superadmin);
    }
  }
}
