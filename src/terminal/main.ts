// Terminal options to download content from Twitch (No GUI)

const input = require("prompt-sync")({ sigint: true })

while (true) {
    let menuResponse = input("Menu:\nStreams:\n1. Get a live stream link (get the M3U8 stream link of a live stream).\n2. Download a stream live. (Currently unavailable, coming in the beta)\n\nVODs:\n3. Get the link to a VOD (including sub-only).\n4. Download a VOD (including sub-only).\n5. Recover a VOD - 60 days maximum (can be less in rare cases).\n\nHighlights:\n6. Retrieve the link to a highlight.\n7. Download a highlight.\n8. Recover a highlight.\n\nVideos:\n9. Check if a VOD/highlight has muted segments.\n10. 'Unmute' a VOD/highlight (be able to view the muted segments of the M3U8).\n11. Download an M3U8 file.\n12. Convert a TS file to MP4.\n\nClips:\n13. Retrieve permanent link of a clip - never deleted.\n14. Download a clip.\n15. Recover ALL clips from a stream - NO time limit.\n\nMass options: (Currently unavailable, coming in the beta)\n16. Mass recover options. (Currently unavailable, coming in the beta)\n17. Mass download options. (Currently unavailable, coming in the beta)\nPlease enter the number of the option you want to select (number between 1-17 inclusive): ")

    switch (parseInt(menuResponse)) {
        case 4: downloadVod()
        default: invalidResponse()
    }

    function downloadVod() {
        input("Enter the Twitch video URL: ")

        // Download VOD from Twitch
        const vodController = require('../main/vod/vod.controller')
        const VodController = new vodController()

        // Parse and sanitize URL first to get the ID, the we should make auth validation
        VodController.getVod()
    }

    function invalidResponse() {
        input('Please, enter a valid option from above: ')
    }
}