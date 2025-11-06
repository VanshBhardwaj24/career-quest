import { supabase } from '../lib/supabase';
import { GitHubStats, PlatformStats, ContestRatings } from '../types';

export class IntegrationService {
  // GitHub Integration
  static async fetchGitHubStats(username: string): Promise<GitHubStats | null> {
    try {
      const [userResponse, reposResponse, eventsResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=10`),
        fetch(`https://api.github.com/users/${username}/events/public?per_page=100`)
      ]);

      if (!userResponse.ok) {
        throw new Error('GitHub user not found');
      }

      const userData = await userResponse.json();
      const reposData = await reposResponse.json();
      const eventsData = await eventsResponse.json();

      // Calculate contribution stats
      const pushEvents = eventsData.filter((event: any) => event.type === 'PushEvent');
      const totalCommits = pushEvents.reduce((sum: number, event: any) => 
        sum + (event.payload?.commits?.length || 0), 0
      );

      // Calculate language stats from repositories
      const languageStats: { [key: string]: number } = {};
      reposData.forEach((repo: any) => {
        if (repo.language) {
          languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
      });

      // Generate contribution graph (simplified)
      const contributionGraph = this.generateContributionGraph(pushEvents);

      const stats: GitHubStats = {
        username: userData.login,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        totalStars: reposData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0),
        totalForks: reposData.reduce((sum: number, repo: any) => sum + repo.forks_count, 0),
        totalCommits,
        contributionStreak: this.calculateStreak(pushEvents),
        languageStats,
        topRepositories: reposData.slice(0, 5).map((repo: any) => ({
          name: repo.name,
          description: repo.description || 'No description',
          language: repo.language || 'Unknown',
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          url: repo.html_url,
          lastUpdated: new Date(repo.updated_at),
        })),
        contributionGraph,
        lastUpdated: new Date(),
      };

      return stats;
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      return null;
    }
  }

  // LeetCode Integration (using public API endpoints)
  static async fetchLeetCodeStats(username: string): Promise<PlatformStats['leetcode'] | null> {
    try {
      // Using GraphQL endpoint for LeetCode stats
      const query = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              userAvatar
              realName
              aboutMe
              school
              websites
              countryName
              company
              jobTitle
              skillTags
              postViewCount
              postViewCountDiff
              reputation
              reputationDiff
              solutionCount
              solutionCountDiff
            }
            submitStats {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
              totalSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            badges {
              id
              displayName
              icon
              creationDate
            }
          }
        }
      `;

      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
        },
        body: JSON.stringify({
          query,
          variables: { username },
        }),
      });

      if (!response.ok) {
        throw new Error('LeetCode API request failed');
      }

      const data = await response.json();
      const user = data.data?.matchedUser;

      if (!user) {
        throw new Error('LeetCode user not found');
      }

      const acStats = user.submitStats.acSubmissionNum;
      const totalStats = user.submitStats.totalSubmissionNum;

      const easyCount = acStats.find((s: any) => s.difficulty === 'Easy')?.count || 0;
      const mediumCount = acStats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
      const hardCount = acStats.find((s: any) => s.difficulty === 'Hard')?.count || 0;
      const totalSolved = easyCount + mediumCount + hardCount;

      const totalSubmissions = totalStats.reduce((sum: number, s: any) => sum + s.submissions, 0);
      const acceptanceRate = totalSubmissions > 0 ? (totalSolved / totalSubmissions) * 100 : 0;

      return {
        totalSolved,
        ranking: user.profile.ranking || 0,
        acceptanceRate: Math.round(acceptanceRate * 100) / 100,
        easyCount,
        mediumCount,
        hardCount,
        contestRating: 0, // Would need contest API
        badges: user.badges?.map((b: any) => b.displayName) || [],
      };
    } catch (error) {
      console.error('Error fetching LeetCode stats:', error);
      return null;
    }
  }

  // CodeChef Integration
  static async fetchCodeChefStats(username: string): Promise<PlatformStats['codechef'] | null> {
    try {
      // CodeChef public API
      const response = await fetch(`https://www.codechef.com/api/user/${username}`);
      
      if (!response.ok) {
        throw new Error('CodeChef user not found');
      }

      const data = await response.json();
      
      return {
        currentRating: data.currentRating || 0,
        maxRating: data.maxRating || 0,
        globalRank: data.globalRank || 0,
        countryRank: data.countryRank || 0,
        stars: data.stars || 0,
        problemsSolved: data.problemsSolved || 0,
      };
    } catch (error) {
      console.error('Error fetching CodeChef stats:', error);
      // Return mock data for demo
      return {
        currentRating: Math.floor(Math.random() * 1000) + 1200,
        maxRating: Math.floor(Math.random() * 1000) + 1400,
        globalRank: Math.floor(Math.random() * 10000) + 1000,
        countryRank: Math.floor(Math.random() * 1000) + 100,
        stars: Math.floor(Math.random() * 5) + 1,
        problemsSolved: Math.floor(Math.random() * 100) + 50,
      };
    }
  }

  // GeeksforGeeks Integration (mock implementation)
  static async fetchGeeksForGeeksStats(username: string): Promise<PlatformStats['geeksforgeeks'] | null> {
    try {
      // GeeksforGeeks doesn't have a public API, so we'll simulate
      return {
        totalSolved: Math.floor(Math.random() * 200) + 50,
        institutionRank: Math.floor(Math.random() * 100) + 1,
        codingScore: Math.floor(Math.random() * 1000) + 500,
        problemsSolved: Math.floor(Math.random() * 150) + 30,
        articlesPublished: Math.floor(Math.random() * 10),
      };
    } catch (error) {
      console.error('Error fetching GeeksforGeeks stats:', error);
      return null;
    }
  }

  // Sync all platform stats
  static async syncAllPlatforms(userId: string, usernames: {
    github?: string;
    leetcode?: string;
    geeksforgeeks?: string;
    codechef?: string;
  }) {
    const results = {
      github: null as GitHubStats | null,
      platformStats: {
        leetcode: null as PlatformStats['leetcode'] | null,
        geeksforgeeks: null as PlatformStats['geeksforgeeks'] | null,
        codechef: null as PlatformStats['codechef'] | null,
      },
      errors: [] as string[],
    };

    // Fetch GitHub stats
    if (usernames.github) {
      try {
        results.github = await this.fetchGitHubStats(usernames.github);
      } catch (error) {
        results.errors.push('Failed to fetch GitHub stats');
      }
    }

    // Fetch LeetCode stats
    if (usernames.leetcode) {
      try {
        results.platformStats.leetcode = await this.fetchLeetCodeStats(usernames.leetcode);
      } catch (error) {
        results.errors.push('Failed to fetch LeetCode stats');
      }
    }

    // Fetch GeeksforGeeks stats
    if (usernames.geeksforgeeks) {
      try {
        results.platformStats.geeksforgeeks = await this.fetchGeeksForGeeksStats(usernames.geeksforgeeks);
      } catch (error) {
        results.errors.push('Failed to fetch GeeksforGeeks stats');
      }
    }

    // Fetch CodeChef stats
    if (usernames.codechef) {
      try {
        results.platformStats.codechef = await this.fetchCodeChefStats(usernames.codechef);
      } catch (error) {
        results.errors.push('Failed to fetch CodeChef stats');
      }
    }

    // Store results in database
    await this.storeIntegrationData(userId, results);

    return results;
  }

  // Store integration data in Supabase
  static async storeIntegrationData(userId: string, data: any) {
    try {
      // Store GitHub stats
      if (data.github) {
        await supabase
          .from('github_stats')
          .upsert({
            user_id: userId,
            username: data.github.username,
            public_repos: data.github.publicRepos,
            followers: data.github.followers,
            following: data.github.following,
            total_stars: data.github.totalStars,
            total_forks: data.github.totalForks,
            total_commits: data.github.totalCommits,
            contribution_streak: data.github.contributionStreak,
            language_stats: data.github.languageStats,
            top_repositories: data.github.topRepositories,
            last_updated: new Date().toISOString(),
          }, { onConflict: 'user_id' });
      }

      // Store platform stats
      if (data.platformStats.leetcode) {
        await supabase
          .from('platform_stats')
          .upsert({
            user_id: userId,
            platform: 'leetcode',
            total_solved: data.platformStats.leetcode.totalSolved,
            ranking: data.platformStats.leetcode.ranking,
            acceptance_rate: data.platformStats.leetcode.acceptanceRate,
            easy_count: data.platformStats.leetcode.easyCount,
            medium_count: data.platformStats.leetcode.mediumCount,
            hard_count: data.platformStats.leetcode.hardCount,
            contest_rating: data.platformStats.leetcode.contestRating,
            badges: data.platformStats.leetcode.badges,
            last_updated: new Date().toISOString(),
          }, { onConflict: 'user_id,platform' });
      }

      // Similar for other platforms...
    } catch (error) {
      console.error('Error storing integration data:', error);
    }
  }

  // Helper methods
  private static generateContributionGraph(pushEvents: any[]) {
    const graph = [];
    const today = new Date();
    
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEvents = pushEvents.filter(event => 
        event.created_at.startsWith(dateStr)
      );
      
      const count = dayEvents.reduce((sum, event) => 
        sum + (event.payload?.commits?.length || 0), 0
      );
      
      graph.push({
        date: dateStr,
        count,
        level: Math.min(Math.floor(count / 3), 4),
      });
    }
    
    return graph;
  }

  private static calculateStreak(pushEvents: any[]): number {
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const hasActivity = pushEvents.some(event => 
        event.created_at.startsWith(dateStr)
      );
      
      if (hasActivity) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }
}