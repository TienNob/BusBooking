import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSnackbar } from "notistack";
import FormEditProfile from "../../forum/forumProfile/FormEditProfile";

const userColumns = (handleEdit, handleDelete, handleViewDetails) => [
  { field: "index", headerName: "ID", flex: 0.1 },
  { field: "firstName", headerName: "Họ", flex: 0.15 },
  { field: "lastName", headerName: "Tên", flex: 0.15 },
  { field: "phone", headerName: "Số điện thoại", flex: 0.15 },
  { field: "sex", headerName: "Giới tính", flex: 0.1 },
  {
    field: "birthDay",
    headerName: "Ngày sinh",
    flex: 0.2,
    valueGetter: (params) => {
      const date = new Date(params);
      return date.toLocaleDateString("vi-VN");
    },
  },
  {
    field: "followers",
    headerName: "Số lượt theo dõi bạn",
    flex: 0.15,
    valueGetter: (params) => params.length,
  },

  {
    field: "actions",
    type: "actions",
    headerName: "Hành động",
    flex: 0.2,
    renderCell: (params) => (
      <ActionsMenu
        params={params.row}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleViewDetails={handleViewDetails}
      />
    ),
  },
];

// Actions Menu Component
function ActionsMenu({ params, handleEdit, handleDelete, handleViewDetails }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { width: "200px" } }}
      >
        <MenuItem
          onClick={() => {
            handleViewDetails(params);
            handleClose();
          }}
        >
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText primary="Xem chi tiết" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleEdit(params);
            handleClose();
          }}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Chỉnh sửa" />
        </MenuItem>

        <MenuItem
          sx={{ color: "var(--red)" }}
          onClick={() => {
            handleDelete(params);
            handleClose();
          }}
        >
          <ListItemIcon>
            <DeleteIcon sx={{ color: "var(--red)" }} />
          </ListItemIcon>
          <ListItemText primary="Xoá" />
        </MenuItem>
      </Menu>
    </>
  );
}
// Main AdminUsers Component
function AdminUsers() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/users/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const users = response.data;

        const usersWithIndex = users.map((user, index) => ({
          ...user,
          index: index + 1,
        }));

        setRows(usersWithIndex);
      } catch (error) {
        console.error("Error fetching users", error);
        enqueueSnackbar("Error fetching users", { variant: "error" });
      }
    };

    fetchUsers();
  }, [enqueueSnackbar, token]);

  // Dialog closing functions
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingUser(null);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedUser(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setOpenEditDialog(true);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setOpenDetailsDialog(true); // Open details dialog
  };

  const handleDelete = (user) => {
    setLoading(true);
    axios
      .delete(`http://localhost:8080/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setRows(rows.filter((row) => row._id !== user._id));
        enqueueSnackbar("User deleted successfully", { variant: "success" });
      })
      .catch((error) => {
        console.error("Error deleting user", error);
        enqueueSnackbar("Error deleting user", { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          mb: 6,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Danh sách người dùng
        </Typography>
      </Box>

      <DataGrid
        rows={rows}
        columns={userColumns(handleEdit, handleDelete, handleViewDetails)}
        getRowId={(row) => row._id}
        pageSizeOptions={[10, 25, 35, 50]}
        checkboxSelection
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
      />

      {/* User Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={handleCloseDetailsDialog}>
        <DialogTitle mb={2}>Chi tiết người dùng</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Họ:</strong> {selectedUser.firstName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Tên:</strong> {selectedUser.lastName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Số điện thoại:</strong> {selectedUser.phone}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Giới tính:</strong> {selectedUser.sex}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Ngày sinh:</strong>{" "}
                  {new Date(selectedUser.birthDay).toLocaleDateString("vi-VN")}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>CCCD:</strong> {selectedUser.cccd}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Số người theo dõi bạn:</strong>{" "}
                  {selectedUser.followers.length}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Số người bạn theo dỗi:</strong>{" "}
                  {selectedUser.friends.length}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Ngày tạo tài khoản:</strong>{" "}
                  {new Date(selectedUser.createdAt).toLocaleDateString("vi-VN")}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Mã người dùng:</strong> {selectedUser._id}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              borderRadius: "8px",
              backgroundColor: "var(--primary-color)",
              "&:hover": {
                backgroundColor: "var(--hover-color)",
              },
            }}
            variant="contained"
            onClick={handleCloseDetailsDialog}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <FormEditProfile
        open={openEditDialog}
        handleClose={handleCloseEditDialog}
        userId={editingUser ? editingUser._id : null}
      />
    </Box>
  );
}

export default AdminUsers;