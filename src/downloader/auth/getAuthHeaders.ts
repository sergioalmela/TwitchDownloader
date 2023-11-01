type AuthHeaders = {
    headers: {
        'Content-Type': string
        'Client-ID': string
    }
}

export const getAuthHeaders = (): AuthHeaders => {
    return {
        headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
            'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
        }
    }
}