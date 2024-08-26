import { InventoryContext } from "./InventoryProvider";
import { useContext } from "react";

const useInventory = () => useContext(InventoryContext);

export default useInventory;
