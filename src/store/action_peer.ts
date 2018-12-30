// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from "vue";
import Vuex from "vuex";
import Peer from "skyway-js";
import {quoridornLog} from "@/components/common/Utility";

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
      {rootState, dispatch}: { rootState: any, dispatch: any },
      {peerId, roomName}: { peerId: string, roomName: string }
    ) {
        if (!roomName) {
        window.console.error(`RoomIdは必須項目です。`);
        alert(`RoomIdは必須項目です。`);
        return;
      }
      const options = {
        key: __SKYWAY_KEY__,
        debug: 1
      };
        quoridornLog(`Peer接続開始 => PeerId: ${peerId}`);
      const peer = new Peer(peerId, options);
      // Await connections from others
      peer.on("connection", () => dispatch("connectFunc"));

      /* ------------------------------
       * Peer接続成功時
       */
      peer.on("open", (id: string) => {
          quoridornLog(`Peer接続成功 => PeerId: ${id}`);
        // セーブデータからの復元の場合は既にpeerIdが格納されている
        if (rootState.private.self.peerId !== id) {
          rootState.private.self.peerId = id;
          rootState.public.room.password = rootState.private.self.password;
          dispatch("addMember", {
            peerId: id,
            name: rootState.private.self.playerName,
            isCame: true
          });
          dispatch("addPlayer", {
            name: rootState.private.self.playerName,
            color: "#000000",
            type: rootState.private.self.playerType
          });
        }
          quoridornLog(`Room接続開始 => Room: ${roomName}`);
          const room = rootState.self.webRtcPeer.joinRoom(roomName);

        /* ------------------------------
         * Room接続成功時
         */
        room.on("open", () => {
            quoridornLog(`Room接続成功 => Room: ${roomName}`);
          rootState.room.webRtcRoom = room;
          dispatch("connectFunc", { room: room });
        });
      });

      // Peer接続に関するエラーはこちらにてハンドリング
      peer.on("error", (err: any) => {
        window.console.error(err);
        if (err.message.indexOf("is already in use") > 0) {
          alert(
            `接続に失敗しました。¥npeerId:${peerId}は既に使われています。¥n異なるpeerIdを指定してください。`
          );
        } else {
          alert(
            `接続に失敗しました。¥n原因は以下のメッセージを参考にしてください。¥n${
              err.message
            }`
          );
        }
      });

      // 既にPeer接続していたら、その接続は破棄する
      if (rootState.self.webRtcPeer && !rootState.self.webRtcPeer.destroyed) {
        rootState.self.webRtcPeer.destroy();
      }
      rootState.self.webRtcPeer = peer;

      // 画面が閉じられたらPeer接続を破棄
      window.onunload = window.onbeforeunload = () => {
        if (rootState.public.map.isEditting === rootState.private.self.peerId) {
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
    },
    /** ========================================================================
     * 接続後の処理
     */
    connectFunc: (
      {rootState, dispatch, commit}: { rootState: any; dispatch: Function; commit: Function },
      {room}: { room: any }
    ) => {
      // Handle a chat connection.
      const roomName = room.name.replace("sfu_text_", "");

      const logName = "SYSTEM";
      const logColor = "red";
      const logTab = "メイン";

      rootState.public.room.id = roomName;

      dispatch("windowOpen", "private.display.playerBoxWindow");

      // 誰かが入室してきた場合
      room.on("peerJoin", (peerId: string) => {
          quoridornLog(`入室を感知 => peerId: ${peerId}`);
        // const filtered = rootState.public.room.members.filter(memberObj => memberObj.peerId === peerId)
        // if (filtered.length > 0) {
        // } else {
        //   dispatch('addMember', { peerId: peerId, name: '', isCame: false })
        // }
        // 自分が親だったら、入ってきた人に部屋情報を教えてあげる
        if (
          rootState.public.room.members[0].peerId ===
          rootState.private.self.peerId
        ) {
          dispatch("sendRoomData", {
            type: "NOTICE_OTHER_PLAYER",
            value: rootState.public,
            targets: [peerId]
          });
        }
      });

      // 誰かが退室した場合
      room.on("peerLeave", (peerId: string) => {
          quoridornLog(`退室を感知 => peerId: ${peerId}`);
          // quoridornLog(peerId, rootState.public.room.members)
        const memberObj = rootState.public.room.members.filter(
          (member: any) => member.peerId === peerId
        )[0];
        if (!memberObj) {
          return;
        }
        const index = rootState.public.room.members.indexOf(memberObj);
        if (memberObj.isCame) {
          dispatch("addChatLog", {
            name: logName,
            text: `${memberObj.name}(${peerId}) が退室しました。`,
            color: logColor,
            tab: logTab,
            owner: "SYSTEM"
          });
        }
        rootState.public.room.members.splice(index, 1);
      });

      // 誰かがデータを送信した場合
      room.on("data", (message: any) => {
        const peerId = message.src;
        const sendData = message.data;
        const memberObj = rootState.public.room.members.filter(
          (member: any) => member.peerId === peerId
        )[0]; // TODO filter
        window.console.log(
          "####",
          message,
          memberObj,
          rootState.public.room.members
        );
        const targets = sendData.targets;
        if (
          !targets ||
          targets.length === 0 ||
          targets.findIndex(
            (target: string) => target === rootState.private.self.peerId
          ) > -1
        ) {
          const type = sendData.type;
          const value = sendData.value;
          if (type === "DO_METHOD") {
              quoridornLog(
              `RoomData受信 => TYPE: ${type}, METHOD: ${
                sendData.method
              }, VALUE:`,
              value
            );
          } else {
              quoridornLog(`RoomData受信 => TYPE: ${type}, VALUE:`, value);
          }
          switch (type) {
            // ルームメンバーの情報を受け取ったとき
            case "NOTICE_OTHER_PLAYER":
              const roomPassword = value.room.password;
              if (roomPassword !== rootState.private.self.password) {
                alert("入力されたパスワードが部屋のパスワードと一致しません。");
                dispatch("logout");
                break;
              }

                quoridornLog(
                `Room: ${roomName} のルームメンバーとして認識されました。`
              );
              // チャット追加
              dispatch("addChatLog", {
                name: logName,
                text: `Room: ${roomName} に接続しました！！`,
                color: logColor,
                tab: logTab,
                owner: "SYSTEM"
              });

              // 自分を一番後ろにする処理
              let memberMe = null;
              let playerMe = null;
              value.room.members.forEach((memberObj: any) => {
                if (memberObj.name === rootState.private.self.playerName) {
                  memberObj.isCame = true;
                  memberMe = memberObj;
                }
              });
              value.player.list.forEach((playerObj: any) => {
                if (playerObj.name === rootState.private.self.playerName) {
                  playerMe = playerObj;
                } else {
                  // commit('addPlayerWidth')
                }
              });
              if (!memberMe) {
                memberMe = rootState.public.room.members[0];
                value.room.members.push(memberMe);
              }
              if (!playerMe) {
                playerMe = rootState.public.player.list[0];
                value.player.list.push(playerMe);
              }
              rootState.public = value;
              // ルームメンバーに自己紹介する
              dispatch("sendRoomData", {
                type: "NOTICE_MY_INFO",
                value: {
                  name: memberMe.name,
                  type: playerMe.type,
                  color: playerMe.color
                }
              });
              // setTimeout(() => {
              //   if (callBackFunc) callBackFunc()
              // }, 0)
              break;
            // ルームメンバーの名前が変わったとき
            // case 'CHANGE_PLAYER_NAME':
            //   memberObj.name = value
            //   rootState.public.room.members.splice(index, 1, memberObj)
            //   break
            // ルームメンバーの自己紹介を受け取ったとき
            case "NOTICE_MY_INFO":
              dispatch("addMember", {
                peerId: peerId,
                name: value.name,
                isCame: true
              });
              dispatch("addPlayer", {
                name: value.name,
                color: value.color,
                type: value.type
              });
              dispatch("addChatLog", {
                name: logName,
                text: `PeerId: ${peerId} が入室しました。`,
                color: logColor,
                tab: logTab,
                owner: "SYSTEM"
              });
              break;
            // チャット発言を受け取ったとき
            // case 'SEND_CHAT':
            //   // TODO get owner
            //   // peerId
            //   window.console.log('-------', memberObj.name, value.text, memberObj.color, value.tab)
            //   dispatch('addChatLog', {
            //     name: memberObj.name,
            //     text: value.text,
            //     color: memberObj.color,
            //     tab: value.tab,
            //     owner: 'SYSTEM'
            //   })
            //   break
            // 画面操作を受け取ったとき
            case "DO_METHOD":
              const method = sendData.method;
              delete value.isNotice;
              dispatch(method, value);
              break;
            // privateデータの要求を受けたとき
            case "REQUEST_PRIVATE_DATA":
              dispatch("sendRoomData", {
                type: "SEND_PRIVATE_DATA",
                value: rootState.private,
                targets: [peerId]
              });
              break;
            // privateデータの要求を受けたとき
            case "SEND_PRIVATE_DATA":
              rootState.volatileSaveData.members.push(value);
              if (
                rootState.volatileSaveData.members.length ===
                rootState.public.room.members.length
              ) {
                dispatch("doExport");
              }
              break;
            case "NOTICE_OPERATION":
              // 自分が親だったら、この通知を処理して、ルームメンバーに土管する
              if (
                rootState.public.room.members[0].peerId ===
                rootState.private.self.peerId
              ) {
                const method = sendData.method;
                dispatch("sendRoomData", {
                  type: "DO_METHOD",
                  value: value,
                  method: method
                });
                dispatch(method, value);
              }
              break;
            case "NOTICE_INPUT":
              dispatch("noticeInput", value);
              break;
            default:
          }
        }
      });
    },
    /** ========================================================================
     * 部屋の存在確認チェック
     */
    checkRoomName({rootState}: { rootState: any }, payload: any) {
      const roomName = payload.roomName;
      const roomFindFunc = payload.roomFindFunc;
      const roomNonFindFunc = payload.roomNonFindFunc;

      let peer = new Peer({
        key: __SKYWAY_KEY__,
        debug: 1
      });
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
            if (sendData.type === "NOTICE_OTHER_PLAYER") {
              const filtered = sendData.value.room.members.filter(
                (memberObj: any) => memberObj.peerId === rootState.private.self.peerId
              );
              if (filtered.length > 0) {
                roomFindFunc("この部屋は現在あなたが入室している部屋です。");
              } else {
                roomFindFunc(
                  "この部屋は既に存在します。決定を押すと参加できます。"
                );
              }
              if (peer && !peer.destroyed) {
                peer.destroy();
                peer = null;
              }
            }
          }
        });
      };
      peer.on("connection", connectFunc);
      peer.on("open", (id: string) => {
        peerId = id;
        const room = peer.joinRoom(roomName);
        room.on("open", () => {
          connectFunc(room);
          setTimeout(() => {
            if (peer && !peer.destroyed) {
              peer.destroy();
              peer = null;
              if (roomNonFindFunc) {
                roomNonFindFunc();
              }
            }
          }, 1000);
        });
      });
      peer.on("error", (err: any) => {
        window.console.error(err);
      });
    },
    /** ========================================================================
     * ログアウト処理（画面遷移なし）
     */
    logout({rootState}: { rootState: any }) {
        quoridornLog("ログアウト");
      rootState.private.peerId = null;
      rootState.public.room.id = "";
      rootState.public.room.members.splice(
        0,
        rootState.public.room.members.length
      );
      rootState.public.room.system = "DiceBot";
      rootState.room.webRtcRoom = null;
      if (rootState.self.webRtcPeer) {
        rootState.self.webRtcPeer.destroy();
        rootState.self.webRtcPeer = null;
      }
    },
    /** ========================================================================
     * データ送信
     */
    sendRoomData({rootState}: { rootState: any }, payload: any) {
      if (rootState.room.webRtcRoom) {
        rootState.room.webRtcRoom.send(payload);
        switch (payload.type) {
          case "NOTICE_INPUT":
            return;
        }
          quoridornLog("RoomData送信 =>", payload);
      }
    }
  }
};
