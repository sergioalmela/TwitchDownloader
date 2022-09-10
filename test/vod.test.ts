import { assert, describe, expect, it } from 'vitest'

describe('VOD', () => {
  // TODO: Auth method should not live inside vodcontroller
  const vodController = require('../dist/src/main/vod/vod.controller')
  const VodController = new vodController()
  const auth = VodController.getAuth(true)

  it('Auth should return an object', () => {
    expect(auth).toBeTypeOf('object')
  })

  it('Auth should return two properties', () => {
    expect(auth).toHaveProperty('signature')
    expect(auth).toHaveProperty('value')
  })
})
