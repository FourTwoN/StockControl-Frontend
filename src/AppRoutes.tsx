import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { useFeatureFlag } from '@core/hooks'

const InventarioRoutes = lazy(() => import('@modules/inventario/routes'))
const ProductosRoutes = lazy(() => import('@modules/productos/routes'))
const VentasRoutes = lazy(() => import('@modules/ventas/routes'))
const CostosRoutes = lazy(() => import('@modules/costos/routes'))
const UsuariosRoutes = lazy(() => import('@modules/usuarios/routes'))
const UbicacionesRoutes = lazy(() => import('@modules/ubicaciones/routes'))
const EmpaquetadoRoutes = lazy(() => import('@modules/empaquetado/routes'))
const PreciosRoutes = lazy(() => import('@modules/precios/routes'))
const AnalyticsRoutes = lazy(() => import('@modules/analytics/routes'))
const FotosRoutes = lazy(() => import('@modules/fotos/routes'))
const ChatbotRoutes = lazy(() => import('@modules/chatbot/routes'))

export function AppRoutes() {
  const fotosEnabled = useFeatureFlag('fotos')
  const chatbotEnabled = useFeatureFlag('chatbot')

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inventario" replace />} />

      {/* Core modules */}
      <Route path="/inventario/*" element={<InventarioRoutes />} />
      <Route path="/productos/*" element={<ProductosRoutes />} />
      <Route path="/ventas/*" element={<VentasRoutes />} />
      <Route path="/costos/*" element={<CostosRoutes />} />
      <Route path="/usuarios/*" element={<UsuariosRoutes />} />
      <Route path="/ubicaciones/*" element={<UbicacionesRoutes />} />
      <Route path="/empaquetado/*" element={<EmpaquetadoRoutes />} />
      <Route path="/precios/*" element={<PreciosRoutes />} />
      <Route path="/analytics/*" element={<AnalyticsRoutes />} />

      {/* DLC modules - conditional */}
      {fotosEnabled && <Route path="/fotos/*" element={<FotosRoutes />} />}
      {chatbotEnabled && <Route path="/chatbot/*" element={<ChatbotRoutes />} />}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/inventario" replace />} />
    </Routes>
  )
}
