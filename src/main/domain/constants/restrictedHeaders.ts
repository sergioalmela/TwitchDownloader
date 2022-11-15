const restrictedHeaders = (): object => {
    return {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            Accept: '"application/vnd.twitchtv.v5+json',
            'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
        }
    }
}

export {
    restrictedHeaders
}
