const { test, expect, beforeEach, describe } = require('@playwright/test')

const BASE_URL = 'http://localhost:5173'
const API_URL = 'http://localhost:3003'

// Helper: login via API and set token in localStorage
const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

// Helper: create a blog via API
const createBlog = async (request, token, blog) => {
  await request.post(`${API_URL}/api/blogs`, {
    data: blog,
    headers: { Authorization: `Bearer ${token}` },
  })
}

describe('Blog app', () => {
  beforeEach(async ({ request, page }) => {
    // Reset database
    await request.post(`${API_URL}/api/testing/reset`)

    // Create test user
    await request.post(`${API_URL}/api/users`, {
      data: { username: 'testuser', name: 'Test User', password: 'password123' },
    })

    await page.goto(BASE_URL)
  })

  // Exercise 5.17: login form shown by default
  test('login form is shown by default', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  // Exercise 5.18: login tests
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'password123')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrongpassword')
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  // Exercise 5.19: logged-in user can create a blog
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'password123')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('blog title').fill('A New E2E Blog')
      await page.getByPlaceholder('author').fill('E2E Author')
      await page.getByPlaceholder('url').fill('https://e2e.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('A New E2E Blog E2E Author')).toBeVisible()
    })

    // Exercise 5.20: a blog can be liked
    test('a blog can be liked', async ({ request, page }) => {
      // Get token for API call
      const loginRes = await request.post(`${API_URL}/api/login`, {
        data: { username: 'testuser', password: 'password123' },
      })
      const { token } = await loginRes.json()

      await createBlog(request, token, {
        title: 'Blog to like',
        author: 'Author',
        url: 'https://like.com',
      })
      await page.reload()

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    // Exercise 5.21: blog creator can delete the blog
    test('blog creator can delete their blog', async ({ request, page }) => {
      const loginRes = await request.post(`${API_URL}/api/login`, {
        data: { username: 'testuser', password: 'password123' },
      })
      const { token } = await loginRes.json()

      await createBlog(request, token, {
        title: 'Blog to delete',
        author: 'Author',
        url: 'https://delete.com',
      })
      await page.reload()

      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', (dialog) => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('Blog to delete')).not.toBeVisible()
    })

    // Exercise 5.22: only creator can see the delete button
    test('only creator sees the delete button', async ({ request, page }) => {
      // Create second user
      await request.post(`${API_URL}/api/users`, {
        data: { username: 'otheruser', name: 'Other User', password: 'password123' },
      })

      // Create blog as testuser
      const loginRes = await request.post(`${API_URL}/api/login`, {
        data: { username: 'testuser', password: 'password123' },
      })
      const { token } = await loginRes.json()
      await createBlog(request, token, {
        title: 'Owners blog',
        author: 'Author',
        url: 'https://owner.com',
      })

      // Log in as otheruser
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'otheruser', 'password123')

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    // Exercise 5.23: blogs are ordered by likes (most likes first)
    test('blogs are ordered by likes in descending order', async ({ request, page }) => {
      const loginRes = await request.post(`${API_URL}/api/login`, {
        data: { username: 'testuser', password: 'password123' },
      })
      const { token } = await loginRes.json()

      // Create 3 blogs
      const blog1 = await (await request.post(`${API_URL}/api/blogs`, {
        data: { title: 'First Blog', author: 'A', url: 'https://a.com', likes: 1 },
        headers: { Authorization: `Bearer ${token}` },
      })).json()

      const blog2 = await (await request.post(`${API_URL}/api/blogs`, {
        data: { title: 'Second Blog', author: 'B', url: 'https://b.com', likes: 10 },
        headers: { Authorization: `Bearer ${token}` },
      })).json()

      await request.post(`${API_URL}/api/blogs`, {
        data: { title: 'Third Blog', author: 'C', url: 'https://c.com', likes: 5 },
        headers: { Authorization: `Bearer ${token}` },
      })

      await page.reload()

      const blogItems = page.locator('[style*="border"]')
      await expect(blogItems.nth(0)).toContainText('Second Blog')
      await expect(blogItems.nth(1)).toContainText('Third Blog')
      await expect(blogItems.nth(2)).toContainText('First Blog')
    })
  })
})
