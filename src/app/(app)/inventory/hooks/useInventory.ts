import { useContext } from "react";
import { InventoryContext } from "../InventoryProvider";

export const useInventory = () => useContext(InventoryContext);
