function AccessOverview({
  role,
  usersLoading,
  usersError,
  adminCount,
  managerCount,
  regularUserCount,
  adminPercentage,
  managerPercentage,
  regularUserPercentage,
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-12px_rgba(0,0,0,0.12)] ring-1 ring-neutral-900/[0.06] sm:p-7">
      <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900">
        Access overview
      </h3>

      <p className="mt-1 text-xs text-neutral-500">
        Distribution by account role
      </p>

      {role !== "admin" ? (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm font-medium text-neutral-900">
            Admin access required
          </p>

          <p className="mt-2 text-xs leading-5 text-neutral-500">
            Role distribution is visible only to administrators.
          </p>
        </div>
      ) : usersLoading ? (
        <p className="mt-6 text-sm text-neutral-500">
          Loading role statistics...
        </p>
      ) : usersError ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">
          {usersError}
        </p>
      ) : (
        <div className="mt-6 space-y-5">
          {/* Administrators */}
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-neutral-600">
                <span className="h-2 w-2 rounded-full bg-neutral-900" />
                Administrators
              </span>
              <span className="text-sm font-semibold tabular-nums text-neutral-900">
                {adminCount}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-neutral-900 transition-all duration-500"
                style={{ width: `${adminPercentage}%` }}
              />
            </div>
          </div>

          {/* Managers */}
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-neutral-600">
                <span className="h-2 w-2 rounded-full bg-neutral-500" />
                Managers
              </span>
              <span className="text-sm font-semibold tabular-nums text-neutral-900">
                {managerCount}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-neutral-500 transition-all duration-500"
                style={{ width: `${managerPercentage}%` }}
              />
            </div>
          </div>

          {/* Regular Users */}
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-neutral-600">
                <span className="h-2 w-2 rounded-full bg-neutral-300" />
                Regular users
              </span>
              <span className="text-sm font-semibold tabular-nums text-neutral-900">
                {regularUserCount}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-neutral-300 transition-all duration-500"
                style={{ width: `${regularUserPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-7 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <p className="text-sm font-medium text-neutral-900">
          Role-based access control
        </p>

        <p className="mt-2 text-xs leading-5 text-neutral-500">
          Manage user roles and individual model permissions from the workspace
          navigation.
        </p>
      </div>
    </div>
  );
}

export default AccessOverview;