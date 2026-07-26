import { type SyntheticEvent, useEffect, useRef, useState } from "react";

/**
 * Estado de un dropdown de daisyUI montado sobre `<details>`.
 *
 * Se prefiere a la variante por foco (`dropdown-hover` / `tabIndex`) porque en
 * pantallas táctiles no hay hover y el cierre por `blur` se dispara antes de
 * que el enlace llegue a recibir el toque.
 *
 * El `<details>` conserva su toggle nativo y aquí solo se refleja su estado.
 * Así el `<summary>` sigue siendo el control accesible de siempre y de paso
 * podemos cerrar el menú cuando el usuario elige una opción.
 */
export const useDetailsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!detailsRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [
    isOpen,
  ]);

  return {
    isOpen,
    detailsRef,
    close: () => setIsOpen(false),
    /** Va en el `onToggle` del `<details>`. */
    syncOpenState: (event: SyntheticEvent<HTMLDetailsElement>) =>
      setIsOpen(event.currentTarget.open),
  };
};
