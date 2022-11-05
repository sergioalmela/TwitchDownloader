import { assert, describe, expect, it } from 'vitest'

describe('VOD', async () => {
  // TODO: Auth method should not live inside vodcontroller, move handler to another suite
  const url = 'https://www.twitch.tv/videos/399977242'
  const vodController = require('../dist/src/main/vod/vod.controller')
  const VodController = new vodController()

  const handler = require('../dist/src/main/twitch/handler.controller')
  const id = handler.parseUrl(url)

  const auth = await VodController.getAuth(id, true)

  it('Auth should return an object', () => {
    expect(auth).toBeTypeOf('object')
  })

  it('Auth should return two properties', () => {
    expect(auth).toHaveProperty('signature')
    expect(auth).toHaveProperty('value')
  })

  it('Parser should return ID', () => {
    expect(id).toBeTypeOf('string')
    expect(id).toBe('399977242')
  })
})
