import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

function useDashboard() {
  // -------------------- STATE --------------------

  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("");
  const [activeSection, setActiveSection] = useState("Overview");
  const [currentUser, setCurrentUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  const [permissions, setPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionsError, setPermissionsError] = useState("");

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [permissionMessage, setPermissionMessage] = useState("");

  // Modal states
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revokeDetails, setRevokeDetails] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModelId, setDeleteModelId] = useState(null);

  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [newModelData, setNewModelData] = useState({
    name: "",
    provider: "",
    description: "",
  });

  const [showEditModelModal, setShowEditModelModal] = useState(false);
  const [editModelId, setEditModelId] = useState(null);
  const [editModelData, setEditModelData] = useState({
    name: "",
    provider: "",
    description: "",
  });

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);

  // -------------------- FETCH MODELS --------------------

  const fetchModels = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to continue.");
        setLoading(false);
        return;
      }

      const response = await api.get("/models", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setModels(response.data.models);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch models");
    } finally {
      setLoading(false);
    }
  }, []);

  // -------------------- FETCH CURRENT USER --------------------

  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCurrentUser(response.data.user);
      setRole(response.data.user.role);
    } catch (err) {
      console.error(
        "FETCH CURRENT USER ERROR:",
        err.response?.data || err.message,
      );
    }
  }, []);

  useEffect(() => {
    fetchModels();
    fetchCurrentUser();
  }, [fetchModels, fetchCurrentUser]);

  // -------------------- FETCH USERS --------------------

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUsersError("Please log in to continue.");
        return;
      }

      const response = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users);
    } catch (err) {
      setUsersError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (
      (activeSection === "Overview" ||
        activeSection === "Users" ||
        activeSection === "Permissions") &&
      role === "admin"
    ) {
      fetchUsers();
    }
  }, [activeSection, role, fetchUsers]);

  // -------------------- FETCH PERMISSIONS --------------------

  const fetchPermissions = useCallback(async () => {
    setPermissionsLoading(true);
    setPermissionsError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setPermissionsError("Please log in to continue.");
        return;
      }

      const endpoint =
        role === "admin" || role === "manager"
          ? "/permissions"
          : "/permissions/my";

      const response = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPermissions(response.data.permissions);
    } catch (err) {
      console.error(
        "FETCH PERMISSIONS ERROR:",
        err.response?.data || err.message,
      );

      setPermissionsError(
        err.response?.data?.message || "Failed to fetch permissions",
      );
    } finally {
      setPermissionsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (activeSection === "Overview" || activeSection === "Permissions") {
      fetchPermissions();
    }
  }, [activeSection, fetchPermissions]);

  // -------------------- GRANT ACCESS --------------------

  const handleGrantAccess = async () => {
    setPermissionMessage("");

    if (!selectedUser || !selectedModel) {
      setPermissionMessage("Please select both a user and a model");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/permissions",
        {
          userId: selectedUser,
          modelId: selectedModel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPermissionMessage(response.data.message);

      setSelectedUser("");
      setSelectedModel("");

      fetchPermissions();
    } catch (err) {
      console.error("GRANT ACCESS ERROR:", err.response?.data || err.message);

      setPermissionMessage(
        err.response?.data?.message || err.message || "Failed to grant access",
      );
    }
  };

  // -------------------- REVOKE ACCESS --------------------

  const handleRevokeAccess = async (userId, modelId) => {
    setPermissionMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.delete("/permissions", {
        data: { userId, modelId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPermissionMessage(response.data.message);
      fetchPermissions();
    } catch (err) {
      console.error("REVOKE ACCESS ERROR:", err.response?.data || err.message);

      setPermissionMessage(
        err.response?.data?.message || "Failed to revoke access",
      );
    }
  };

  // -------------------- TOGGLE MODEL STATUS --------------------

  const handleToggleModelStatus = async (modelId) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/models/${modelId}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchModels();
    } catch (err) {
      console.error(
        "TOGGLE MODEL STATUS ERROR:",
        err.response?.data || err.message,
      );
    }
  };

  // -------------------- DELETE MODEL --------------------

  const handleDeleteModel = async (modelId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.delete(`/models/${modelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPermissionMessage(
        response.data.message || "Model deleted successfully",
      );

      fetchModels();
    } catch (err) {
      console.error("DELETE MODEL ERROR:", err.response?.data || err.message);
    }
  };

  // -------------------- ADD MODEL --------------------

  const handleAddModel = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await api.post("/models", newModelData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPermissionMessage(response.data.message || "Model added successfully");

      setNewModelData({
        name: "",
        provider: "",
        description: "",
      });

      setShowAddModelModal(false);
      fetchModels();
    } catch (err) {
      console.error("ADD MODEL ERROR:", err.response?.data || err.message);

      setPermissionMessage(
        err.response?.data?.message || "Failed to add model",
      );
    }
  };

  // -------------------- EDIT MODEL --------------------

  const handleEditModel = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await api.patch(
        `/models/${editModelId}`,
        editModelData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPermissionMessage(
        response.data.message || "Model updated successfully",
      );

      setShowEditModelModal(false);
      setEditModelId(null);

      setEditModelData({
        name: "",
        provider: "",
        description: "",
      });

      fetchModels();
    } catch (err) {
      console.error("EDIT MODEL ERROR:", err.response?.data || err.message);

      setPermissionMessage(
        err.response?.data?.message || "Failed to update model",
      );
    }
  };

  // -------------------- UPDATE USER ROLE --------------------

  const handleUpdateUserRole = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.patch(
        `/users/${selectedUserForRole._id}/role`,
        { role: selectedRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPermissionMessage(
        response.data.message || "User role updated successfully",
      );

      setShowRoleModal(false);
      setSelectedUserForRole(null);
      setSelectedRole("");

      fetchUsers();
    } catch (err) {
      console.error(
        "UPDATE USER ROLE ERROR:",
        err.response?.data || err.message,
      );

      setPermissionMessage(
        err.response?.data?.message || "Failed to update user role",
      );
    }
  };

  // -------------------- DELETE USER --------------------

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.delete(`/users/${selectedUserForDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPermissionMessage(
        response.data.message || "User deleted successfully",
      );

      setShowDeleteUserModal(false);
      setSelectedUserForDelete(null);

      fetchUsers();
      fetchPermissions();
    } catch (err) {
      console.error("DELETE USER ERROR:", err.response?.data || err.message);

      setPermissionMessage(
        err.response?.data?.message || "Failed to delete user",
      );
    }
  };

  // -------------------- LOGOUT USER --------------------
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await api.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  // -------------------- CALCULATED DATA --------------------

  const totalModels = models.length;
  const activeModels = models.filter((model) => model.isActive).length;
  const registeredUsers = users.length;
  const totalAccessGrants = permissions.length;

  const adminCount = users.filter((user) => user.role === "admin").length;
  const managerCount = users.filter((user) => user.role === "manager").length;
  const regularUserCount = users.filter((user) => user.role === "user").length;

  const totalUsers = users.length;

  const adminPercentage = totalUsers ? (adminCount / totalUsers) * 100 : 0;
  const managerPercentage = totalUsers ? (managerCount / totalUsers) * 100 : 0;
  const regularUserPercentage = totalUsers
    ? (regularUserCount / totalUsers) * 100
    : 0;

  const activities = [
    ...models.map((model) => ({
      id: `model-${model._id}`,
      title: "New model registered",
      detail: `${model.name} was added to the registry`,
      initials: "M",
      createdAt: model.createdAt,
    })),

    ...users.map((user) => ({
      id: `user-${user._id}`,
      title: "New user registered",
      detail: `${user.userName} joined the workspace`,
      initials: user.userName?.charAt(0).toUpperCase() || "U",
      createdAt: user.createdAt,
    })),

    ...permissions.map((permission) => ({
      id: `permission-${permission._id}`,
      title: "Model access granted",
      detail: `${permission.user?.userName || "A user"} received access to ${
        permission.model?.name || "a model"
      }`,
      initials: "A",
      createdAt: permission.createdAt,
    })),
  ]
    .filter((activity) => activity.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const filteredModels = models.filter((model) => {
    const query = searchQuery.toLowerCase();

    return (
      model.name.toLowerCase().includes(query) ||
      model.provider.toLowerCase().includes(query) ||
      model.description.toLowerCase().includes(query)
    );
  });

  // -------------------- RETURN DATA TO DASHBOARD --------------------

  return {
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

    // Calculated values
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
    setPermissionMessage,
    handleGrantAccess,

    // Permission actions
    handleRevokeAccess,
    showRevokeModal,
    setShowRevokeModal,
    revokeDetails,
    setRevokeDetails,

    // Model actions and modal state
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
    showEditModelModal,
    handleLogout,
    setShowEditModelModal,
    editModelId,
    setEditModelId,
    editModelData,
    setEditModelData,

    // User actions and modal state
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
  };
}

export default useDashboard;
