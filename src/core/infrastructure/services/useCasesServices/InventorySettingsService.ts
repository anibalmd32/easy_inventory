import { dtoValidator } from "../../../../libs/dtoValidator";
import type { InventorySettingData } from "../../../domain/data/InventorySettingData";
import type { MeasurementUnitData } from "../../../domain/data/MeasurementUnitData";
import type { ProductCategoryData } from "../../../domain/data/ProductCategoryData";
import { CATALOG_ERROR_MESSAGES } from "../../../domain/enums/catalogErrorMessages";
import { CatalogError } from "../../../domain/errors/CatalogError";
import {
  LowQuantityDto,
  type LowQuantityInput,
  MeasurementUnitDto,
  type MeasurementUnitInput,
  ProductCategoryDto,
  type ProductCategoryInput,
} from "../../dtos/InventorySettingsDtos";
import type { InventorySettingRepository } from "../../repositories/InventorySettingRepository";
import type { MeasurementUnitRepository } from "../../repositories/MeasurementUnitRepository";
import type { ProductCategoryRepository } from "../../repositories/ProductCategoryRepository";
import type { ProductRepository } from "../../repositories/ProductRepository";

/**
 * Configuración del módulo de inventario: categorías, unidades de medida y el
 * umbral a partir del cual un producto se considera "por acabarse".
 *
 * Los repositorios ya traducen los conflictos de unicidad a `CatalogError`, así
 * que aquí solo queda validar la forma de los datos antes de escribir.
 */
export class InventorySettingsService {
  constructor(
    private categories: ProductCategoryRepository,
    private units: MeasurementUnitRepository,
    private settings: InventorySettingRepository,
    private products: ProductRepository,
  ) {}

  // --- Categorías ---------------------------------------------------------

  listCategories(): Promise<ProductCategoryData[]> {
    return this.categories.findAll();
  }

  async createCategory(data: ProductCategoryInput): Promise<void> {
    await this.categories.create(this.validCategory(data));
  }

  async updateCategory(id: number, data: ProductCategoryInput): Promise<void> {
    await this.categories.update(id, this.validCategory(data));
  }

  /**
   * Borrar una categoría no borra sus productos: los deja sin agrupar. Si se
   * quedaran apuntando a la categoría borrada, el filtro ya no podría
   * encontrarlos y desaparecerían del listado sin explicación.
   */
  async deleteCategory(id: number): Promise<void> {
    await this.categories.softDelete(id);
    await this.products.clearCategory(id);
  }

  // --- Unidades de medida -------------------------------------------------

  listUnits(): Promise<MeasurementUnitData[]> {
    return this.units.findAll();
  }

  async createUnit(data: MeasurementUnitInput): Promise<void> {
    await this.units.create(this.validUnit(data));
  }

  async updateUnit(id: number, data: MeasurementUnitInput): Promise<void> {
    await this.units.update(id, this.validUnit(data));
  }

  /**
   * Una unidad en uso no se borra. A diferencia de la categoría, la unidad no
   * se puede dejar vacía: "3" sin unidad no significa nada, así que primero
   * hay que cambiarle la unidad a esos productos.
   */
  async deleteUnit(id: number): Promise<void> {
    if (await this.products.isUnitInUse(id)) {
      throw new CatalogError(CATALOG_ERROR_MESSAGES.unit_in_use);
    }

    await this.units.softDelete(id);
  }

  // --- Aviso de poca cantidad ---------------------------------------------

  getSettings(): Promise<InventorySettingData> {
    return this.settings.find();
  }

  async updateLowQuantity(data: LowQuantityInput): Promise<void> {
    const { validData } = dtoValidator(LowQuantityDto, data);

    if (!validData) {
      throw new CatalogError(CATALOG_ERROR_MESSAGES.invalid_form);
    }

    await this.settings.updateLowQuantityThreshold(
      validData.low_quantity_threshold,
    );
  }

  // --- Validación ---------------------------------------------------------

  private validCategory(data: ProductCategoryInput) {
    const { validData } = dtoValidator(ProductCategoryDto, data);

    if (!validData) {
      throw new CatalogError(CATALOG_ERROR_MESSAGES.invalid_form);
    }

    return validData;
  }

  private validUnit(data: MeasurementUnitInput) {
    const { validData } = dtoValidator(MeasurementUnitDto, data);

    if (!validData) {
      throw new CatalogError(CATALOG_ERROR_MESSAGES.invalid_form);
    }

    return validData;
  }
}
