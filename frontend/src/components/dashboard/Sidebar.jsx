import {
  LayoutDashboard,
  Boxes,
  Users,
  ShieldCheck,
  LogOut,
} from "lucide-react";

function Sidebar({
  role,
  activeSection,
  setActiveSection,
  currentUser,
  onLogout,
}) {
  const navigation = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      roles: ["admin", "manager", "user"],
    },
    {
      label: "Models",
      icon: Boxes,
      roles: ["admin", "manager", "user"],
    },
    {
      label: "Users",
      icon: Users,
      roles: ["admin"],
    },
    {
      label: "Permissions",
      icon: ShieldCheck,
      roles: ["admin", "manager"],
    },
  ];

  const normalizedRole = role?.toLowerCase();

  const visibleNavigation = navigation.filter((item) =>
    item.roles.includes(normalizedRole)
  );

  return (
    <aside className="relative flex w-full flex-col bg-gradient-to-b from-[#1a1d33] via-[#171a2e] to-[#141728] text-white shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)] lg:fixed lg:inset-y-0 lg:w-64">
      {/* Subtle top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_70%)]" />

      {/* Brand */}
      <div className="relative flex h-[72px] items-center gap-3 border-b border-white/[0.08] px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-xs font-semibold text-[#171a2e] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.5)] ring-1 ring-white/20">
          MV
        </div>

        <div>
          <p className="text-base font-semibold tracking-tight text-white">
            ModelVault
          </p>
          <p className="mt-0.5 text-[11px] tracking-wide text-indigo-200/60">
            Access management
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex gap-1 overflow-x-auto p-4 lg:flex-col">
        <p className="mb-1 hidden px-3 text-[10px] font-semibold uppercase tracking-widest text-indigo-200/40 lg:block">
          Workspace
        </p>

        {visibleNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveSection(item.label)}
              className={`group relative flex shrink-0 items-center gap-3 rounded-xl py-2.5 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#171a2e] ${
                isActive
                  ? "bg-white pl-5 pr-3 font-medium text-[#171a2e] shadow-[0_4px_14px_-4px_rgba(0,0,0,0.5)]"
                  : "px-3 text-indigo-100/60 hover:bg-white/[0.07] hover:text-white active:scale-[0.98]"
              }`}
            >
              {/* Refined active indicator (inside the pill) */}
              {isActive && (
                <span className="absolute left-2 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
              )}

              <span
                className={`flex h-5 w-5 items-center justify-center transition-transform duration-200 ${
                  isActive ? "" : "group-hover:scale-110"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
              </span>

              {item.label}

              {item.label === "Permissions" && (
                <span
                  className={`ml-auto hidden items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide lg:inline-flex ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "bg-white/[0.08] text-indigo-200/70"
                  }`}
                >
                  <span
                    className={`h-1 w-1 rounded-full ${
                      isActive ? "bg-indigo-600" : "bg-indigo-300"
                    }`}
                  />
                  RBAC
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar footer */}
      <div className="relative mt-auto border-t border-white/[0.08] p-4">
        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="mb-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-indigo-100/70 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 active:scale-[0.98]"
        >
          <LogOut size={18} strokeWidth={1.8} />
          Logout
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-3 transition-colors duration-200 hover:bg-white/[0.06]">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#171a2e] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]">
            {currentUser?.userName?.charAt(0).toUpperCase() || "U"}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#171a2e] bg-emerald-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {currentUser?.userName || "Loading..."}
            </p>

            <p className="mt-0.5 text-xs capitalize text-indigo-200/60">
              {currentUser?.role || "Loading..."}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;