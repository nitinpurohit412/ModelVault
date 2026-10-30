
function Header({ searchQuery, setSearchQuery, currentUser, activeSection }) {
  return (
    <header className="flex min-h-[72px] flex-wrap items-center justify-between gap-4 border-b border-neutral-200/80 bg-white px-5 py-4 sm:px-8">
      <div>
        <p className="text-xs text-neutral-500">
          Workspace <span className="mx-1 text-neutral-300">/</span>{" "}
          <span className="text-neutral-700">{activeSection}</span>
        </p>

        <h1 className="mt-1 text-lg font-semibold tracking-tight text-neutral-900">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <label className="hidden md:block">
          <span className="sr-only">Search workspace</span>

          <input
            type="search"
            placeholder="Search workspace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-900/[0.06] lg:w-64"
          />
        </label>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white shadow-sm ring-1 ring-neutral-900/10">
          {currentUser?.userName?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}

export default Header;
