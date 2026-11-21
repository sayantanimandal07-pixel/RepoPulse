
import {
    LayoutDashboard,
    Github,
    FolderGit2,
    Activity,
    Settings,
    LogOut
} from "lucide-react";

function Sidebar() {
    return (
        <div className="sidebar">

            <div className="logo">
                <Github size={30} />
                <h2>RepoPulse</h2>
            </div>

            <p className="menu-heading">MENU</p>

            <nav className="sidebar-menu">

                <a href="#" className="menu-item active">
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </a>

                <a href="#" className="menu-item">
                    <FolderGit2 size={20} />
                    <span>Repositories</span>
                </a>

                <a href="#" className="menu-item">
                    <Activity size={20} />
                    <span>Analytics</span>
                </a>

            </nav>

            <div className="sidebar-bottom">

                <a href="#" className="menu-item">
                    <Settings size={20} />
                    <span>Settings</span>
                </a>

                <a href="#" className="menu-item">
                    <LogOut size={20} />
                    <span>Logout</span>
                </a>

            </div>

        </div>
    );
}

export default Sidebar;
