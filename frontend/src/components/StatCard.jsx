
function StatCard({ title, value, icon, description }) {
    return (
        <div className="stat-card">

            <div className="stat-card-top">
                <p>{title}</p>

                <div className="stat-icon">
                    {icon}
                </div>
            </div>

            <h2>{value}</h2>

            <p className="stat-description">
                {description}
            </p>

        </div>
    );
}

export default StatCard;
