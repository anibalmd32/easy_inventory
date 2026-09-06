import { dtoValidator } from "../../../../libs/dtoValidator";
import type {
  ProductData,
  ProductPageData,
} from "../../../domain/data/ProductData";
import { INVENTORY_ERROR_MESSAGES } from "../../../domain/enums/inventoryErrorMessages";
import { InventoryError } from "../../../domain/errors/InventoryError";
import {
  ProductDto,
  type ProductFilters,
  type ProductInput,
} from "../../dtos/ProductDtos";
import type {
  ProductOptionRecord,
  ProductRepository,
  ProductSaleRecord,
} from "../../repositories/ProductRepository";

/**
 * Los productos del negocio: registrarlos, listarlos, corregirlos y sacarlos
 * del inventario.
 *
 * El repositorio ya traduce los conflictos de unicidad a `InventoryError`, así
 * que aquí solo queda validar la forma de los datos antes de escribir.
 */
export class InventoryService {
  constructor(private products: ProductRepository) {}

  listProducts(filters: ProductFilters): Promise<ProductPageData> {
    return this.products.findPage(filters);
  }

  /** Los nombres que se marcan al armar el catálogo. */
  listCatalogOptions(
    filters: Pick<ProductFilters, "search" | "categoryId" | "onlyLow">,
  ): Promise<ProductOptionRecord[]> {
    return this.products.findOptions(filters);
  }

  /**
   * Lo que el cajero puede añadir al carrito, buscando por nombre o por
   * código. Vive aquí y no en el punto de venta para no repartir el SQL de los
   * productos entre dos módulos.
   */
  searchForSale(search: string, limit: number): Promise<ProductSaleRecord[]> {
    return this.products.findForSale(search, limit);
  }

  /** El producto de un código de barras recién escaneado, o `null`. */
  findByCode(code: string): Promise<ProductSaleRecord | null> {
    return this.products.findBySku(code);
  }

  /** Los productos elegidos, ya con su foto, listos para el PDF. */
  async listForCatalog(ids: number[]): Promise<ProductData[]> {
    const products = await this.products.findByIds(ids);

    if (products.length === 0) {
      throw new InventoryError(INVENTORY_ERROR_MESSAGES.empty_catalog);
    }

    return products;
  }

  countLowStock(): Promise<number> {
    return this.products.countLowStock();
  }

  async createProduct(data: ProductInput): Promise<void> {
    await this.products.create(this.validProduct(data));
  }

  async updateProduct(id: number, data: ProductInput): Promise<void> {
    await this.products.update(id, this.validProduct(data));
  }

  deleteProduct(id: number): Promise<void> {
    return this.products.softDelete(id);
  }

  private validProduct(data: ProductInput) {
    const { validData } = dtoValidator(ProductDto, data);

    if (!validData) {
      throw new InventoryError(INVENTORY_ERROR_MESSAGES.invalid_form);
    }

    return validData;
  }
}
