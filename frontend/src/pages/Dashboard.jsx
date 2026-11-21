
import {
    Star,
    GitFork,
    FolderGit2,
    Users
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

function Dashboard() {
    return (
        <div className="dashboard-layout">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Dashboard */}
            <main className="main-content">

                {/* Header */}
                <header className="dashboard-header">
                    <div>
                        <h1>Developer Dashboard</h1>
                        <p>Welcome to your RepoPulse overview.</p>
                    </div>

                    <div className="profile">
                        <img
                            src="https://avatars.githubusercontent.com/u/583231?v=4"
                            alt="Developer"
                        />

                        <div>
                            <h4>The Octocat</h4>
                            <p>@octocat</p>
                        </div>
                    </div>
                </header>

                {/* Statistics */}
                <section className="stats-section">

                    <StatCard
                        title="Total Repositories"
                        value="8"
                        icon={<FolderGit2 size={22} />}
                        description="Public repositories"
                    />

                    <StatCard
                        title="Total Stars"
                        value="22,716"
                        icon={<Star size={22} />}
                        description="Across all repositories"
                    />

                    <StatCard
                        title="Total Forks"
                        value="170,702"
                        icon={<GitFork size={22} />}
                        description="Across all repositories"
                    />

                    <StatCard
                        title="Followers"
                        value="25,290"
                        icon={<Users size={22} />}
                        description="GitHub followers"
                    />

                </section>

                {/* Welcome Section */}
                <section className="welcome-section">
                    <h2>Repository Analytics</h2>
                    <p>
                        Track your repository performance,
                        programming languages and project health
                        in one place.
                    </p>
                </section>

            </main>

        </div>
    );
}

export default Dashboard;
