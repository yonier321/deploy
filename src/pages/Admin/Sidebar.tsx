import { useState } from 'react';
import logoFna from '@/imports/logo-fna.png';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
  onExit: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

/* ─── ICONS ─── */
const Icon = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  students: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>,
  clipboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>,
  academic: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
  instructors: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>,
  payments: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>,
  location: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
  workshop: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
  room: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>,
  exit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>,
  collapse: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" /></svg>,
};

interface NavNode {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: { id: string; label: string }[];
}

const navTree: NavNode[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Icon.dashboard },
  { id: 'gestion', label: 'Gestión Académica', icon: Icon.academic, children: [{ id: 'instructores', label: 'Instructores' }, { id: 'niveles', label: 'Niveles' }, { id: 'grupos', label: 'Grupos' }, { id: 'sedes', label: 'Sedes' }] },
  { id: 'oferta', label: 'Oferta', icon: Icon.workshop, children: [{ id: 'estilos', label: 'Estilos' }, { id: 'talleres', label: 'Talleres' }] },
  { id: 'aulas-agendamiento', label: 'Aulas y Agendamiento', icon: Icon.room, children: [{ id: 'adm-aulas', label: 'Aulas' }, { id: 'adm-agendamientos-instructores', label: 'Agendamiento de Instructores' }] },
  { id: 'matricula', label: 'Matrícula', icon: Icon.students, children: [{ id: 'estudiantes', label: 'Estudiantes' }, { id: 'adm-matriculas', label: 'Matrículas' }, { id: 'adm-inscripciones-taller', label: 'Inscripciones a talleres' }] },
  { id: 'mensualidades-pagos', label: 'Mensualidades y Pagos', icon: Icon.payments, children: [{ id: 'adm-mensualidades', label: 'Mensualidades' }, { id: 'adm-pagos', label: 'Pagos' }, { id: 'adm-metodos-pago', label: 'Métodos de pago' }] },
  { id: 'convocatorias', label: 'Convocatorias', icon: Icon.clipboard, children: [{ id: 'adm-convocatorias', label: 'Convocatorias' }, { id: 'adm-postulaciones', label: 'Postulaciones' }] },
  { id: 'contenido', label: 'Gestión de Contenido', icon: Icon.workshop, children: [{ id: 'adm-contenidos', label: 'Contenido' }] },
  {
    id: 'seguridad',
    label: 'Usuarios y Seguridad',
    icon: Icon.shield,
    children: [
      { id: 'seg-personas', label: 'Personas' },
      { id: 'seg-acudientes', label: 'Acudientes' },
      { id: 'seg-usuarios', label: 'Usuarios' },
      { id: 'seg-roles-permisos', label: 'Roles y Permisos' },
      { id: 'seg-estados', label: 'Estados' },
    ],
  },
];

export default function Sidebar({ activeModule, onModuleChange, onExit, collapsed, onToggleCollapse }: SidebarProps) {
  const [expanded, setExpanded] = useState<string[]>(['gestion']);

  const toggleExpand = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleParentClick = (node: NavNode) => {
    if (node.children) {
      toggleExpand(node.id);
      if (!expanded.includes(node.id)) {
        onModuleChange(node.children[0].id);
      }
    } else {
      onModuleChange(node.id);
    }
  };

  const isNodeActive = (node: NavNode) =>
    activeModule === node.id || (node.children?.some(c => c.id === activeModule) ?? false);

  return (
    <aside
      className={[
        'flex flex-col h-full border-r border-border bg-surface transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      ].join(' ')}
    >
      {/* Logo */}
      <div className={['flex items-center h-16 border-b border-border px-4 gap-3 flex-shrink-0', collapsed ? 'justify-center' : ''].join(' ')}>
        <img src={logoFna} alt="F&A" className="h-8 w-auto object-contain flex-shrink-0" />
        {!collapsed && (
          <div>
            <div className="font-display text-sm text-text leading-none">F&A</div>
            <div className="font-condensed text-[10px] uppercase tracking-widest text-text-muted leading-none mt-0.5">Admin</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-0.5">
        {navTree.map(node => {
          const active = isNodeActive(node);
          const open = expanded.includes(node.id);

          return (
            <div key={node.id}>
              <button
                onClick={() => handleParentClick(node)}
                title={collapsed ? node.label : undefined}
                className={[
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer group',
                  active
                    ? 'bg-purple-700/90 text-white'
                    : 'text-text-soft hover:bg-purple-400/8 hover:text-text',
                ].join(' ')}
              >
                <span className={active ? 'text-white' : 'text-text-muted group-hover:text-purple-400 transition-colors'}>{node.icon}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1 font-condensed font-600 text-sm uppercase tracking-wider truncate">{node.label}</span>
                    {node.children && (
                      <span className={['transition-transform duration-200', open ? 'rotate-90' : ''].join(' ')}>
                        {Icon.chevron}
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Children */}
              {!collapsed && node.children && open && (
                <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3 py-1">
                  {node.children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => onModuleChange(child.id)}
                      className={[
                        'w-full text-left px-3 py-2 rounded-lg font-condensed font-600 text-sm uppercase tracking-wider transition-all duration-150 cursor-pointer',
                        activeModule === child.id
                          ? 'bg-purple-400/15 text-purple-400'
                          : 'text-text-muted hover:text-text hover:bg-purple-400/8',
                      ].join(' ')}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-2 flex flex-col gap-1 flex-shrink-0">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-text hover:bg-purple-400/8 transition-all cursor-pointer"
          title={collapsed ? 'Expandir' : 'Colapsar'}
        >
          <span className={['transition-transform duration-300', collapsed ? 'rotate-180' : ''].join(' ')}>
            {Icon.collapse}
          </span>
          {!collapsed && <span className="font-condensed font-600 text-sm uppercase tracking-wider">Colapsar</span>}
        </button>
        <button
          onClick={onExit}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-400/8 transition-all cursor-pointer"
          title="Salir del panel"
        >
          {Icon.exit}
          {!collapsed && <span className="font-condensed font-600 text-sm uppercase tracking-wider">Salir</span>}
        </button>
      </div>
    </aside>
  );
}
