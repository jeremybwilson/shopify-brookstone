module.exports = (function() {
  const Vimeo = require('@vimeo/player');
  const YouTubeIframeLoader = require('youtube-iframe');

  window.Shopify.Product.videoState = { activeId: null }; // RESET STATE : Event emitter can't see module state, global state ensures 1 video plays at a time



  // INIT : Any videos to generate? (none found = 0 length, thus false)
  function init( events ) {
    const $vimeoThumbs = document.querySelectorAll( '.vimeo-thumbnail' );
    const $youtubeThumbs = document.querySelectorAll( '.youtube-thumbnail' );
    const $vimeoMobileSlides = document.querySelectorAll( '.vimeo-mobile' );
    const $youtubeMobileSlides = document.querySelectorAll( '.youtube-mobile' );

    // CHECK : Should we even run?
    if ( !$vimeoThumbs.length && !$youtubeThumbs.length ) {
      return false;
    
    // YES : Initalize video setup
    } else {

      // VIMEO : Build any Vimeo Elements (don't link with 'else' in case both types present)
      if ( $vimeoThumbs.length > 0 || $vimeoMobileSlides.length > 0 ) {
        $vimeoThumbs.forEach( thumb => {
          vimeoPlayer( thumb, false );
        });

        $vimeoMobileSlides.forEach( slide => {
          vimeoPlayer( slide, true );
        });
      }

      // YOUTUBE : Build any YT Elements
      if ( $youtubeThumbs.length > 0 || $youtubeMobileSlides.length > 0 ) {
        $youtubeThumbs.forEach( thumb => {
          youtubePlayer( thumb, false );
        });

        $youtubeMobileSlides.forEach( slide => {
          youtubePlayer( slide, true );
        });
      }

      // EVENTS : Attach thumbnail event listener
      events.on( 'thumbnail:click', playOnThumbSelect );
      events.on( 'productVideo:pauseAll', updateVideoStates );
    }
  }


  // PLAYER - VIMEO : Player for Vimeo type videos
  function vimeoPlayer( thumb, isMobile = false ) {
    const videoId = thumb.getAttribute( 'data-video-id' );
    const stateId = isMobile ? videoId + '-mobile' : videoId;

    // FETCH : THUMBNAIL IMG : Vimeo requires fetching thumbnail img url (Mobile Gallery displays the video player as thumb, so it skips for mobile)
    if ( !isMobile ) {
      $.ajax({
        type:'GET',
        url: 'https://vimeo.com/api/oembed.json?url=https://www.vimeo.com/' + videoId,
        dataType: 'json',
        error: function(xhr, error) {
          console.log( `ERROR : [ ProductVideos.js - vimeoPlayer() ] -- Failed to fetch Vimeo thumbnail.\n  ERROR MSG: ${error}\n  ERROR XHR: ${xhr}` );
        },
        success: function(data){
          thumb.setAttribute( 'src', data.thumbnail_url );
        }
      });
    }

    // BUILD : PLAYER : Create vimeo player itself now
    const playerDomNodeId = isMobile ? `mobile-product-video--vimeo-${ videoId }` : `product-video--vimeo-${ videoId }`;
    const player = new Vimeo( playerDomNodeId, { id: videoId, width: 850 } );

    // STATE : UPDATE : Add new state object for video, using ID as key
    window.Shopify.Product.videoState[ stateId ] = {
      player,
      playing: false,
      type: 'vimeo'
    }
  }; 


  // PLAYER - YOUTUBE : Player for youtube type urls
  function youtubePlayer( thumb, isMobile ) {
    const videoId = thumb.getAttribute( 'data-video-id' );
    const stateId = isMobile ? videoId + '-mobile' : videoId;

    // THUMB IMG : Create thumbnail img if not mobile (Mobile slide uses player as its image)
    if ( !isMobile ) {
      const thumbUrl = thumb.getAttribute( 'data-src' );
      thumb.setAttribute( 'src', thumbUrl ); // Youtube videos use ID in url so building thumb without fetch is possible
    }
    
    // BUILD : PLAYER : Create youtube player for video element (hidden until thumb is clicked)
    const playerDomNodeId = isMobile ? `mobile-product-video--youtube-${ videoId }` : `product-video--youtube-${ videoId }`;
    YouTubeIframeLoader.load( YT => {
      const player = new YT.Player( playerDomNodeId, {
        width: '850',
        height: '480',
        playerVars: {
          rel: 0,
          showinfo: 0,
          modestbranding: 0,
          origin: window.location.protocol + window.location.hostname
        },
        videoId: videoId
      });

      // STATE : UPDATE : Add new state object for video, using ID as key
      window.Shopify.Product.videoState[ stateId ] = {
        player,
        playing: false,
        type: 'youtube'
      }
    });
  };


  // UTIL : VIDEO STATE UPDATE : Pause All / Update video state (Pause all when non-video selected)
  function updateVideoStates( passedId, passedPlayState ) {
    const state = window.Shopify.Product.videoState;

    // UPDATE : Set new playing state on passed ID's video object
    if ( passedId && typeof passedPlayState !== 'undefined' ) {
      window.Shopify.Product.videoState[ passedId ].playing = passedPlayState;
      state.activeId = passedId; // set active video as latest one passed in
    }

    // PAUSE ALL (Except passed in one, let it manage its own changing state)
    for ( var id in state ) {
      if ( id !== passedId && id !== 'activeId' ) {
        const { player, type } = state[ id ];

        // PAUSE ALL INACTIVE : Wrapped in try because youtube throws errors on inital load when not ready 
        try {
          if ( type === 'vimeo' ) {
            player.pause();
          } else {
              player.pauseVideo();
          }
        }
        catch(err) {
          console.log( 'Video cleared from dom, skipping pause action.');
        }
        
        
        window.Shopify.Product.videoState[ id ].playing = false;
      }
    }
  }


  // THUMBNAIL : CONTROLS : Reveals and plays video for selected video thumbnail
  function playOnThumbSelect( id ) {
    const state = window.Shopify.Product.videoState;
    const videoObj = state[ id ];

    // CHECK : Is ID a video thumbnail?
    if ( videoObj ) {
      const { player, playing, type } = videoObj;

      // PLAY : Trigger video playback on thumb selection
      if ( !playing ) {

        // TRIGGER : PLAY
        if ( type === 'vimeo' ) {
          player.play();
        
        } else {
          player.playVideo();
        }

      // PAUSE : User clicks same thumb, pause the video
      } else {

        // TRIGGER : PAUSE
        if ( type === 'vimeo' ) {
          player.pause();
        
        } else {
          player.pauseVideo();
        }
      }

      // UPDATE : Set new playback state and pause all other videos if any are playing
      updateVideoStates( id, !playing );

    // NOT VIDEO THUMB : Pause all videos just to be safe
    } else {
      updateVideoStates();
    }
  };


  // PUBLIC METHODS
  return {
    init
  }
})();