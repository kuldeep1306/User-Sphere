import {
    LuLayoutDashboard,
    LuClipboardCheck,
    LuUsers,
    LuSquarePlus,
    LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        link: "/admin/dashboard",
    },
    {
        id: "02",
        label: "Manage Tasks",
        icon: LuClipboardCheck,
        link: "/admin/tasks",
    },
    {
        id: "03",
        label: "Create Task",
        icon: LuSquarePlus,
        link: "/admin/create-task",
    },
    {
        id: "04",
        label: "Team members",
        icon: LuUsers,
        link: "/admin/users",
    },
    {
        id: "05",
        label: "Logout",
        icon: LuLogOut,
        link: "/login",
    },
];

export const SIDE_MENU_USER_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        link: "/user/dashboard",
    },
    {
        id: "02",
        label: "My Tasks",
        icon: LuClipboardCheck,
        link: "/user/tasks",
    },
    {
        id: "05",
        label: "Logout",
        icon: LuLogOut,
        link: "/login",
    },
];

export const PRIORITY_DATA = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
];

export const STATUS_DATA = [
    { label: "Pending", value: "pending" },
    { label: "Inprogress", value: "inprogress" },
    { label: "Completed", value: "completed" },
];
