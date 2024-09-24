import { CartItem, Cart, Customer } from '@/definitions';
import { Dispatch, SetStateAction } from 'react';
import { generateInvoice } from '@/actions/invoices/InvoicesServer';

interface SelectProductOperationsDeps {
  products: CartItem[];
  selectedProduct: CartItem | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<CartItem | null>>;
  cart: Cart;
  setCart: Dispatch<SetStateAction<Cart>>;
  customer: Customer;
  router: any;
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
        const totalProduct = product!.amount * Number(product!.price);
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

  onSelectProductCounterIncrement = (productId?: number) => {
    if (productId) {
      this.deps.setCart((prev) => {
        const product = prev.items.find((item) => item.id === productId);
        const newTotal = prev.total + Number(product!.price);
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
      });
    } else {
      if (this.deps.selectedProduct) {
        this.deps.setSelectedProduct({
          ...this.deps.selectedProduct,
          amount: this.deps.selectedProduct.amount + 1,
        });
      }
    }
  };

  onSelectProductCounterDecrement = (productId?: number) => {
    if (productId) {
      this.deps.setCart((prev) => {
        const product = prev.items.find((item) => item.id === productId);
        const newTotal = prev.total - Number(product!.price);
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
      });
    } else {
      if (this.deps.selectedProduct) {
        this.deps.setSelectedProduct({
          ...this.deps.selectedProduct,
          amount: this.deps.selectedProduct.amount - 1,
        });
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
    const newInvoice = await generateInvoice(
      this.deps.cart,
      this.deps.customer
    );
    this.deps.router.push(`/billing/${newInvoice.id}`);
  };
}
