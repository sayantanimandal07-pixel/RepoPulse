
import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api/github'

function App() {
  const [username, setUsername] = useState('octocat')
  const [searchUsername, setSearchUsername] = useState('octocat')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const [profile, setProfile] = useState(null)

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [languageAnalytics, setLanguageAnalytics] = useState([])
  const [repositories, setRepositories] = useState([])
  const [repositoriesLoading, setRepositoriesLoading] = useState(true)

  const [activity, setActivity] = useState(null)
  const [activityLoading, setActivityLoading] = useState(true)

  const [repositoryHealth, setRepositoryHealth] = useState([])
  const [healthLoading, setHealthLoading] = useState(true)

  const [recommendations, setRecommendations] = useState([])
const [recommendationsLoading, setRecommendationsLoading] = useState(true)

  // Search and analyze a GitHub username
  const handleSearch = async (event) => {
    event.preventDefault()

    const newUsername = searchUsername.trim()

    if (!newUsername) {
      setSearchError('Please enter a GitHub username.')
      return
    }

    try {
      setSearching(true)
      setSearchError('')
      setError('')

      // Save/sync the GitHub developer before loading database analytics
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(newUsername)}/save`,
        {
          method: 'POST'
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Unable to find or sync this GitHub user.'
        )
      }

      setUsername(newUsername)
    } catch (err) {
      setSearchError(err.message)
    } finally {
      setSearching(false)
    }
  }

  // Fetch GitHub developer profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${API_URL}/${encodeURIComponent(username)}`
        )

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error('Failed to fetch developer profile')
        }

        const developer = result.developer || result.user || result

        setProfile({
          name: developer.name || developer.login || username,
          username: developer.username || developer.login || username,
          avatarUrl: developer.avatarUrl || developer.avatar_url || '',
          profileUrl: developer.profileUrl || developer.html_url ||
            `https://github.com/${username}`,
          bio: developer.bio || ''
        })
      } catch (err) {
        console.error('Profile Fetch Error:', err.message)
        setProfile(null)
      }
    }

    fetchProfile()
  }, [username])

  // Fetch repository statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError('')
        setStats(null)

        const response = await fetch(
          `${API_URL}/${encodeURIComponent(username)}/analytics/repositories`
        )

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || 'Failed to fetch repository statistics'
          )
        }

        setStats(result.stats)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [username])

  // Fetch language analytics
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLanguageAnalytics([])

        const response = await fetch(
          `${API_URL}/${encodeURIComponent(username)}/analytics/languages`
        )

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error('Failed to fetch language analytics')
        }

        setLanguageAnalytics(result.languageAnalytics || [])
      } catch (err) {
        console.error('Language Analytics Error:', err.message)
      }
    }

    fetchLanguages()
  }, [username])

  // Fetch GitHub repositories
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setRepositoriesLoading(true)
        setRepositories([])

        const response = await fetch(
          `${API_URL}/${encodeURIComponent(username)}/repos`
        )

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error('Failed to fetch repositories')
        }

        setRepositories(result.data || [])
      } catch (err) {
        console.error('Repository Fetch Error:', err.message)
      } finally {
        setRepositoriesLoading(false)
      }
    }

    fetchRepositories()
  }, [username])

  // Fetch repository activity
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setActivityLoading(true)
        setActivity(null)

        const response = await fetch(
          `${API_URL}/${encodeURIComponent(username)}/analytics/activity`
        )

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error('Failed to fetch repository activity')
        }

        setActivity(result.activity)
      } catch (err) {
        console.error('Activity Fetch Error:', err.message)
      } finally {
        setActivityLoading(false)
      }
    }

    fetchActivity()
  }, [username])

  // Fetch repository health analytics
  useEffect(() => {
    const fetchRepositoryHealth = async () => {
      try {
        setHealthLoading(true)
        setRepositoryHealth([])

        const response = await fetch(
          `${API_URL}/${encodeURIComponent(username)}/analytics/health`
        )

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error('Failed to fetch repository health')
        }

        setRepositoryHealth(result.repositoryHealth || [])
      } catch (err) {
        console.error('Repository Health Error:', err.message)
      } finally {
        setHealthLoading(false)
      }
    }

    fetchRepositoryHealth()
  }, [username])

  // Fetch repository improvement recommendations
