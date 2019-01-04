// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from "vue";
import Vuex from "vuex";
import Peer from "skyway-js";
import { quoridornLog } from "@/components/common/Utility";

Vue.use(Vuex);

/**
 * Store
 */
export default {
  actions: {
    /** ========================================================================
     * WebRTCでPeer接続し、Roomにも接続する
     */
    createPeer(
      {
        rootState,
        dispatch,
        rootGetters
      }: { rootState: any; dispatch: any; rootGetters: any },
      {
        peerId,
        roomName,
        roomPassword,
        playerName,
        playerPassword,
        playerType,
        resolved,
        rejected
      }: {
        peerId: string;
        roomName: string;
        roomPassword: string;
        playerName: string;
        playerPassword: string;
        playerType: string;
        resolved: Function;
        rejected: Function;
      }
    ) {
      if (!roomName) {
        window.console.error(`部屋名は必須項目です。`);
        alert(`部屋名は必須項目です。`);
        rejected.call(null);
        return;
      }
      quoridornLog(`Peer接続開始 => PeerId: ${peerId}`);

      // peer接続作成
      let peer: any = null;
      try {
        peer = new Peer(peerId, { key: __SKYWAY_KEY__, debug: 1 });
      } catch (err) {
        alert(
          "__SKYWAY_KEY__の設定を見直してください。\n現在の値：" +
            __SKYWAY_KEY__
        );
        rejected.call(null);
        return;
      }

      // 既にPeer接続していたら、その接続は破棄する
      if (rootGetters.webRtcPeer && !rootGetters.webRtcPeer.destroyed) {
        rootGetters.webRtcPeer.destroy();
        dispatch("setProperty", {
          property: "room.webRtcRoom",
          value: null,
          logOff: true
        });
      }
      rootState.self.webRtcPeer = peer;

      // 画面が閉じられたらPeer接続を破棄
      window.onunload = window.onbeforeunload = () => {
        // マップ編集中のロックを解除
        if (rootGetters.isMapEditing === rootGetters.peerId) {
          dispatch("setProperty", {
            property: "public.map.isEditting",
            isNotice: true,
            value: null,
            logOff: true
          });
        }
        if (peer && !peer.destroyed) {
          peer.destroy();
        }
      };

      /* ------------------------------
       * エラーハンドリング
       */
      peer.on("error", (err: any) => {
        if (err.message.indexOf("is already in use") > 0) {
          window.console.error(err.message);
          window.console.error(err);
          alert(
            `接続に失敗しました。\npeerId:${peerId}は既に使われています。\n異なるpeerIdを指定してください。`
          );
          rejected.call(null);
          return;
        }

        if (err.message.indexOf("Please make sure the peerId is correct") > 0) {
          // 切断済みの相手に対するSkyWayAPIの内部的な処理によるエラーのため無視する
          window.console.log(err.message);
          return;
        }

        // その他エラー
        window.console.error(err.message);
        window.console.error(err);
        rejected.call(null);
        alert(
          `接続に失敗しました。\n原因は以下のメッセージを参考にしてください。\n${
            err.message
          }`
        );
      });

      /* ------------------------------
       * Peer接続成功時
       */
      peer.on("open", (peerId: string) => {
        quoridornLog(`Peer接続成功 => PeerId: ${peerId}`);
        // セーブデータからの復元の場合は既にpeerIdが格納されている
        if (rootGetters.peerId !== peerId) {
          dispatch("setProperty", {
            property: "private.self.peerId",
            value: peerId,
            logOff: true
          });
          dispatch("setProperty", {
            property: "public.room.password",
            value: rootGetters.playerPassword,
            logOff: true
          });
          dispatch("addPlayer", {
            peerId: peerId,
            name: playerName,
            password: playerPassword,
            type: playerType,
            color: "#000000"
          });
        }
        quoridornLog(`Room接続開始 => Room: ${roomName}`);
        const room = rootGetters.webRtcPeer.joinRoom(roomName);

        /* ------------------------------
         * Room接続成功時
         */
        room.on("open", () => {
          quoridornLog(`Room接続成功 => Room: ${roomName}`);
          rootState.room.webRtcRoom = room;

          const logName = "SYSTEM";
          const logColor = "red";
          const logTab = "メイン";

          dispatch("setProperty", {
            property: "public.room.name",
            value: roomName,
            logOff: true
          });

          dispatch("windowOpen", "private.display.playerBoxWindow");

          /* ------------------------------
           * 誰かが入室してきた場合
           */
          room.on("peerJoin", (peerId: string) => {
            quoridornLog(`入室を感知 => peerId: ${peerId}`);
            // 自分が親だったら、入ってきた人に部屋情報を教えてあげる
            if (rootGetters.members[0].peerId === rootGetters.peerId) {
              dispatch("sendRoomData", {
                type: "NOTICE_ROOM_INFO",
                value: rootState.public,
                targets: [peerId]
              });
            }
          });

          /* ------------------------------
           * 誰かが退室した場合
           */
          room.on("peerLeave", (peerId: string) => {
            quoridornLog(`退室を感知 => peerId: ${peerId}`);
            // quoridornLog(peerId, rootState.public.room.members)
            const index = rootGetters.members.findIndex(
              (member: any) => member.peerId === peerId
            );
            if (index < 0) return;

            // メンバーリストから削除する
            const member = rootGetters.members.splice(index, 1)[0];
            const player = rootGetters.playerList.filter(
              (p: any) => p.key === member.playerKey
            )[0];
            dispatch("addChatLog", {
              name: logName,
              text: `${player.name}(${peerId}) が退室しました。`,
              color: logColor,
              tab: logTab,
              owner: "SYSTEM"
            });
          });

          /* ------------------------------
           * 誰かがデータを送信した場合
           */
          room.on("data", (message: any) => {
            const fromPeerId = message.src;

            // ターゲットでなければ処理しない
            const targets = message.data.targets;
            if (
              targets &&
              targets.findIndex(
                (target: string) => target === rootGetters.peerId
              ) === -1
            ) {
              return;
            }

            const type: string = message.data.type;
            const value: any = message.data.value;
            const method: string = message.data.method;

            // ログ出力
            if (type === "DO_METHOD") {
              quoridornLog(
                `RoomData受信 => TYPE: ${type}, METHOD: ${method}, VALUE:`,
                value
              );
            } else {
              quoridornLog(`RoomData受信 => TYPE: ${type}, VALUE:`, value);
            }

            // 通信内容に従って処理する
            switch (type) {
              /* ------------------------------
               * ルームメンバーの情報を受け取ったとき
               */
              case "NOTICE_ROOM_INFO": {
                // 部屋パスワードチェック
                if (value.room.password !== roomPassword) {
                  alert("部屋パスワードエラー");
                  window.console.log(
                    "部屋パスワードエラー",
                    value.room.password,
                    roomPassword
                  );
                  rejected.call(null);
                  dispatch("logout");
                  break;
                }
                const myPlayer = value.player.list.filter(
                  (p: any) => p.name === playerName
                )[0];
                if (myPlayer) {
                  // 同名プレイヤーが既に部屋にいる場合

                  // プレイヤーパスワードチェック
                  if (myPlayer.password !== playerPassword) {
                    alert("プレイヤーパスワードエラー");
                    window.console.log(
                      "プレイヤーパスワードエラー",
                      myPlayer.pass,
                      playerPassword
                    );
                    rejected.call(null);
                    dispatch("logout");
                    break;
                  }
                }

                // ここまでで入室チェック済み
                resolved.call(null);

                // 受け取ったpublic情報でローカルを更新する
                rootState.public = value;

                // プレイヤー情報を入力してもらう
                dispatch("setProperty", {
                  property: "private.display.inputPlayerInfoWindow",
                  value: {
                    peerId: peerId,
                    roomName: roomName,
                    playerName: playerName,
                    playerPassword: playerPassword,
                    playerType: playerType
                  },
                  logOff: true
                });
                dispatch("windowOpen", "private.display.inputPlayerInfoWindow");
                break;
              }
              /* ------------------------------
               * ルームメンバーの自己紹介を受け取ったとき
               */
              case "NOTICE_NEW_MEMBER": {
                // Player追加
                dispatch("addPlayer", {
                  peerId: fromPeerId,
                  name: value.name,
                  password: value.password,
                  type: value.type,
                  color: value.color
                });

                // チャットログ
                dispatch("addChatLog", {
                  name: logName,
                  text: `${value.name}(${fromPeerId}) が入室しました。`,
                  color: logColor,
                  tab: logTab,
                  owner: "SYSTEM"
                });
                break;
              }
              /* ------------------------------
               * privateデータの要求を受けたとき
               */
              case "REQUEST_PRIVATE_DATA": {
                dispatch("sendRoomData", {
                  type: "SEND_PRIVATE_DATA",
                  value: rootState.private,
                  targets: [fromPeerId]
                });
                break;
              }
              /* ------------------------------
               * privateデータの要求を受けたとき
               */
              case "SEND_PRIVATE_DATA": {
                rootState.volatileSaveData.members.push(value);
                if (
                  rootState.volatileSaveData.members.length ===
                  rootGetters.members.length
                ) {
                  dispatch("doExport");
                }
                break;
              }
              /* ------------------------------
               * 親によるDO_METHODの発令要請を受けた時
               */
              case "NOTICE_OPERATION": {
                // 自分が親だったら、この通知を処理して、ルームメンバーに土管する
                if (rootGetters.members[0].peerId === rootGetters.peerId) {
                  dispatch("sendRoomData", {
                    type: "DO_METHOD",
                    value: value,
                    method: method
                  });
                  dispatch(method, value);
                }
                break;
              }
              /* ------------------------------
               * 画面操作を受け取ったとき
               */
              case "DO_METHOD": {
                delete value.isNotice;
                dispatch(method, value);
                break;
              }
              /* ------------------------------
               * 入力中の通知を受けたとき
               */
              case "NOTICE_INPUT": {
                dispatch("noticeInput", value);
                break;
              }
              default:
            }
          });
        });
      });
    },
    joinPlayer(
      { dispatch }: { dispatch: Function; },
      {
        peerId,
        roomName,
        playerName,
        playerPassword,
        playerType
      }: {
        peerId: string;
        roomName: string;
        playerName: string;
        playerPassword: string;
        playerType: string;
      }
    ) {
      // プレイヤーを追加する
      dispatch("addPlayer", {
        peerId: peerId,
        name: playerName,
        password: playerPassword,
        type: playerType,
        color: "#000000"
      });

      quoridornLog(
        `Room: ${roomName} のルームメンバーとして認識されました。`
      );

      const logName = "SYSTEM";
      const logColor = "red";
      const logTab = "メイン";

      // チャット追加
      dispatch("addChatLog", {
        name: logName,
        text: `Room: ${roomName} に接続しました！！`,
        color: logColor,
        tab: logTab,
        owner: "SYSTEM"
      });

      // ルームメンバーに自己紹介する
      dispatch("sendRoomData", {
        type: "NOTICE_NEW_MEMBER",
        value: {
          name: playerName,
          password: playerPassword,
          type: playerType,
          color: "#000000"
        }
      });
    },
    /** ========================================================================
     * 部屋の存在確認チェック
     */
    checkRoomName(
      { dispatch, rootGetters }: { dispatch: Function; rootGetters: any },
      {
        roomName,
        roomFindFunc,
        roomNonFindFunc,
        loadingFlg = true
      }: {
        roomName: string;
        roomFindFunc: Function;
        roomNonFindFunc: Function;
        loadingFlg: boolean;
      }
    ) {
      let peer: any = null;
      try {
        peer = new Peer({
          key: __SKYWAY_KEY__,
          debug: 1
        });
      } catch (err) {
        alert(
          "__SKYWAY_KEY__の設定を見直してください。\n現在の値：" +
            __SKYWAY_KEY__
        );
        window.console.error(err);
      }

      if (loadingFlg) dispatch("loading", true);
      let peerId: string = "";
      const connectFunc = (room: any) => {
        room.on("data", (message: any) => {
          const sendData = message.data;
          const targets = sendData.targets;
          if (
            !targets ||
            targets.length === 0 ||
            targets.findIndex((target: string) => target === peerId) > -1
          ) {
            if (sendData.type === "NOTICE_ROOM_INFO") {
              if (roomFindFunc) roomFindFunc.call(null);
              window.console.log(`roomName: ${roomName} is exist.`);
              dispatch("setProperty", {
                property: `room.isExist`,
                value: true,
                logOff: true
              });
              if (loadingFlg) dispatch("loading", false);
              if (peer && !peer.destroyed) {
                peer.destroy();
                peer = null;
              }
            }
          }
        });
      };
      peer.on("open", (id: string) => {
        peerId = id;
        const room = peer.joinRoom(roomName);
        room.on("open", () => {
          connectFunc(room);
          setTimeout(() => {
            if (peer && !peer.destroyed) {
              peer.destroy();
              peer = null;
              if (roomNonFindFunc) roomNonFindFunc.call(null);
              window.console.log(`roomName: ${roomName} is not exist.`);
              dispatch("setProperty", {
                property: `room.isExist`,
                value: false,
                logOff: true
              });
              if (loadingFlg) dispatch("loading", false);
            }
          }, 500);
        });
      });
      peer.on("error", (err: any) => {
        window.console.error(err);
        if (loadingFlg) dispatch("loading", false);
      });
    },
    /** ========================================================================
     * ログアウト処理（画面遷移なし）
     */
    logout({
      dispatch,
      rootGetters
    }: {
      dispatch: Function;
      rootGetters: any;
    }) {
      quoridornLog("ログアウト");
      dispatch("setProperty", {
        property: "public.room",
        value: {
          name: "",
          system: "DiceBot",
          members: []
        },
        logOff: true
      });
      dispatch("setProperty", {
        property: "private.peerId",
        value: null,
        logOff: true
      });
      dispatch("setProperty", {
        property: "room.webRtcRoom",
        value: null,
        logOff: true
      });
      if (rootGetters.webRtcPeer && rootGetters.webRtcPeer.destroyed) {
        rootGetters.webRtcPeer.destroy();
        dispatch("setProperty", {
          property: "self.webRtcPeer",
          value: null,
          logOff: true
        });
      }
    },
    /** ========================================================================
     * データ送信
     */
    sendRoomData({ rootGetters }: { rootGetters: any }, payload: any) {
      if (rootGetters.webRtcRoom) {
        switch (payload.type) {
          case "NOTICE_INPUT":
            break;
          default:
            quoridornLog("RoomData送信 =>", payload);
        }
        rootGetters.webRtcRoom.send(payload);
      }
    }
  }
};
