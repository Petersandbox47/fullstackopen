import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as anecdoteService from '../services/anecdotes'

// Exercise 6.19: custom hook encapsulating React Query logic
export const useAnecdotes = () => {
  return useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    retry: 1,
  })
}

export const useCreateAnecdote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: anecdoteService.create,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })
}

export const useVoteAnecdote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: anecdoteService.vote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })
}

export const useDeleteAnecdote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: anecdoteService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })
}