useEffect(() => {
    const fetchRecommendations = async () => {
        try {
            setRecommendationsLoading(true)
            setRecommendations([])

            const response = await fetch(
                `${API_URL}/${encodeURIComponent(username)}/analytics/recommendations`
            )

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'Failed to fetch recommendations'
                )
            }

            setRecommendations(result.recommendations || [])

        } catch (err) {
            console.error('Recommendations Error:', err.message)
        } finally {
            setRecommendationsLoading(false)
        }
    }

    fetchRecommendations()
}, [username])

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">RepoPulse.</h2>

        <nav>
          <a className="active" href="#">Dashboard</a>
          <a href="#repositories">Repositories</a>
          <a href="#analytics">Analytics</a>
          <a href="#activity">Activity</a>
          <a href="#">Settings</a>
        </nav>

        <div className="sidebar-footer">
          Developer Analytics Platform
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Header */}
        <header className="topbar">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Track your GitHub development journey.</p>
          </div>

          <a
            className="profile-button"
            href={profile?.profileUrl || `https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
          >
            My Profile
          </a>
        </header>

        {/* Welcome Section */}
        <section className="welcome">
          <h2>Welcome to RepoPulse 👋</h2>
          <p>Your developer journey, all in one place.</p>
        </section>

        {/* GitHub Username Search */}
        <section className="welcome">
          <h2>Analyze a GitHub Developer</h2>
          <p>Enter a GitHub username to explore their repositories and analytics.</p>

          <form
            onSubmit={handleSearch}
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '18px'
            }}
          >
            <input
              type="text"
              value={searchUsername}
              onChange={(event) => setSearchUsername(event.target.value)}
              placeholder="Enter GitHub username"
              style={{
                flex: '1',
                minWidth: '200px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '15px'
              }}
            />

            <button
              type="submit"
              disabled={searching}
              style={{
                padding: '12px 22px',
                border: 'none',
                borderRadius: '8px',
                background: '#2563eb',
                color: 'white',
                cursor: searching ? 'not-allowed' : 'pointer',
                opacity: searching ? 0.7 : 1
              }}
            >
              {searching ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>

          {searchError && (
            <p className="error-message" style={{ marginTop: '12px' }}>
              {searchError}
            </p>
          )}
        </section>

        {/* Statistics Cards */}
        <section className="stats-grid">

          <div className="stat-card">
            <p>Total Repositories</p>
            <h2>
              {loading ? 'Loading...' : stats ? stats.totalRepositories : '--'}
            </h2>
            <span>Public repositories</span>
          </div>

          <div className="stat-card">
            <p>Total Stars</p>
            <h2>
              {loading ? 'Loading...' : stats ? stats.totalStars.toLocaleString() : '--'}
            </h2>
            <span>Across all repositories</span>
          </div>

          <div className="stat-card">
            <p>Total Forks</p>
            <h2>
              {loading ? 'Loading...' : stats ? stats.totalForks.toLocaleString() : '--'}
            </h2>
            <span>Community contributions</span>
          </div>

          <div className="stat-card">
            <p>Average Stars</p>
            <h2>
              {loading ? 'Loading...' : stats ? stats.averageStars.toLocaleString() : '--'}
            </h2>
            <span>Average stars per repository</span>
          </div>

        </section>

        {error && (
          <p className="error-message">
            Unable to load statistics: {error}
          </p>
        )}

        {/* Most Starred Repository */}
        {stats && stats.mostStarredRepository && (
          <section className="welcome">
            <h2>🏆 Most Starred Repository</h2>
            <h3>{stats.mostStarredRepository.name}</h3>
            <p>
              ⭐ {stats.mostStarredRepository.stars.toLocaleString()} stars
            </p>

            <a
              href={stats.mostStarredRepository.url}
              target="_blank"
              rel="noreferrer"
            >
              View Repository ↗
            </a>
          </section>
        )}

        {/* Developer Profile */}
        <section className="developer-profile">
          <div className="profile-info">
            <img
              src={
                profile?.avatarUrl ||
                'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
              }
              alt="Developer avatar"
            />

            <div>
              <h2>{profile?.name || username}</h2>
              <p>@{profile?.username || username}</p>
              <span>GitHub Developer</span>
              {profile?.bio && <p>{profile.bio}</p>}
            </div>
          </div>

          <a
            href={profile?.profileUrl || `https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
          >
            View GitHub Profile ↗
          </a>
        </section>

        {/* Repository Activity Section */}
        <section className="stats-grid" id="activity">

          <div className="stat-card">
            <p>Recently Active Repositories</p>
            <h2>
              {activityLoading
                ? 'Loading...'
                : activity
                  ? activity.recentlyActiveRepositories
                  : '--'}
            </h2>
            <span>Active within the last 30 days</span>
          </div>

          <div className="stat-card">
            <p>Inactive Repositories</p>
            <h2>
              {activityLoading
                ? 'Loading...'
                : activity
                  ? activity.inactiveRepositories
                  : '--'}
            </h2>
            <span>No recent activity</span>
          </div>

          <div className="stat-card">
            <p>Latest Repository Update</p>
            <h2>
              {activityLoading
                ? 'Loading...'
                : activity?.latestUpdatedRepository || '--'}
            </h2>
            <span>Most recently pushed repository</span>
          </div>

          <div className="stat-card">
            <p>Latest Push Date</p>
            <h2>
              {activityLoading
                ? 'Loading...'
                : activity?.latestPushDate
                  ? new Date(activity.latestPushDate).toLocaleDateString()
                  : '--'}
            </h2>
            <span>Latest recorded push</span>
          </div>

        </section>

        {/* Analytics Section */}
        <section className="analytics-grid" id="analytics">

          {/* Language Distribution */}
          <div className="analytics-card">
            <h2>Language Distribution</h2>

            <p className="card-subtitle">
              Languages used across repositories
            </p>

            {languageAnalytics.length > 0 ? (
              languageAnalytics.map((item, index) => {
                const colors = [
                  '#3b82f6',
                  '#eab308',
                  '#8b5cf6',
                  '#f97316'
                ]

                return (
                  <div className="language-item" key={item.language}>
                    <div className="language-label">
                      <span>{item.language}</span>
                      <span>{item.percentage}%</span>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: colors[index % colors.length]
                        }}
                      ></div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p>No language data available.</p>
            )}
          </div>

          {/* Repository Overview */}
          <div className="analytics-card" id="repositories">
            <h2>Repository Overview</h2>

            <p className="card-subtitle">
              GitHub repositories for @{username}
            </p>

            {repositoriesLoading ? (
              <p>Loading repositories...</p>
            ) : repositories.length > 0 ? (
              repositories.map((repo) => (
                <div className="repo-item" key={repo.name}>
                  <div>
                    <h3>{repo.name}</h3>
                    <p>{repo.language || 'Language not specified'}</p>
                  </div>

                  <span>
                    ⭐ {(repo.stars || 0).toLocaleString()}
                  </span>

                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View ↗
                  </a>
                </div>
              ))
            ) : (
              <p>No repositories available.</p>
            )}
          </div>

        </section>


{/* Repository Improvement Recommendations */}
<section className="analytics-card" id="recommendations">
    <h2>Repository Improvement Recommendations</h2>

    {recommendationsLoading ? (
        <p>Loading recommendations...</p>
    ) : recommendations.length === 0 ? (
        <p>No recommendations available.</p>
    ) : (
        <div className="recommendations-list">
            {recommendations.map((repo, index) => (
                <div className="language-item" key={index}>
                    <h3>{repo.repositoryName}</h3>

                    <p>
                        {repo.totalRecommendations} improvement
                        {repo.totalRecommendations !== 1 ? "s" : ""} suggested
                    </p>

                    {repo.recommendations.map((item, itemIndex) => (
                        <div
                            key={itemIndex}
                            style={{
                                padding: "12px",
                                marginTop: "10px",
                                borderRadius: "8px",
                                backgroundColor: "#f5f7fb"
                            }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "10px",
                                flexWrap: "wrap"
                            }}>
                                <strong>{item.category}</strong>

                                <span style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    color:
                                        item.priority === "High" ? "#dc2626" :
                                        item.priority === "Medium" ? "#d97706" :
                                        "#16a34a"
                                }}>
                                    {item.priority} Priority
                                </span>
                            </div>

                            <p>{item.issue}</p>
                            <p><strong>Suggestion:</strong> {item.suggestion}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )}
</section>


        {/* Repository Health Section */}
        <section className="analytics-card">
          <h2>Repository Health Overview</h2>

          <p className="card-subtitle">
            Health scores based on activity, description, stars, forks and language
          </p>

          {healthLoading ? (
            <p>Loading repository health...</p>
          ) : repositoryHealth.length > 0 ? (
            repositoryHealth.map((repo) => {
              const scoreColor =
                repo.healthScore >= 80 ? '#16a34a' :
                repo.healthScore >= 60 ? '#2563eb' :
                repo.healthScore >= 40 ? '#d97706' : '#dc2626'

              return (
                <div
                  className="language-item"
                  key={repo.repositoryName}
                >
                  <div className="language-label">
                    <span>{repo.repositoryName}</span>
                    <span>{repo.healthScore}/100</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${repo.healthScore}%`,
                        backgroundColor: scoreColor
                      }}
                    ></div>
                  </div>

                  <span style={{ color: scoreColor, fontSize: '13px' }}>
                    {repo.healthStatus}
                  </span>
                </div>
              )
            })
          ) : (
            <p>No repository health data available.</p>
          )}
        </section>

      </main>
    </div>
  )
}

export default App
