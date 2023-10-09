import { useQuery } from '@tanstack/react-query';
import api from '../api';

export function useGithubProject(name: string, page: number = 1, pageSize: number = 30) {
  return useQuery(
    ['useGithubProject', name, page],
    ({ signal }) => {
      if (name) {
        return api
        .get(`https://api.github.com/search/repositories?q=${name}&page=${page}&per_page=${pageSize}`)
        .then((response) => response.data)
      } else {
        return Promise.resolve({})
      }
    },
    { keepPreviousData: true }
  );
}
