export class FetchFeedErrorException extends Error {
    constructor () {
        super('Error fetching feeds')
    }
}
