const script = document.createElement("script");
script.src = "https://www.youtube.com/player_api";
const firstScript = document.getElementsByTagName("script")[0];
firstScript.parentNode.insertBefore(script, firstScript);

/**
 * 複数のYoutubeを再生するための特製のクラス！
 */
const YoutubeControlManager = () => {
  let playerArr = [];
  const playerMapping = {};

  const registration = (tag, url, startSeconds, eventHandler) => {
    let playerObj = playerMapping[tag];
    if (!playerObj) {
      const indexArr = [];
      for (const _tag in playerMapping) {
        if (!playerMapping.hasOwnProperty(_tag)) continue;
        indexArr.push(playerMapping[_tag].index);
      }
      indexArr.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      let useIndex = 0;
      for (const i of indexArr) {
        if (useIndex !== i) break;
        useIndex++;
      }

      const usePlayer = playerArr[useIndex];
      if (!usePlayer) {
        alert(
          "アクティブなYoutube再生の上限を超えました。\nこの操作をキャンセルします。"
        );
        return false;
      }
      const index = playerArr.indexOf(usePlayer);
      playerObj = {
        player: usePlayer,
        index: index,
        using: true,
        eventHandler: eventHandler
      };
      playerMapping[tag] = playerObj;
    } else {
      playerObj.using = true;
      playerObj.eventHandler = eventHandler;
    }

    playerObj.player.a.parentNode.classList.remove("unUse");

    const videoId = window["getUrlParam"]("v", url);
    youtubeMethod.loadVideoById(tag, videoId, startSeconds, "small");

    return true;
  };
  const destroyed = tag => {
    let playerObj = playerMapping[tag];
    if (!playerObj) return;
    playerObj.player.a.parentNode.classList.add("unUse");
    playerObj.using = false;
    playerObj.eventHandler = {};
  };
  /**
   * ===================================================================================================================
   * サポートするYoutubeメソッド
   */
  const doPlayerMethod = (methodName, ...args) => {
    const yPlayer = playerMapping[args.shift()];
    if (!yPlayer) return;
    // window.console.qLog('doPlayerMethod', methodName, ...args)
    let result = null;
    try {
      result = yPlayer.player[methodName](...args);
    } catch (error) {
      /* Nothing */
    }
    return result;
  };
  const youtubeMethod = {
    /** IDを指定して読み込ませる */
    loadVideoById(tag, videoId, startSeconds, suggestedQuality) {
      doPlayerMethod("loadVideoById", ...arguments);

      let playerObj = playerMapping[tag];
      if (!playerObj) return;

      // 既にタイマーが張られていたら停止する
      if (playerObj.timerReload) clearTimeout(playerObj.timerReload);

      // 1500ミリ秒経っても再生できてなければRejectする
      // （通常に読み込めるときの時間は900msくらい）
      playerObj.timerReload = setTimeout(() => {
        callEventHandlerTag(tag, "onReject");
      }, 1500);
    },
    /** 再生する */
    play: tag => doPlayerMethod("playVideo", tag),
    /** 一時停止する */
    pause: tag => doPlayerMethod("pauseVideo", tag),
    /** 再生経過時間の設定 */
    seekTo: (tag, seconds, allowSeekAhead) =>
      doPlayerMethod("seekTo", tag, seconds, allowSeekAhead),
    /** ミュート設定 */
    mute: tag => doPlayerMethod("mute", tag),
    /** ミュート解除 */
    unMute: tag => doPlayerMethod("unMute", tag),
    /** ミュート状態の取得 */
    isMuted: tag => doPlayerMethod("isMuted", tag),
    /** 音量設定 */
    setVolume: (tag, volume) => doPlayerMethod("setVolume", tag, volume),
    /** 音量取得 */
    getVolume: tag => doPlayerMethod("getVolume", tag),
    /** ループ状態の設定 */
    setLoop: tag => doPlayerMethod("setLoop", tag),
    /** プレーヤーがバッファ済みの動画の割合を 0～1 の数値で取得 */
    getVideoLoadedFraction: tag =>
      doPlayerMethod("getVideoLoadedFraction", tag),
    /**
     * プレーヤーの状態の取得
     * YT.PlayerState.ENDED
     * YT.PlayerState.PLAYING
     * YT.PlayerState.PAUSED
     * YT.PlayerState.BUFFERING
     * YT.PlayerState.CUED
     */
    getPlayerState: tag => doPlayerMethod("getPlayerState", tag),
    /** 動画の再生を開始してからの経過時間を秒数で取得 */
    getCurrentTime: tag => doPlayerMethod("getCurrentTime", tag),
    /**
     * 現在の動画の実際の画質を取得
     * small
     * medium
     * large
     * hd720
     * hd1080
     * highres
     */
    getPlaybackQuality: tag => doPlayerMethod("getPlaybackQuality", tag),
    /** 現在の動画の推奨画質を設定 */
    setPlaybackQuality: tag => doPlayerMethod("setPlaybackQuality", tag),
    /** 現在の動画で有効な画質のセットを取得 */
    getAvailableQualityLevels: tag =>
      doPlayerMethod("getAvailableQualityLevels", tag),
    /** 再生中の動画の長さを秒数で取得 */
    getDuration: tag => doPlayerMethod("getDuration", tag),
    /** 読み込み済みまたは再生中の動画の YouTube.com URLを取得 */
    getVideoUrl: tag => doPlayerMethod("getVideoUrl", tag),
    /** 埋め込まれた <iframe> に対する DOM ノードを取得 */
    getIframe: tag => doPlayerMethod("getIframe", tag)
  };

  /**
   * ===================================================================================================================
   * サポートするYoutubeイベント
   */
  const getPlayerObj = index => {
    let playerObj = null;
    for (const tag in playerMapping) {
      if (!playerMapping.hasOwnProperty(tag)) continue;
      if (playerMapping[tag].player === playerArr[index]) {
        playerObj = playerMapping[tag];
        break;
      }
    }
    return playerObj;
  };
  const callEventHandler = (index, eventName, ...args) => {
    if (eventName !== "timeUpdate") {
      // window.console.qLog(`--- ${eventName} => ${index}`, ...args)
    }
    let playerObj = getPlayerObj(index);
    if (!playerObj) {
      return;
    }
    if (playerObj.eventHandler[eventName]) {
      playerObj.eventHandler[eventName](...args);
    }
  };
  const callEventHandlerTag = (tag, eventName, ...args) => {
    if (eventName !== "timeUpdate") {
      // window.console.qLog(`--- ${eventName} => ${index}`, ...args)
    }
    let playerObj = playerMapping[tag];
    if (!playerObj) {
      return;
    }
    if (playerObj.eventHandler[eventName]) {
      playerObj.eventHandler[eventName](...args);
    }
  };
  const eventHandler = {
    onReady: index => {
      callEventHandler(index, "onReady");
    },
    onEnded: index => {
      callEventHandler(index, "onEnded");
    },
    onPlaying: (index, event) => {
      try {
        let playerObj = getPlayerObj(index);
        if (!playerObj) return;

        // 既にタイマーが張られていたら停止する
        if (playerObj.timeUpdateTimer) clearInterval(playerObj.timeUpdateTimer);
        if (playerObj.timerReload) clearTimeout(playerObj.timerReload);

        // 100ミリ秒毎に現在の再生経過時間を通知する
        playerObj.timeUpdateTimer = setInterval(() => {
          callEventHandler(index, "timeUpdate", event.target.getCurrentTime());
        }, 100);
      } catch (error) {
        window.console.error(error);
      }
      callEventHandler(
        index,
        "onPlaying",
        event.target.getDuration(),
        event.target
      );
    },
    onPaused: index => {
      let playerObj = getPlayerObj(index);
      if (!playerObj) return;

      // 既にタイマーが張られていたら停止する
      if (playerObj.timeUpdateTimer) clearInterval(playerObj.timeUpdateTimer);

      callEventHandler(index, "onPaused");
    },
    onBuffering: index => {
      let playerObj = getPlayerObj(index);
      if (!playerObj) return;

      // 既にタイマーが張られていたら停止する
      if (playerObj.timeUpdateTimer) clearInterval(playerObj.timeUpdateTimer);

      callEventHandler(index, "onBuffering");
    },
    onCued: index => {
      callEventHandler(index, "onCued");
    },
    onPlaybackQualityChange: index => {
      callEventHandler(index, "onPlaybackQualityChange");
    },
    onPlaybackRateChange: index => {
      callEventHandler(index, "onPlaybackRateChange");
    },
    onError: (index, event) => {
      callEventHandler(index, "onError", event);
    },
    onApiChange: index => {
      callEventHandler(index, "onApiChange");
    }
  };

  return {
    init: () => {
      window.set_interval_id = setInterval(window.youtube.doInit, 100);
    },
    doInit: () => {
      if (window.isYoutubeInitialized) {
        clearInterval(set_interval_id);
        delete window.set_interval_id;
        delete window.isYoutubeInitialized;

        // init処理
        const ypContainer = document.getElementById("YoutubePlayerContainer");
        Array.from(ypContainer.children).forEach((elm, i) => {
          let player = new window["YT"]["Player"](elm.firstElementChild.id, {
            width: "426",
            height: "240",
            events: {
              onReady: event => eventHandler.onReady(i, event),
              onStateChange: event => {
                switch (event.data) {
                  case window["YT"]["PlayerState"]["ENDED"]:
                    eventHandler.onEnded(i, event);
                    break;
                  case window["YT"]["PlayerState"]["PLAYING"]:
                    eventHandler.onPlaying(i, event);
                    break;
                  case window["YT"]["PlayerState"]["PAUSED"]:
                    eventHandler.onPaused(i, event);
                    break;
                  case window["YT"]["PlayerState"]["BUFFERING"]:
                    eventHandler.onBuffering(i, event);
                    break;
                  case window["YT"]["PlayerState"]["CUED"]:
                    eventHandler.onCued(i, event);
                    break;
                  default:
                }
              },
              onPlaybackQualityChange: event =>
                eventHandler.onPlaybackQualityChange(i, event),
              onPlaybackRateChange: event =>
                eventHandler.onPlaybackRateChange(i, event),
              onError: event => eventHandler.onError(i, event),
              onApiChange: event => eventHandler.onApiChange(i, event)
            },
            playerVars: {
              autoplay: 0, // 0:自動再生しない or 1:自動再生
              controls: 0, // 再生ボタンとか出さない
              disablekb: 1, // ショートカットキー無効
              enablejsapi: 1, // JavaScript API 有効
              list: "search", // 検索クエリ使用
              listType: "search", // 検索クエリ使用
              loop: 1, // 0:ループしない or 1:ループする 後で再設定する
              rel: 0, // 関連動画出さない
              showinfo: 0 // 動画名とか出さない
            }
          });
          playerArr.push(player);
        });
      }
    },
    play: youtubeMethod.play,
    pause: youtubeMethod.pause,
    seekTo: youtubeMethod.seekTo,
    mute: youtubeMethod.mute,
    unMute: youtubeMethod.unMute,
    isMuted: youtubeMethod.isMuted,
    setVolume: youtubeMethod.setVolume,
    getVolume: youtubeMethod.getVolume,
    setLoop: youtubeMethod.setLoop,
    getVideoLoadedFraction: youtubeMethod.getVideoLoadedFraction,
    getPlayerState: youtubeMethod.getPlayerState,
    getCurrentTime: youtubeMethod.getCurrentTime,
    getPlaybackQuality: youtubeMethod.getPlaybackQuality,
    setPlaybackQuality: youtubeMethod.setPlaybackQuality,
    getAvailableQualityLevels: youtubeMethod.getAvailableQualityLevels,
    getDuration: youtubeMethod.getDuration,
    getVideoUrl: youtubeMethod.getVideoUrl,
    getIframe: youtubeMethod.getIframe,
    registration: registration,
    destroyed: destroyed
  };
};
window.youtube = YoutubeControlManager();
window.isYoutubeInitialized = false;
window.onYouTubeIframeAPIReady = () => {
  window.isYoutubeInitialized = true;
  // window.youtube.init();
};
let set_interval_id = null;
