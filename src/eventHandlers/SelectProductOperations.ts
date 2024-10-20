import { CartItem, Cart, Customer } from '@/definitions';
import { Dispatch, SetStateAction } from 'react';
import { generateInvoice } from '@/core/frameworks/server-actions/invoice.actions';
import ToastEventHandlers from './ToastEventHandlers';

interface SelectProductOperationsDeps {
  products: CartItem[];
  selectedProduct: CartItem | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<CartItem | null>>;
  cart: Cart;
  setCart: Dispatch<SetStateAction<Cart>>;
  customer: Customer;
  router: any;
  toastEvents: ToastEventHandlers;
}

export default class SelectProductOperations {
  constructor(private readonly deps: SelectProductOperationsDeps) {}

  onSelectProduct = (productId: number) => {
    const product = this.deps.products.find(
      (product) => product.id === productId
    );

    if (!product) {
      return;
    }

    this.deps.setSelectedProduct(product);
  };

  onUnselectProduct = (productId?: number) => {
    if (productId) {
      this.deps.setCart((prev) => {
        const product = prev.items.find((item) => item.id === productId);

        if (!product) return prev;

        const totalProduct = product.amount * Number(product.price);
        const newTotal = prev.total - totalProduct;
        const updatedItems = prev.items.filter((item) => item.id !== productId);

        return {
          ...prev,
          total: newTotal,
          items: updatedItems,
        };
      });
    } else {
      this.deps.setSelectedProduct(null);
    }
  };

  onSelectedProductCounterIncrement = (productId?: number) => {
    if (productId) {
      this.deps.setCart((prev) => {
        const product = prev.items.find((item) => item.id === productId);
  
        // Si no se encuentra el producto, retornar el estado anterior sin cambios
        if (!product) return prev;
  
        const { amount, quantity, price } = product;
  
        // Verificar si el amount es menor que el quantity antes de incrementar
        if (amount < quantity) {
          const newTotal = prev.total + Number(price);
          const updatedItems = prev.items.map((item) => {
            if (item.id === productId) {
              return {
                ...item,
                amount: item.amount + 1,
              };
            }
            return item;
          });
  
          return {
            ...prev,
            total: newTotal,
            items: updatedItems,
          };
        } else {
          // Mostrar alerta si se intenta incrementar más allá de lo disponible
          this.deps.toastEvents.error({
            title: 'Insuficiente',
            description: 'No hay suficiente de este producto en el inventario',
          });
          return prev; // No se realizan cambios si no se puede incrementar
        }
      });
    } else {
      if (this.deps.selectedProduct) {
        const { amount, quantity } = this.deps.selectedProduct;
  
        // Verificar si amount es menor que quantity antes de incrementar
        if (amount < quantity) {
          this.deps.setSelectedProduct({
            ...this.deps.selectedProduct,
            amount: amount + 1,
          });
        } else {
          // Mostrar alerta si se intenta incrementar más allá de lo disponible
          this.deps.toastEvents.error({
            title: 'Insuficiente',
            description: 'No hay suficiente de este producto en el inventario',
          });
        }
      }
    }
  };
  
  onSelectedProductCounterDecrement = (productId?: number) => {
    if (productId) {
      this.deps.setCart((prev) => {
        const product = prev.items.find((item) => item.id === productId);
  
        // Si no se encuentra el producto, retornar el estado anterior sin cambios
        if (!product) return prev;
  
        const { amount, price } = product;
  
        // Verificar si el amount es mayor que 1 antes de decrementar
        if (amount > 1) {
          const newTotal = prev.total - Number(price);
          const updatedItems = prev.items.map((item) => {
            if (item.id === productId) {
              return {
                ...item,
                amount: item.amount - 1,
              };
            }
            return item;
          });
  
          return {
            ...prev,
            total: newTotal,
            items: updatedItems,
          };
        } else {
          // Si amount es 1, eliminar el producto del carrito
          this.onUnselectProduct(productId);
          return {
            ...prev,
            total: prev.total - Number(price),
            items: prev.items.filter((item) => item.id !== productId),
          };
        }
      });
    } else {
      if (this.deps.selectedProduct) {
        const { amount } = this.deps.selectedProduct;
  
        // Verificar si amount es mayor que 1 antes de decrementar
        if (amount > 1) {
          this.deps.setSelectedProduct({
            ...this.deps.selectedProduct,
            amount: amount - 1,
          });
        } else {
          // Quitar el producto seleccionado si se intenta decrementar por debajo de 1
          this.onUnselectProduct();
        }
      }
    }
  };  

  onAddProductToCart = () => {
    const product = this.deps.selectedProduct;
    const customerName = this.deps.customer.name;

    if (product) {
      const totalPerProduct = Number(product.amount) * Number(product.price);
      this.deps.setCart({
        items: [...this.deps.cart.items, product],
        total: Number(this.deps.cart.total) + Number(totalPerProduct),
        customerName,
      });

      this.deps.setSelectedProduct(null);
    }
  };

  onGenerateInvoice = async () => {
    this.deps.cart.customerName = this.deps.customer.name;

    try {
      const newInvoice = await generateInvoice(
        this.deps.cart,
        this.deps.customer
      );
      
      
      this.deps.toastEvents.trigger({
        title: 'Éxito',
        description: 'Factura generada con éxito'
      });

      this.deps.router.push(`/billing/${newInvoice.id}`);
    } catch (error: any) {
      this.deps.toastEvents.trigger({
        title: 'Error',
        description: error.message
      });
    }
  };
}
