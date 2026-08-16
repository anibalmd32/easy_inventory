import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdAdd,
  MdChevronLeft,
  MdChevronRight,
  MdDeleteOutline,
  MdEdit,
} from "react-icons/md";
import { useErrorMessage } from "../hooks/useErrorMessage";
import { ConfirmDialog } from "./ConfirmDialog";
import { FormDialog } from "./FormDialog";

export interface CatalogEntry {
  id: number;
  name: string;
}

interface CatalogSectionProps<T extends CatalogEntry> {
  title: string;
  description: string;
  addLabel: string;
  emptyTitle: string;
  emptyBody: string;
  createTitle: string;
  editTitle: string;
  deleteTitle: string;
  /** Recibe el nombre para que el aviso diga qué se va a borrar. */
  deleteDescription: (name: string) => string;
  items: T[] | undefined;
  isLoading: boolean;
  /** Contenido secundario de cada fila (abreviatura, descripción…). */
  renderMeta?: (item: T) => ReactNode;
  onDelete: (id: number) => Promise<void>;
  /** Query a invalidar cuando algo cambia. */
  listKey: readonly unknown[];
  renderForm: (args: { item: T | null; onDone: () => void }) => ReactNode;
}

/** Filas visibles por página. Cabe en pantalla de móvil sin desplazar. */
const PAGE_SIZE = 5;

type DialogState<T> =
  | {
      mode: "closed";
    }
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      item: T;
    };

/**
 * Lista editable de un catálogo de configuración.
 *
 * Categorías y unidades de medida se comportan igual (listar, crear, editar,
 * borrar con confirmación); lo único que cambia son sus campos, que entran por
 * `renderForm`.
 */
export const CatalogSection = <T extends CatalogEntry>({
  title,
  description,
  addLabel,
  emptyTitle,
  emptyBody,
  createTitle,
  editTitle,
  deleteTitle,
  deleteDescription,
  items,
  isLoading,
  renderMeta,
  onDelete,
  listKey,
  renderForm,
}: CatalogSectionProps<T>) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();
  const [dialog, setDialog] = useState<DialogState<T>>({
    mode: "closed",
  });
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [page, setPage] = useState(1);

  const remove = useMutation({
    mutationFn: (id: number) => onDelete(id),
    onSuccess: async () => {
      setPendingDelete(null);
      await queryClient.invalidateQueries({
        queryKey: listKey,
      });
    },
  });

  const closeDialog = () =>
    setDialog({
      mode: "closed",
    });
  const isEmpty = !isLoading && (items?.length ?? 0) === 0;

  const total = items?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // La página se acota al calcular en vez de corregirse con un efecto: al
  // borrar el último elemento de la última página, el número deja de existir
  // y esto lo devuelve solo a la anterior.
  const currentPage = Math.min(page, totalPages);
  const visibleItems = items?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm opacity-70">{description}</p>
          </div>
          {!isEmpty ? (
            <button
              className="btn btn-primary btn-sm shrink-0"
              onClick={() =>
                setDialog({
                  mode: "create",
                })
              }
              type="button"
            >
              <MdAdd size={18} />
              {addLabel}
            </button>
          ) : null}
        </header>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        ) : null}

        {isEmpty ? (
          <div className="flex flex-col items-center gap-3 rounded-box border border-base-300 border-dashed p-6 text-center">
            <p className="font-medium">{emptyTitle}</p>
            <p className="text-sm opacity-70">{emptyBody}</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                setDialog({
                  mode: "create",
                })
              }
              type="button"
            >
              <MdAdd size={18} />
              {addLabel}
            </button>
          </div>
        ) : null}

        {!isLoading && visibleItems && visibleItems.length > 0 ? (
          <ul className="list rounded-box bg-base-200">
            {visibleItems.map((item) => (
              <li className="list-row items-center" key={item.id}>
                {/* `list-col-grow` en el texto: sin esto daisyUI hace crecer al
                    segundo hijo, que son los botones, y quedan pegados al
                    nombre en vez de al borde derecho. */}
                <div className="list-col-grow min-w-0">
                  <p className="truncate font-medium">{item.name}</p>
                  {renderMeta ? renderMeta(item) : null}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    aria-label={t("buttons.edit.label")}
                    className="btn btn-ghost btn-sm btn-square"
                    onClick={() =>
                      setDialog({
                        mode: "edit",
                        item,
                      })
                    }
                    type="button"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button
                    aria-label={t("buttons.delete.label")}
                    className="btn btn-ghost btn-sm btn-square text-error"
                    onClick={() => setPendingDelete(item)}
                    type="button"
                  >
                    <MdDeleteOutline size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {totalPages > 1 ? (
          <nav className="flex items-center justify-between gap-3">
            <p className="text-sm opacity-70">
              {t("common.pagination.range", {
                from: (currentPage - 1) * PAGE_SIZE + 1,
                to: Math.min(currentPage * PAGE_SIZE, total),
                total,
              })}
            </p>
            <div className="join">
              <button
                aria-label={t("common.pagination.previous")}
                className="btn btn-sm join-item"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                type="button"
              >
                <MdChevronLeft size={18} />
              </button>
              <span className="btn btn-sm join-item pointer-events-none">
                {currentPage} / {totalPages}
              </span>
              <button
                aria-label={t("common.pagination.next")}
                className="btn btn-sm join-item"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
                type="button"
              >
                <MdChevronRight size={18} />
              </button>
            </div>
          </nav>
        ) : null}
      </div>

      <FormDialog
        onClose={closeDialog}
        open={dialog.mode !== "closed"}
        title={dialog.mode === "edit" ? editTitle : createTitle}
      >
        {renderForm({
          item: dialog.mode === "edit" ? dialog.item : null,
          onDone: closeDialog,
        })}
      </FormDialog>

      <ConfirmDialog
        confirmLabel={t("buttons.delete.label")}
        description={deleteDescription(pendingDelete?.name ?? "")}
        errorMessage={resolveErrorMessage(remove.error)}
        isPending={remove.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
        open={pendingDelete !== null}
        title={deleteTitle}
      />
    </section>
  );
};
