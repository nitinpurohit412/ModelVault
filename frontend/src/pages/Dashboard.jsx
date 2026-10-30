import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import StatCard from "../components/dashboard/StatCard";
import {
  Boxes,
  CheckCircle,
  Users,
  ShieldCheck,
  AlertTriangle,
  X,
} from "lucide-react";
import RecentActivity from "../components/dashboard/RecentActivity";
import AccessOverview from "../components/dashboard/AccessOverview";
import ModelTable from "../components/dashboard/ModelTable";
import UsersTable from "../components/dashboard/UsersTable";
import PermissionsTable from "../components/dashboard/PermissionsTable";
import useDashboard from "../hooks/useDashboard";
import { useEffect } from "react";

function Dashboard() {
  const {
    // Data
    models,
    users,
    permissions,
    currentUser,
    role,
    activities,
    filteredModels,

    // Loading and errors
    loading,
    error,
    usersLoading,
    usersError,
    permissionsLoading,
    permissionsError,

    // Navigation and search
    searchQuery,
    setSearchQuery,
    activeSection,
    setActiveSection,

    // Statistics
    totalModels,
    activeModels,
    registeredUsers,
    totalAccessGrants,
    adminCount,
    managerCount,
    regularUserCount,
    adminPercentage,
    managerPercentage,
    regularUserPercentage,

    // Permission form
    selectedUser,
    setSelectedUser,
    selectedModel,
    setSelectedModel,
    permissionMessage,
    handleGrantAccess,

    // Revoke access
    handleRevokeAccess,
    showRevokeModal,
    setShowRevokeModal,
    revokeDetails,
    setRevokeDetails,

    // Model actions and modals
    handleToggleModelStatus,
    handleDeleteModel,
    deleteModelId,
    setDeleteModelId,
    showDeleteModal,
    setShowDeleteModal,
    handleAddModel,
    showAddModelModal,
    setShowAddModelModal,
    newModelData,
    setNewModelData,
    handleEditModel,
    handleLogout,
    showEditModelModal,
    setShowEditModelModal,
    editModelId,
    setEditModelId,
    editModelData,
    setEditModelData,

    // User actions and modals
    handleUpdateUserRole,
    showRoleModal,
    setShowRoleModal,
    selectedUserForRole,
    setSelectedUserForRole,
    selectedRole,
    setSelectedRole,
    handleDeleteUser,
    showDeleteUserModal,
    setShowDeleteUserModal,
    selectedUserForDelete,
    setSelectedUserForDelete,
  } = useDashboard();

  const sectionPermissions = {
    Overview: ["admin", "manager", "user"],
    Models: ["admin", "manager", "user"],
    Users: ["admin"],
    Permissions: ["admin", "manager"],
  };

  const normalizedRole = role?.toLowerCase();

  const canAccessSection = (section) =>
    sectionPermissions[section]?.includes(normalizedRole) ?? false;

  useEffect(() => {
    if (normalizedRole && !canAccessSection(activeSection)) {
      setActiveSection("Overview");
    }
  }, [normalizedRole, activeSection, setActiveSection]);

  const modalInputClass =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-900/[0.06]";

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-neutral-900 lg:flex">
      <Sidebar
        role={role}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <main className="min-w-0 flex-1 lg:ml-64">
        {/* Top bar */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          activeSection={activeSection}
        />

        {/* Dashboard body */}
        <div className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8">
          {/* Page heading */}
          <section className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                {activeSection}
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Manage your AI models and their access permissions.
              </p>
            </div>

            {role === "admin" &&
              (activeSection === "Overview" || activeSection === "Models") && (
                <button
                  type="button"
                  onClick={() => setShowAddModelModal(true)}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white transition hover:bg-black active:scale-[0.99]"
                >
                  + Add Model
                </button>
              )}
          </section>

          {/* Statistics */}
          {activeSection === "Overview" && (
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total models"
                value={totalModels}
                description="Registered in workspace"
                icon={Boxes}
              />

              <StatCard
                title="Active models"
                value={activeModels}
                description="Currently marked active"
                icon={CheckCircle}
              />

              <StatCard
                title="Registered users"
                value={role === "admin" ? registeredUsers : "—"}
                description={
                  role === "admin" ? "Across all assigned roles" : "Admin only"
                }
                icon={Users}
              />

              <StatCard
                title="Access grants"
                value={totalAccessGrants}
                description={
                  role === "admin"
                    ? "All user-model permissions"
                    : "Your model permissions"
                }
                icon={ShieldCheck}
              />
            </section>
          )}

          {/* Loading and error states */}
          {loading && (
            <p className="text-sm text-neutral-500">Loading models...</p>
          )}

          {!loading && error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && models.length === 0 && (
            <p className="rounded-3xl bg-white p-8 text-sm text-neutral-500 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-12px_rgba(0,0,0,0.12)] ring-1 ring-neutral-900/[0.06]">
              No models found. Models assigned to you will appear here.
            </p>
          )}

          {/* Model registry */}
          {(activeSection === "Overview" || activeSection === "Models") && (
            <ModelTable
              filteredModels={filteredModels}
              models={models}
              role={role}
              setEditModelId={setEditModelId}
              setEditModelData={setEditModelData}
              setShowEditModelModal={setShowEditModelModal}
              handleToggleModelStatus={handleToggleModelStatus}
              setDeleteModelId={setDeleteModelId}
              setShowDeleteModal={setShowDeleteModal}
            />
          )}

          {/* Users section */}
          {activeSection === "Users" && canAccessSection("Users") && (
            <UsersTable
              users={users}
              usersLoading={usersLoading}
              usersError={usersError}
              setSelectedUserForRole={setSelectedUserForRole}
              setSelectedRole={setSelectedRole}
              setShowRoleModal={setShowRoleModal}
              setSelectedUserForDelete={setSelectedUserForDelete}
              setShowDeleteUserModal={setShowDeleteUserModal}
            />
          )}

          {/* Permissions section */}
          {activeSection === "Permissions" &&
            canAccessSection("Permissions") && (
              <PermissionsTable
                permissions={permissions}
                permissionsLoading={permissionsLoading}
                permissionsError={permissionsError}
                role={role}
                setRevokeDetails={setRevokeDetails}
                setShowRevokeModal={setShowRevokeModal}
                users={users}
                models={models}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                handleGrantAccess={handleGrantAccess}
                permissionMessage={permissionMessage}
              />
            )}

          {/* Recent activity and access summary */}
          {activeSection === "Overview" && (
            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <RecentActivity activities={activities} />

              <AccessOverview
                role={role}
                usersLoading={usersLoading}
                usersError={usersError}
                adminCount={adminCount}
                managerCount={managerCount}
                regularUserCount={regularUserCount}
                adminPercentage={adminPercentage}
                managerPercentage={managerPercentage}
                regularUserPercentage={regularUserPercentage}
              />
            </section>
          )}

          <footer className="pb-2 text-center text-xs text-neutral-400">
            ModelVault · Model access management
          </footer>
        </div>
      </main>

      {/* Revoke access modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-neutral-900/[0.06]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/10">
              <AlertTriangle size={20} />
            </div>

            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
              Revoke model access?
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Are you sure you want to revoke access to{" "}
              <span className="font-semibold text-neutral-900">
                {revokeDetails?.modelName}
              </span>{" "}
              for{" "}
              <span className="font-semibold text-neutral-900">
                {revokeDetails?.userName}
              </span>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowRevokeModal(false);
                  setRevokeDetails(null);
                }}
                className="rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 active:scale-[0.98]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  await handleRevokeAccess(
                    revokeDetails.userId,
                    revokeDetails.modelId,
                  );
                  setShowRevokeModal(false);
                  setRevokeDetails(null);
                }}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 active:scale-[0.98]"
              >
                Revoke access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete model modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-neutral-900/[0.06]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/10">
              <AlertTriangle size={20} />
            </div>

            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
              Delete model?
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Are you sure you want to delete this model? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteModelId(null);
                }}
                className="rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 active:scale-[0.98]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  await handleDeleteModel(deleteModelId);
                  setShowDeleteModal(false);
                  setDeleteModelId(null);
                }}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 active:scale-[0.98]"
              >
                Delete model
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add model modal */}
      {showAddModelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-neutral-900/[0.06]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                  Add new model
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Register a new model in your workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModelModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddModel} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">
                  Model name
                </label>
                <input
                  type="text"
                  required
                  value={newModelData.name}
                  onChange={(e) =>
                    setNewModelData({
                      ...newModelData,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. GPT-4o"
                  className={modalInputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">
                  Provider
                </label>
                <input
                  type="text"
                  required
                  value={newModelData.provider}
                  onChange={(e) =>
                    setNewModelData({
                      ...newModelData,
                      provider: e.target.value,
                    })
                  }
                  placeholder="e.g. OpenAI"
                  className={modalInputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={newModelData.description}
                  onChange={(e) =>
                    setNewModelData({
                      ...newModelData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe what this model does..."
                  className={`${modalInputClass} resize-none`}
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModelModal(false)}
                  className="rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black active:scale-[0.98]"
                >
                  Add model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit model modal */}
      {showEditModelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-neutral-900/[0.06]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                Edit model
              </h2>

              <button
                type="button"
                onClick={() => setShowEditModelModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditModel}>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">
                    Model name
                  </label>
                  <input
                    type="text"
                    required
                    value={editModelData.name}
                    onChange={(e) =>
                      setEditModelData({
                        ...editModelData,
                        name: e.target.value,
                      })
                    }
                    className={modalInputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">
                    Provider
                  </label>
                  <input
                    type="text"
                    required
                    value={editModelData.provider}
                    onChange={(e) =>
                      setEditModelData({
                        ...editModelData,
                        provider: e.target.value,
                      })
                    }
                    className={modalInputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={editModelData.description}
                    onChange={(e) =>
                      setEditModelData({
                        ...editModelData,
                        description: e.target.value,
                      })
                    }
                    className={`${modalInputClass} resize-none`}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModelModal(false)}
                  className="rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black active:scale-[0.98]"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update user role modal */}
      {showRoleModal && selectedUserForRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-neutral-900/[0.06]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                Change user role
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUserForRole(null);
                  setSelectedRole("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mb-4 text-sm text-neutral-500">
              Change the role for{" "}
              <span className="font-semibold text-neutral-900">
                {selectedUserForRole.userName}
              </span>
            </p>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-neutral-700">
                Select role
              </label>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className={modalInputClass}
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUserForRole(null);
                  setSelectedRole("");
                }}
                className="rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 active:scale-[0.98]"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={selectedRole === selectedUserForRole.role}
                onClick={handleUpdateUserRole}
                className="rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete user modal */}
      {showDeleteUserModal && selectedUserForDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-neutral-900/[0.06]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/10">
              <AlertTriangle size={20} />
            </div>

            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
              Delete user?
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-neutral-900">
                {selectedUserForDelete.userName}
              </span>
              ? This action cannot be undone. Their model permissions will also
              be removed.
            </p>

            {selectedUserForDelete._id === currentUser?._id && (
              <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                You cannot delete your own account.
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteUserModal(false);
                  setSelectedUserForDelete(null);
                }}
                className="rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 active:scale-[0.98]"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={selectedUserForDelete._id === currentUser?._id}
                onClick={handleDeleteUser}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete user
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
