interface GitHubStats {
    repos: string;
    contributions: string;
    error?: string;
    loading?: boolean;
}

export async function getGitHubStats(username: string): Promise<GitHubStats> {
    const CACHE_KEY = `github-stats-${username}`;
    const CACHE_DURATION = 60 * 60 * 10000; // 10 hours in milliseconds

    // Attempt to retrieve cached data
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return { ...data, loading: false };
            }
        }
    } catch (e) {
        console.warn('Cache retrieval failed: ', e);
    }

    // If cache is not available or expired, fetch new data
    try {
        const query = `
            query($username: String!) {
                user(login: $username) {
                    repositories { totalCount }
                }
                contributionsCollection {
                    contributionCalendar { totalContributions }
                }
            }
        `;
        
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.GITHUB_TOKEN}`,
            },
            body: JSON.stringify( { query, variables: { username } } )
        });

        if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors.map((err: any) => err.message).join(', '));
        }

        const stats = {
            repos: `${result.data.user.repositories.totalCount}+`,
            contributions: `${result.data.contributionsCollection.contributionCalendar.totalContributions}+`,
            loading: false
        };

        // Update cache with new data
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: stats,
            timestamp: Date.now()
        }));

        return stats;
    } catch (e) {
        console.error('Failed to fetch GitHub stats: ', e);
        // Return fallback data on error
        return {
            repos: '20+',
            contributions: '270+',
            error: 'Failed to load stats',
            loading: false
        };
    }
}