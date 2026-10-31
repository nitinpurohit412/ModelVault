function getRelativeTime(date) {
  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) return "—";

  const difference = Math.max(0, Date.now() - timestamp);

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} days ago`;

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PermissionsTable({
  permissions,
  permissionsLoading,
  permissionsError,
  role,
  setRevokeDetails,
  setShowRevokeModal,
  users,
  models,
  selectedUser,
  setSelectedUser,
  selectedModel,
  setSelectedModel,
  handleGrantAccess,
  permissionMessage,
}) {
  const isAdmin = role === "admin";

  return (
    <>
      {/* Grant Model Access - Admin only */}
      {isAdmin && (
        <section className="rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-12px_rgba(0,0,0,0.12)] ring-1 ring-neutral-900/[0.06] sm:p-7">
          <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900">
            Grant model access
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Select a user and a model to grant access.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">
                Select user
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 text-sm text-neutral-900 outline-none transition hover:border-neutral-300 focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-900/[0.06]"
              >
                <option value="">Choose a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.userName} - {user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">
                Select model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 text-sm text-neutral-900 outline-none transition hover:border-neutral-300 focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-900/[0.06]"
              >
                <option value="">Choose a model</option>
                {models.map((model) => (
                  <option key={model._id} value={model._id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGrantAccess}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-neutral-900 px-5 text-sm font-medium text-white transition hover:bg-black active:scale-[0.99]"
          >
            Grant access
          </button>

          {permissionMessage && (
            <p className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-[13px] text-neutral-700">
              {permissionMessage}
            </p>
          )}
        </section>
      )}

      {/* Existing Permissions */}
      <section className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-12px_rgba(0,0,0,0.12)] ring-1 ring-neutral-900/[0.06]">
        <div className="border-b border-neutral-100 px-6 py-5 sm:px-7">
          <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900">
            Existing permissions
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            {isAdmin
              ? "View and manage user access to models."
              : "View user access to models."}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead>
              <tr className="border-b border-neutral-100 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                <th className="px-6 py-3.5 font-medium">User</th>
                <th className="px-6 py-3.5 font-medium">Model</th>
                <th className="px-6 py-3.5 font-medium">Granted on</th>
                {isAdmin && (
                  <th className="px-6 py-3.5 text-right font-medium">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {permissionsLoading ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 4 : 3}
                    className="px-6 py-16 text-center text-sm text-neutral-500"
                  >
                    Loading permissions...
                  </td>
                </tr>
              ) : permissionsError ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 4 : 3}
                    className="px-6 py-16 text-center text-sm font-medium text-red-600"
                  >
                    {permissionsError}
                  </td>
                </tr>
              ) : permissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 4 : 3}
                    className="px-6 py-16 text-center"
                  >
                    <p className="text-sm font-medium text-neutral-900">
                      No permissions have been granted yet.
                    </p>
                    <p className="mt-1.5 text-sm text-neutral-500">
                      {isAdmin
                        ? "Grant access above to see permissions listed here."
                        : "Permissions granted to users will appear here."}
                    </p>
                  </td>
                </tr>
              ) : (
                permissions.map((permission) => (
                  <tr
                    key={permission._id}
                    className="transition-colors hover:bg-neutral-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white">
                          {permission.user?.userName?.charAt(0).toUpperCase() ||
                            "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-neutral-900">
                            {permission.user?.userName || "Unknown User"}
                          </p>
                          <p className="truncate text-xs text-neutral-500">
                            {permission.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-neutral-700">
                      <span className="inline-flex items-center rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                        {permission.model?.name || "Model unavailable"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {getRelativeTime(permission.createdAt)}
                    </td>

                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setRevokeDetails({
                              userId: permission.user?._id,
                              modelId: permission.model?._id,
                              userName: permission.user?.userName,
                              modelName: permission.model?.name,
                            });

                            setShowRevokeModal(true);
                          }}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 ring-1 ring-inset ring-red-600/10 transition hover:bg-red-100 active:scale-[0.98]"
                        >
                          Revoke
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default PermissionsTable;