(function(){
  function SongPlayer(Fixtures) {
    var SongPlayer = {};

    /**
    * @desc stores album information inside currentAlbum
    */
    var currentAlbum = Fixtures.getAlbum();

    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;

    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) {
      if (currentBuzzObject) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      SongPlayer.currentSong = song;
    };

    /**
    * @function playSong
    * @desc starts playing current song and sets song.playing to true
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    }

    /**
    * @function getSongIndex
    * @desc returns the index of the song in currentAlbum.songs array
    */
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    }

    /**
    * @desc Active song object from list of songs
    * @type {Object}
    */
    SongPlayer.currentSong = null;

    /**
    * @function SongPlayer.play
    * @desc if SongPlayer.currentSong is not the song selected, setSong to the song selected...
    * then play song.
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong === song) {
        if (currentBuzzObject.isPaused()) {
          playSong(song);
        }
      }
    };

    /**
    * @function SongPlayer.pause
    * @desc pause currentBuzzObject and set song.playing to false
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    /**
    * @function SongPlayer.previous
    * @desc find the currentSongIndex and then decrease index by one... if index is less than 0 stop song.
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    return SongPlayer;
  };

  angular
    .module('blocJams')
    .factory('SongPlayer', SongPlayer);
})();
