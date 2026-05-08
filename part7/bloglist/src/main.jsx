import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import { NotificationProvider } from './context/NotificationContext'
import { UserProvider } from './context/UserContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <UserProvider>
          <Router>
            <App />
          </Router>
        </UserProvider>
      </NotificationProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
