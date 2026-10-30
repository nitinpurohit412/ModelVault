function UsersTable({
  users,
  usersLoading,
  usersError,
  setSelectedUserForRole,
  setSelectedRole,
  setShowRoleModal,
  setSelectedUserForDelete,
  setShowDeleteUserModal,
}) {
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-12px_rgba(0,0,0,0.12)] ring-1 ring-neutral-900/[0.06]">
      {/* Section heading */}
      <div className="border-b border-neutral-100 px-6 py-5 sm:px-7">
        <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900">
          Users
        </h3>
        <p className="mt-1 text-xs text-neutral-500">
          Manage users and view their roles.
        </p>
      </div>

      {/* Users table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-neutral-100 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
              <th className="px-6 py-3.5 font-medium">User</th>
              <th className="px-6 py-3.5 font-medium">Email</th>
              <th className="px-6 py-3.5 font-medium">Role</th>
              <th className="px-6 py-3.5 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100">
            {usersLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-16 text-center text-sm text-neutral-500"
                >
                  Loading users...
                </td>
              </tr>
            ) : usersError ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-16 text-center text-sm font-medium text-red-600"
                >
                  {usersError}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <p className="text-sm font-medium text-neutral-900">
                    No users found.
                  </p>
                  <p className="mt-1.5 text-sm text-neutral-500">
                    Users added to your workspace will appear here.
                  </p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="transition-colors hover:bg-neutral-50/70"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white">
                        {user.userName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span className="text-sm font-medium text-neutral-900">
                        {user.userName}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium capitalize text-neutral-700 ring-1 ring-inset ring-neutral-500/15">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUserForRole(user);
                          setSelectedRole(user.role);
                          setShowRoleModal(true);
                        }}
                        className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-black active:scale-[0.98]"
                      >
                        Edit Role
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUserForDelete(user);
                          setShowDeleteUserModal(true);
                        }}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 ring-1 ring-inset ring-red-600/10 transition hover:bg-red-100 active:scale-[0.98]"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default UsersTable;