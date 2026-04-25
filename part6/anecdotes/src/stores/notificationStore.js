import { create } from 'zustand'

// Exercise 6.10: notification store
const useNotificationStore = create((set) => ({
  message: null,

  showNotification: (message, seconds = 5) => {
    set({ message })
    setTimeout(() => set({ message: null }), seconds * 1000)
  },

  clearNotification: () => set({ message: null }),
}))

export default useNotificationStore
