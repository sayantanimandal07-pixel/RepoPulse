// Calculate programming language distribution
const calculateLanguageDistribution = (repositories) => {

    const languageCounts = {};

    // Count repositories for each language
    repositories.forEach(repo => {

        if (repo.language) {

            if (languageCounts[repo.language]) {
                languageCounts[repo.language]++;
            } else {
                languageCounts[repo.language] = 1;
            }

        }

    });

    // Calculate total repositories with a language
    const totalRepositories = Object.values(languageCounts)
        .reduce((total, count) => total + count, 0);

    // Calculate percentage
    const languageDistribution = Object.entries(languageCounts)
        .map(([language, count]) => ({
            language: language,
            repositories: count,
            percentage: totalRepositories > 0
                ? Number(((count / totalRepositories) * 100).toFixed(2))
                : 0
        }));

    return languageDistribution;
};


// Calculate repository statistics
const calculateRepositoryStats = (repositories) => {

    // Calculate total stars
    const totalStars = repositories.reduce(
        (total, repo) => total + (repo.stars || 0),
        0
    );

    // Calculate total forks
    const totalForks = repositories.reduce(
        (total, repo) => total + (repo.forks || 0),
        0
    );

    // Calculate average stars
    const averageStars = repositories.length > 0
        ? Number((totalStars / repositories.length).toFixed(2))
        : 0;

    // Find most starred repository
    const mostStarredRepo = repositories.length > 0
        ? repositories.reduce((highest, repo) =>
            repo.stars > highest.stars ? repo : highest
        )
        : null;

    return {
        totalRepositories: repositories.length,
        totalStars,
        totalForks,
        averageStars,
        mostStarredRepository: mostStarredRepo
            ? {
                name: mostStarredRepo.repoName,
                stars: mostStarredRepo.stars,
                url: mostStarredRepo.repoUrl
            }
            : null
    };
};

// Calculate developer repository activity
const calculateRepositoryActivity = (repositories) => {

    const currentDate = new Date();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    const recentlyActiveRepositories = repositories.filter(repo => {
        if (!repo.pushedAt) {
            return false;
        }

        const pushDate = new Date(repo.pushedAt);

        return pushDate >= thirtyDaysAgo &&
               pushDate <= currentDate;
    });

    const repositoriesWithPushDates = repositories.filter(
        repo => repo.pushedAt
    );

    const latestPush = repositoriesWithPushDates.length > 0
        ? repositoriesWithPushDates.reduce((latest, repo) => {
            return new Date(repo.pushedAt) > new Date(latest.pushedAt)
                ? repo
                : latest;
        })
        : null;

    return {
        totalRepositories: repositories.length,
        recentlyActiveRepositories: recentlyActiveRepositories.length,
        inactiveRepositories:
            repositories.length - recentlyActiveRepositories.length,
        latestPushDate: latestPush
            ? latestPush.pushedAt
            : null,
        latestUpdatedRepository: latestPush
            ? latestPush.repoName
            : null
    };
};

// Calculate repository health score
const calculateRepositoryHealth = (repositories) => {

    const currentDate = new Date();

    return repositories.map(repo => {

        let score = 0;

        // 1. Activity Score (40 points)
        if (repo.pushedAt) {
            const pushDate = new Date(repo.pushedAt);

            const daysSinceLastPush = Math.floor(
                (currentDate - pushDate) / (1000 * 60 * 60 * 24)
            );

            if (daysSinceLastPush <= 30) {
                score += 40;
            } else if (daysSinceLastPush <= 90) {
                score += 30;
            } else if (daysSinceLastPush <= 180) {
                score += 20;
            } else if (daysSinceLastPush <= 365) {
                score += 10;
            }
        }

        // 2. Description Score (15 points)
        if (repo.description && repo.description.length > 20) {
            score += 15;
        } else if (repo.description) {
            score += 8;
        }

        // 3. Stars Score (20 points)
        if (repo.stars >= 50) {
            score += 20;
        } else if (repo.stars >= 10) {
            score += 15;
        } else if (repo.stars >= 1) {
            score += 10;
        }

        // 4. Forks Score (10 points)
        if (repo.forks >= 5) {
            score += 10;
        } else if (repo.forks >= 1) {
            score += 5;
        }

        // 5. Programming Language Score (15 points)
        if (repo.language) {
            score += 15;
        }

        // Determine health status
        let healthStatus;

        if (score >= 80) {
            healthStatus = "Excellent";
        } else if (score >= 60) {
            healthStatus = "Good";
        } else if (score >= 40) {
            healthStatus = "Fair";
        } else {
            healthStatus = "Needs Attention";
        }

        return {
            repositoryName: repo.repoName,
            healthScore: score,
            healthStatus: healthStatus
        };
    });
};

module.exports = {
    calculateLanguageDistribution,
    calculateRepositoryStats,
    calculateRepositoryActivity,
    calculateRepositoryHealth
};