import { useTranslation } from "react-i18next";
import {
  MdDeleteOutline,
  MdEdit,
  MdOutlineInventory2,
  MdWarningAmber,
} from "react-icons/md";
import { formatQuantity } from "../../../../utils/formatQuantity";
import type { ProductData } from "../../../domain/data/ProductData";
import { PriceDisplay } from "../PriceDisplay";

interface ProductListItemProps {
  product: ProductData;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (product: ProductData) => void;
  onDelete: (product: ProductData) => void;
}

/**
 * Una fila del inventario: foto, qué es, a cuánto se vende y cuánto queda.
 *
 * Lo que primero busca quien atiende el mostrador es la existencia, así que va
 * a la derecha, destacada, y se pone en amarillo cuando se está acabando.
 */
export const ProductListItem = ({
  product,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: ProductListItemProps) => {
  const { t, i18n } = useTranslation();

  return (
    <li className="list-row items-center">
      {product.photo ? (
        <img
          alt={product.name}
          className="h-12 w-12 shrink-0 rounded-box bg-base-100 object-cover"
          src={product.photo}
        />
      ) : (
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-box bg-base-100">
          <MdOutlineInventory2 className="opacity-40" size={22} />
        </div>
      )}

      <div className="list-col-grow min-w-0">
        <p className="truncate font-medium">{product.name}</p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {product.category_name ? (
            <span className="badge badge-ghost badge-sm">
              {product.category_name}
            </span>
          ) : null}
          {product.sku ? (
            <span className="truncate font-mono text-xs opacity-50">
              {product.sku}
            </span>
          ) : null}
        </div>

        <PriceDisplay amountUsd={product.sale_price} size="sm" />
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={
            product.is_low
              ? "badge badge-warning badge-sm gap-1 whitespace-nowrap"
              : "badge badge-ghost badge-sm whitespace-nowrap"
          }
          title={
            product.is_low ? t("pages.inventory.list.lowStock") : undefined
          }
        >
          {product.is_low ? <MdWarningAmber size={14} /> : null}
          {formatQuantity(product.quantity, i18n.language)}{" "}
          {product.unit_abbreviation}
        </span>

        {canEdit || canDelete ? (
          <div className="flex gap-1">
            {canEdit ? (
              <button
                aria-label={t("buttons.edit.label")}
                className="btn btn-ghost btn-sm btn-square"
                onClick={() => onEdit(product)}
                type="button"
              >
                <MdEdit size={18} />
              </button>
            ) : null}
            {canDelete ? (
              <button
                aria-label={t("buttons.delete.label")}
                className="btn btn-ghost btn-sm btn-square text-error"
                onClick={() => onDelete(product)}
                type="button"
              >
                <MdDeleteOutline size={18} />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
};
