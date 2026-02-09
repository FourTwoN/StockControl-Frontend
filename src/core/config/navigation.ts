import {
  Package,
  ShoppingCart,
  BarChart3,
  MapPin,
  DollarSign,
  Box,
  Tag,
  Users,
  Camera,
  MessageSquare,
} from 'lucide-react'
import { createElement } from 'react'
import type { NavItem } from '@core/layout'

export const coreNavItems: readonly NavItem[] = [
  { label: 'Inventario', path: '/inventario', icon: createElement(Package, { size: 20 }) },
  { label: 'Productos', path: '/productos', icon: createElement(ShoppingCart, { size: 20 }) },
  { label: 'Ventas', path: '/ventas', icon: createElement(DollarSign, { size: 20 }) },
  { label: 'Costos', path: '/costos', icon: createElement(BarChart3, { size: 20 }) },
  { label: 'Ubicaciones', path: '/ubicaciones', icon: createElement(MapPin, { size: 20 }) },
  { label: 'Empaquetado', path: '/empaquetado', icon: createElement(Box, { size: 20 }) },
  { label: 'Precios', path: '/precios', icon: createElement(Tag, { size: 20 }) },
  { label: 'Usuarios', path: '/usuarios', icon: createElement(Users, { size: 20 }) },
  { label: 'Analytics', path: '/analytics', icon: createElement(BarChart3, { size: 20 }) },
] as const

export const dlcNavItems: Record<string, NavItem> = {
  fotos: { label: 'Fotos', path: '/fotos', icon: createElement(Camera, { size: 20 }) },
  chatbot: { label: 'Chatbot', path: '/chatbot', icon: createElement(MessageSquare, { size: 20 }) },
}

export function getNavItems(enabledModules: readonly string[]): readonly NavItem[] {
  const dlcItems = enabledModules
    .filter((m) => m in dlcNavItems)
    .map((m) => dlcNavItems[m])
  return [...coreNavItems, ...dlcItems]
}
