function ModelTable({
  filteredModels,
  models,
  role,
  setEditModelId,
  setEditModelData,
  setShowEditModelModal,
  handleToggleModelStatus,
  setDeleteModelId,
  setShowDeleteModal,
}) {
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-12px_rgba(0,0,0,0.12)] ring-1 ring-neutral-900/[0.06]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 py-5 sm:px-7">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900">
            Model registry
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            Models registered in your workspace
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">
          <thead>
            <tr className="border-b border-neutral-100 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
              <th className="px-6 py-3.5 font-medium">Model</th>
              <th className="px-6 py-3.5 font-medium">Provider</th>
              <th className="px-6 py-3.5 font-medium">Status</th>
              <th className="px-6 py-3.5 text-right font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100">
            {filteredModels.length > 0 ? (
              filteredModels.map((model) => (
                <tr
                  key={model._id}
                  className="transition-colors hover:bg-neutral-50/70"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {model.name}
                      </p>
                      <p className="mt-1 max-w-xs truncate text-xs text-neutral-500">
                        {model.description}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-neutral-600">
                    <span className="inline-flex items-center rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                      {model.provider}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        model.isActive
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                          : "bg-neutral-100 text-neutral-500 ring-neutral-500/15"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {model.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    {role === "admin" && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditModelId(model._id);

                            setEditModelData({
                              name: model.name || "",
                              provider: model.provider || "",
                              description: model.description || "",
                            });

                            setShowEditModelModal(true);
                          }}
                          className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-200 active:scale-[0.98]"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleModelStatus(model._id)}
                          className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-black active:scale-[0.98]"
                        >
                          {model.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeleteModelId(model._id);
                            setShowDeleteModal(true);
                          }}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 ring-1 ring-inset ring-red-600/10 transition hover:bg-red-100 active:scale-[0.98]"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <p className="text-sm font-medium text-neutral-900">
                    {models.length === 0
                      ? "No models available"
                      : "No matching models found"}
                  </p>

                  <p className="mt-1.5 text-sm text-neutral-500">
                    {models.length === 0
                      ? "Models available to your account will appear here."
                      : "Try a different model name, provider, or description."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ModelTable;