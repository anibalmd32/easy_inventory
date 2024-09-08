'use client'
import { Cart, CartItem, Customer } from '@/definitions';
import { useState, createContext, Dispatch, SetStateAction } from 'react';
import SelectProductOperations from '@/operations/SelectProductOperations';
import { useTransitionRouter } from 'next-view-transitions'

interface BillingCtx {
  products: CartItem[];
  selectedProduct: CartItem | null;
  selectProductOperations: SelectProductOperations;
  setCustomer: Dispatch<SetStateAction<Customer>>;
  customer: Customer;
  cart: Cart;
}

interface ProviderProps {
  children: React.ReactNode;
  initialProducts: CartItem[]
}

const cartDefaultValue: Cart = {
  items: [],
  total: 0,
  customerName: ''
};

const customerDefaultValue: Customer = {
  id: 0,
  dni: '',
  name: '',
  phone: ''
}

export const BillingContext = createContext<BillingCtx>({} as BillingCtx);

export function BillingProvider({ children, initialProducts }: ProviderProps) {
  const [products, setProducts] = useState<CartItem[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<CartItem | null>(null);
  const [cart, setCart] = useState<Cart>(cartDefaultValue);
  const [customer, setCustomer] = useState<Customer>(customerDefaultValue);

  const router = useTransitionRouter()

  const selectProductOperations = new SelectProductOperations({
    products,
    selectedProduct,
    setSelectedProduct,
    setCart,
    cart,
    customer,
    router,
  });

  return (
    <BillingContext.Provider value={{
      products,
      selectedProduct,
      selectProductOperations,
      cart,
      setCustomer,
      customer,
    }}>
      {children}
    </BillingContext.Provider>
  );
}
