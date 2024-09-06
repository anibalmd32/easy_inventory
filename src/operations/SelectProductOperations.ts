import { CartItem, Cart, Customer } from "@/definitions";
import { Dispatch, SetStateAction } from "react";

interface SelectProductOperationsDeps {
  products: CartItem[];
  selectedProduct: CartItem | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<CartItem | null>>;
  cart: Cart;
  setCart: Dispatch<SetStateAction<Cart>>;
  customer: Customer;
}

export default class SelectProductOperations {
  private products: CartItem[];
  private selectedProduct: CartItem | null;
  private setSelectedProduct: React.Dispatch<React.SetStateAction<CartItem | null>>;
  private cart: Cart;
  private setCart: Dispatch<SetStateAction<Cart>>;
  private customer: Customer;

  constructor(deps: SelectProductOperationsDeps) {
    this.products = deps.products;
    this.selectedProduct = deps.selectedProduct;
    this.setSelectedProduct = deps.setSelectedProduct;
    this.cart = deps.cart;
    this.setCart = deps.setCart;
    this.customer = deps.customer;
  }

  onSelectProduct = (productId: number) => {
    const product = this.products.find((product) => product.id === productId);

    if (!product) {
      return;
    }

    this.setSelectedProduct(product);
  }

  onUnselectProduct = (productId?: number) => {
    if (productId) {
      this.setCart(prev => {
        const product = prev.items.find(item => item.id === productId)
        const totalProduct = product!.amount * Number(product!.price)
        const newTotal = prev.total - totalProduct
        const updatedItems = prev.items.filter(item => item.id !== productId);

        return {
          ...prev,
          total: newTotal,
          items: updatedItems
        };
      });
    } else {
      this.setSelectedProduct(null);
    }
  }

  onSelectProductCounterIncrement = (productId?: number) => {
    if (productId) {
      this.setCart(prev => {
        const product = prev.items.find(item => item.id === productId)
        const newTotal = prev.total + Number(product!.price)
        const updatedItems = prev.items.map(item => {
          if (item.id === productId) {
            return {
              ...item,
              amount: item.amount + 1
            };
          }
          return item;
        });

        return {
          ...prev,
          total: newTotal,
          items: updatedItems
        };
      });
    } else {
      if (this.selectedProduct) {
        this.setSelectedProduct({
          ...this.selectedProduct,
          amount: this.selectedProduct.amount + 1,
        })
      }
    }
  }

  onSelectProductCounterDecrement = (productId?: number) => {
    if (productId) {
      this.setCart(prev => {
        const product = prev.items.find(item => item.id === productId)
        const newTotal = prev.total - Number(product!.price)
        const updatedItems = prev.items.map(item => {
          if (item.id === productId) {
            return {
              ...item,
              amount: item.amount - 1
            };
          }
          return item;
        });

        return {
          ...prev,
          total: newTotal,
          items: updatedItems
        };
      });
    } else {
      if (this.selectedProduct) {
        this.setSelectedProduct({
          ...this.selectedProduct,
          amount: this.selectedProduct.amount - 1,
        })
      }
    }
  }

  onAddProductToCart = () => {
    const product = this.selectedProduct;
    const customerName = this.customer.name;

    if (product) {
      const totalPerProduct = Number(product.amount) * Number(product.price)
      this.setCart({
        items: [...this.cart.items, product],
        total: Number(this.cart.total) + Number(totalPerProduct),
        customerName,
      })

      this.setSelectedProduct(null);
    }
  }

  onGenerateInvoice = async () => {
    this.cart.customerName = this.customer.name
    console.log(this.cart)
    console.log(this.customer)
  }
}
