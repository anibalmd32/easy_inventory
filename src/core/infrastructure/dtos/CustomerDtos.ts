import * as v from "valibot";
import {
  CustomerNameSchema,
  OptionalCustomerNotesSchema,
  OptionalCustomerPhoneSchema,
  OptionalDocumentSchema,
} from "../schemas/CustomerSchemas";

/**
 * Un cliente tal como sale del formulario: todo son cadenas porque es lo que
 * entregan los `<input>`. El esquema es el que las normaliza a `null`.
 *
 * Solo el nombre es obligatorio. Pedirle la cédula a cada persona que compra
 * una harina sería insoportable, y el punto de venta ni siquiera exige
 * cliente salvo cuando la venta es fiada.
 */
export const CustomerDto = v.object({
  name: CustomerNameSchema,
  document: OptionalDocumentSchema,
  phone: OptionalCustomerPhoneSchema,
  notes: OptionalCustomerNotesSchema,
});

export type CustomerInput = v.InferInput<typeof CustomerDto>;
export type CustomerOutput = v.InferOutput<typeof CustomerDto>;

/** Filtros del buscador de clientes. Se resuelve en SQL, como el de productos. */
export type CustomerFilters = {
  /** Busca en el nombre, en el documento y en el teléfono. */
  search: string;
  page: number;
  pageSize: number;
};
