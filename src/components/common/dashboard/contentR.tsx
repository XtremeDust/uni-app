import React, { Suspense } from 'react';

    const HomeModule = React.lazy(() => import('@/app/dashboard/home/page'));
    const NormativasModule = React.lazy(() => import('@/app/dashboard/regulations/page'));
    const InscripcionesModule = React.lazy(() => import('@/app/dashboard/inscription/page'));
    const EventosModule = React.lazy(() => import('@/app/dashboard/gestion/general/page')); 
    const TorneosModule = React.lazy(() => import('@/app/dashboard/gestion/tournaments/page')); 
    const OfertasModule = React.lazy(() => import('@/app/dashboard/offerts/page')); 
    const SportsModule = React.lazy(()=> import('@/app/dashboard/sport/Sports'));
    const ComentariosModule = React.lazy(() => import('@/app/dashboard/coments/page'));

    const VIEW_KEYS = {
    HOME: 1,
    NORMATIVAS: 2,
    INSCRIPCIONES: 3,
    EVENTOS_GENERAL: 4,
    EVENTOS_GESTION: 5,
    OFERTAS: 6,
    COMENTARIOS: 7,
    SPORTS:8,
    };

    const VIEW_COMPONENTS: Record<number, React.FC> = {
    [VIEW_KEYS.HOME]: HomeModule,
    [VIEW_KEYS.NORMATIVAS]: NormativasModule,
    [VIEW_KEYS.INSCRIPCIONES]: InscripcionesModule,
    [VIEW_KEYS.EVENTOS_GENERAL]: EventosModule,
    [VIEW_KEYS.EVENTOS_GESTION]: TorneosModule,
    [VIEW_KEYS.OFERTAS]: OfertasModule,
    [VIEW_KEYS.COMENTARIOS]: ComentariosModule,
    [VIEW_KEYS.SPORTS]:SportsModule,
    };

    interface ContentRendererProps {
        currentKey: number;
    }

export const ContentRenderer: React.FC<ContentRendererProps> = ({ currentKey }) => {


  const CurrentComponent = VIEW_COMPONENTS[currentKey] || HomeModule;
  return (
        <Suspense fallback={<div>Cargando contenido de la sección...</div>}>
            <CurrentComponent />
        </Suspense>
    );
};
export default ContentRenderer;