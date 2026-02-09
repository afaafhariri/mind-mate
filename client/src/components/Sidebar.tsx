import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 280;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  window?: () => Window;
}

export default function Sidebar({
  mobileOpen,
  handleDrawerToggle,
  window,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Journals", icon: <AutoStoriesIcon />, path: "/journals" },
    { text: "Chat", icon: <ChatIcon />, path: "/chat" },
    { text: "Profile", icon: <PersonIcon />, path: "/profile" },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
          pt: 6,
          pb: 4,
          width: "100%",
        }}
      >
        <Box
          component="img"
          src="/meditation-round-svgrepo-com.svg"
          alt="Mind Mate Logo"
          sx={{
            width: 70,
            height: 70,
          }}
        />
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          Mind Mate
        </Typography>
      </Box>
      {/* Navigation Items */}
      <List sx={{ width: "100%", px: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 2 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                disableRipple
                sx={{
                  borderRadius: 2,
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                  py: 1,
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                  "&.Mui-selected": {
                    bgcolor: "transparent",
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: "transparent",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "50%",
                    border: "2px solid",
                    borderColor: isActive ? "primary.main" : "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s",
                    bgcolor: isActive ? "primary.main" : "transparent",
                    color: isActive ? "common.white" : "text.secondary",
                    "& svg": { color: "inherit" }, // Ensure icon inherits color
                    ".MuiListItemButton-root:hover &": {
                      borderColor: "primary.main",
                      color: isActive ? "common.white" : "primary.main",
                      transform: "scale(1.05)",
                      boxShadow: "0 0 15px rgba(25, 118, 210, 0.15)",
                    },
                  }}
                >
                  {item.icon}
                </Box>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    variant: "caption",
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      {/* Logout */}
      <List sx={{ width: "100%", px: 2, mb: 10 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/")}
            disableRipple
            sx={{
              borderRadius: 2,
              flexDirection: "column",
              gap: 0.5,
              "&:hover": {
                bgcolor: "transparent",
              },
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: "50%",
                border: "2px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                transition: "all 0.3s",
                ".MuiListItemButton-root:hover &": {
                  borderColor: "error.main",
                  color: "error.main",
                  transform: "scale(1.05)",
                  boxShadow: "0 0 15px rgba(211, 47, 47, 0.15)",
                },
              }}
            >
              <LogoutIcon />
            </Box>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ variant: "caption" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "background.default",
            borderRight: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "transparent", // Blends with background
            borderRight: "none",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
