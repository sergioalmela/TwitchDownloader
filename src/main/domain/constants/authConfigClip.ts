import { IdVo } from '../valueObjects/id.vo'

const authConfigClip = (id: IdVo): object => {
  return {
    operationName: 'VideoAccessToken_Clip',
    variables: {
      slug: id.value.toString()
    },
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash: '36b89d2507fce29e5ca551df756d27c1cfe079e2609642b4390aa4c35796eb11'
      }
    }
  }
}

export {
  authConfigClip
}
