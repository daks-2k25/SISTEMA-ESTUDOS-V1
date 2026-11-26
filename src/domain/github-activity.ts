export interface GithubRepository {
  name: string;
  url: string;
  language: string | null;
  pushedAt: string;
}

export interface GithubPush {
  createdAt: string;
  commits: number;
}

export interface GithubActivity {
  username: string;
  avatarUrl: string;
  profileUrl: string;
  repositories: GithubRepository[];
  pushes: GithubPush[];
}

export interface GithubActivityProvider {
  fetchActivity(): Promise<GithubActivity | null>;
}
