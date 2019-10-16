# spotify-playlist-sampler
[![Total alerts](https://img.shields.io/lgtm/alerts/g/JosiahOne/spotify-playlist-sampler.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/JosiahOne/spotify-playlist-sampler/alerts/)
[![Docker Automated build](https://img.shields.io/docker/automated/jsbruner/www.svg)](https://hub.docker.com/r/jsbruner/spotify-playlist-sampler/)
[![Docker Build Status](https://img.shields.io/docker/build/jsbruner/www.svg)](https://hub.docker.com/r/jsbruner/spotify-playlist-sampler/)

*Try it out*: https://spotify.josiahbruner.com

Creates a playlist sampled from all songs in your library AND in playlists you follow.

## Installation and Running Locally
0. Register a new spotify app on the dashboard: https://developer.spotify.com/dashboard/login
1. Clone the repo
2. Install npm
3. Install npm dependencies using npm install
4. Set spotify environment variables:
    1. `export SPOTIFY_CLIENT_ID=<ID>`
    2. `export SPOTIFY_CLIENT_SECRET=<SECRET>`
    3. `export SPOTIFY_REDIRECT_URI=<URI>`
5. Run using: `node app/app.js`
6. Navigate to 0.0.0.0:8888 in your browser.
