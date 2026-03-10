import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import img1 from "../../assets/product-pack-1.jpg";
import img3 from "../../assets/product-pack-3.jpg";
import img10 from "../../assets/product-pack-10.jpg";

export interface Product {
  id: string;
  name: string;
  format: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  badge?: string;
  image?: string;
}

export const PRODUCTS: Omit<Product, "quantity">[] = [
  {
    id: "1-unit",
    name: "Sumo Reishi Original",
    format: "1 ud · 60 cápsulas",
    price: 32,
    badge: undefined,
    image: img1,
  },
  {
    id: "3-pack",
    name: "Nuestra opción más elegida",
    format: "3 unidades · 180 cápsulas",
    price: 82,
    originalPrice: 96,
    badge: "Más elegido",
    image: img3,
  },
  {
    id: "10-pack",
    name: "Combo Vita",
    format: "10 + 1 unidades",
    price: 272,
    originalPrice: 352,
    badge: "Mejor precio",
    image: img10,
  },
];

interface CartContextType {
  items: Product[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Omit<Product, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((product: Omit<Product, "quantity">) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    }
  }, []);

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const count = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isOpen, openCart, closeCart, addItem, removeItem, updateQty, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}