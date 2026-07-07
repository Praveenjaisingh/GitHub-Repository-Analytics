import { useQuery } from '@tanstack/react-query';
import { RepositoryAPI, BookmarkAPI } from '../services/api';

export const useSearchRepositories = (q, page) =>
  useQuery({
    queryKey: ['search', q, page],
    queryFn: () => RepositoryAPI.search(q, page),
    enabled: !!q,
    staleTime: 60_000,
  });

export const useRepositoryOverview = (owner, repo) =>
  useQuery({
    queryKey: ['overview', owner, repo],
    queryFn: () => RepositoryAPI.overview(owner, repo),
    enabled: !!owner && !!repo,
  });

export const useRepositoryLanguages = (owner, repo) =>
  useQuery({
    queryKey: ['languages', owner, repo],
    queryFn: () => RepositoryAPI.languages(owner, repo),
    enabled: !!owner && !!repo,
  });

export const useRepositoryContributors = (owner, repo) =>
  useQuery({
    queryKey: ['contributors', owner, repo],
    queryFn: () => RepositoryAPI.contributors(owner, repo),
    enabled: !!owner && !!repo,
  });

export const useRepositoryCommits = (owner, repo) =>
  useQuery({
    queryKey: ['commits', owner, repo],
    queryFn: () => RepositoryAPI.commits(owner, repo),
    enabled: !!owner && !!repo,
  });

export const useRepositoryIssues = (owner, repo) =>
  useQuery({
    queryKey: ['issues', owner, repo],
    queryFn: () => RepositoryAPI.issues(owner, repo),
    enabled: !!owner && !!repo,
  });

export const useRepositoryPulls = (owner, repo) =>
  useQuery({
    queryKey: ['pulls', owner, repo],
    queryFn: () => RepositoryAPI.pulls(owner, repo),
    enabled: !!owner && !!repo,
  });

export const useRepositoryReleases = (owner, repo) =>
  useQuery({
    queryKey: ['releases', owner, repo],
    queryFn: () => RepositoryAPI.releases(owner, repo),
    enabled: !!owner && !!repo,
  });

export const useRepositoryHealth = (owner, repo) =>
  useQuery({
    queryKey: ['health', owner, repo],
    queryFn: () => RepositoryAPI.health(owner, repo),
    enabled: !!owner && !!repo,
  });

export const useBookmarks = (enabled) =>
  useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => BookmarkAPI.list(),
    enabled,
  });
