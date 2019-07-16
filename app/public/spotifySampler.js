(function() {

  function refreshToken() {
    $.ajax({
      url: '/refresh_token',
      data: {
        'refresh_token': refresh_token
      }
    }).done(function(data) {
      access_token = data.access_token;
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });
    });
  }

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  function composePlaylist(access_token, user_id) {

    // Note: Only 100 songs can be added at a time.
    function addSongs(playlistID) {
      var chosenSongs = new Set([])
      var songsToAdd = []
      var songsArray = [...songsSet]

      for (var i = 0; i < 100; i++) {
        // Randomly pick a value between 0 and sizeof set - 1
        var randomPos = Math.floor(Math.random() * songsSet.size);

        while (chosenSongs.has(randomPos)) {
          randomPos = Math.floor(Math.random() * songsSet.size);
        }

        chosenSongs.add(randomPos);
        songsToAdd.push("spotify:track:" + songsArray[randomPos]);
      }

      // Post to new playlist...
      $.ajax({
          url: "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks",
          type: "POST",
          data: JSON.stringify({
            "uris": songsToAdd
          }),
          headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': "application/json"
          },
          success: function(response) {
            alert("Playlist created and songs added!")
          }
      });

    }

    $.ajax({
        url: "https://api.spotify.com/v1/users/" + user_id + "/playlists",
        type: "POST",
        data: JSON.stringify({
          name: "Composition Playlist"
        }),
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          // Add songs to playlist
          var newPlaylistId = response.id;
          addSongs(newPlaylistId);
        }
    });
  }

  /**
    * Main function of this project. Returns 10,000 songs that should
    * go into a new playlist, sampled via the users songs JOINed with
    * all songs from playlists the user follows
    * @return Array[SongIDs]
    */
  function generatePlaylist(access_token) {
    songsSet = new Set([]);

    function requestTracks(loc, storeSet) {
      $.ajax({
          url: loc,
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            console.log("Tracks...");
            console.log(response)

            // Add tracks to the set
            for (item of response.items) {
              storeSet.add(item.track.id)
            }

            // Update songs counter on front-end...
            document.getElementById("numSongsFound").innerHTML = storeSet.size

            // Check if there are other tracks
            if (response.next !== null) {
              requestTracks(response.next, storeSet);
            }
          }
      });

    }

    function genPlaylistHelper(loc) {
      $.ajax({
          url: loc,
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            console.log("Playlists...");
            console.log(response)

            // Get songs from each playlist...
            for (var item of response.items) {
              // Request the tracks and put them in songsSet
              requestTracks(item.tracks.href, songsSet);
            }
            // Check for more playlists...
            if (response.next !== null) {
              // Spotify imposes a rate limit on API calls. Delay querying the
              // next playlist slightly.
              setTimeout(function() {
                genPlaylistHelper(response.next);
              }, 2000);
            }
          }
      });
    }


    genPlaylistHelper('https://api.spotify.com/v1/me/playlists')
  }

  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
      userProfileTemplate = Handlebars.compile(userProfileSource),
      userProfilePlaceholder = document.getElementById('user-profile');

  var oauthSource = document.getElementById('oauth-template').innerHTML,
      oauthTemplate = Handlebars.compile(oauthSource),
      oauthPlaceholder = document.getElementById('oauth');

  var params = getHashParams();

  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  var user_id = null;

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      // render oauth info
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });

      $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            userProfilePlaceholder.innerHTML = userProfileTemplate(response);

            user_id = response.id;

            $('#login').hide();
            $('#loggedin').show();
          }
      });

      generatePlaylist(access_token);
    } else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }

    document.getElementById('obtain-new-token').addEventListener('click', refreshToken, false);


    document.getElementById("composeButton").addEventListener('click', function() {
      composePlaylist(access_token, user_id )
    });

  }
})();
