interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  /** Clase de tamaño de Tailwind para el círculo, p. ej. `w-8`. */
  sizeClassName?: string;
}

/**
 * Avatar del usuario con caída a la inicial de su nombre cuando todavía no
 * ha subido una foto.
 */
export const UserAvatar = ({
  name,
  avatarUrl,
  sizeClassName = "w-8",
}: UserAvatarProps) => {
  if (avatarUrl) {
    return (
      <div className="avatar">
        <div className={`${sizeClassName} rounded-full`}>
          <img alt={name} src={avatarUrl} />
        </div>
      </div>
    );
  }

  return (
    <div className="avatar avatar-placeholder">
      <div
        className={`${sizeClassName} rounded-full bg-neutral text-neutral-content`}
      >
        <span className="text-sm">{name.charAt(0).toUpperCase()}</span>
      </div>
    </div>
  );
};
