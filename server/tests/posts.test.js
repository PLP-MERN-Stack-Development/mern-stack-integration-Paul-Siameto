const request = require('supertest')
const app = require('../server')

describe('GET /api/posts', () => {
  it('should return 200 and JSON', async () => {
    const res = await request(app).get('/api/posts')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('success')
    expect(res.body.success).toBe(true)
  })
})
