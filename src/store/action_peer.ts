// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from "vue";
import Vuex from "vuex";
import Peer from "skyway-js";
import { qLog } from "@/components/common/Utility";

Vue.use(Vuex);

/**
 * Store
 */
export default {
  actions: {
    simpleJoinRoom(
      {
        rootState,
        dispatch,
        rootGetters
      }: { rootState: any; dispatch: any; rootGetters: any },
      { roomName }: { roomName: string }
    ) {
      return new Promise((resolved: Function, rejected: Function) => {
        qLog(`Peer接続開始`);

        const connectFunc = () => {
          qLog(`Peer接続開始2`);
          // peer接続作成
          let peer: any = null;
          try {
            peer = new Peer({ key: __SKYWAY_KEY__, debug: 1 });
          } catch (err) {
            alert(
              "__SKYWAY_KEY__の設定を見直してください。\n現在の値：" +
                __SKYWAY_KEY__
            );
            rejected.call(null);
            return;
          }
          rootState.self.webRtcPeer = peer;

          /* ------------------------------
           * Peer接続成功時
           */
          peer.on("open", (peerId: string) => {
            qLog(`Peer接続成功 => PeerId: ${peerId}`);
            qLog(`Room接続開始 => Room: ${roomName}`);
            const room = rootGetters.webRtcPeer.joinRoom(roomName, {
              mode: "sfu"
            });
            rootState.room.webRtcRoom = room;

            /* ------------------------------
             * Room接続成功時
             */
            room.on("open", () => {
              qLog(`Room接続成功 => Room: ${roomName}`);
              resolved(peerId);
            });
          });

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
              rootState.self.webRtcPeer = null;
            }
          };

          /* ------------------------------
           * エラーハンドリング
           */
          peer.on("error", (err: any) => {
            if (
              err.message.indexOf("Please make sure the peerId is correct") > 0
            ) {
              // 切断済みの相手に対するSkyWayAPIの内部的な処理によるエラーのため無視する
              window.console.error(err.message);
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
        };

        // 既にPeer接続していたら、その接続は破棄する
        if (rootGetters.webRtcRoom) {
          rootGetters.webRtcRoom.close();
          dispatch("setProperty", {
            property: "room.webRtcRoom",
            value: null,
            logOff: true
          });
        }
        if (rootGetters.webRtcPeer && !rootGetters.webRtcPeer.destroyed) {
          rootGetters.webRtcPeer.on("disconnected", () => {
            setTimeout(() => {
              connectFunc();
            }, 100);
          });
          rootGetters.webRtcPeer.destroy();
          rootGetters.webRtcPeer.disconnect();
        } else {
          connectFunc();
        }
      });
    },
    /**
     * 誰かが入室してきた場合の処理
     * @param peerId
     */
    onJoinMember(obj: any, { peerId }: { peerId: string }) {
      qLog(`入室を感知 => peerId: ${peerId}`);
    },
    /**
     * 誰かが退室した場合の処理
     * @param dispatch
     * @param rootGetters
     * @param peerId
     */
    onLeaveMember(
      { dispatch, rootGetters }: { dispatch: any; rootGetters: any },
      { peerId }: { peerId: string }
    ) {
      qLog(`退室を感知 => peerId: ${peerId}`);
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
        name: rootGetters.systemLog.name,
        text: `${player.name}(${peerId}) が退室しました。`,
        color: rootGetters.systemLog.color,
        tab: rootGetters.systemLog.tab,
        owner: rootGetters.systemLog.owner
      });
    },
    /**
     * NOTICE_NEW_MEMBER
     * ルームメンバーの自己紹介を受け取ったとき
     *
     * @param rootState
     * @param dispatch
     * @param rootGetters
     * @param value
     * @param fromPeerId
     */
    onNoticeNewMember(
      {
        rootState,
        dispatch,
        rootGetters
      }: { rootState: any; dispatch: any; rootGetters: any },
      { value, fromPeerId }: { value: any; fromPeerId: string }
    ) {
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
        name: rootGetters.systemLog.name,
        text: `${value.name}(${fromPeerId}) が入室しました。`,
        color: rootGetters.systemLog.color,
        tab: rootGetters.systemLog.tab,
        owner: rootGetters.systemLog.owner
      });

      // 自分が親だったら、入ってきた人に部屋情報を教えてあげる
      if (rootGetters.members[0].peerId === rootGetters.peerId) {
        dispatch("sendRoomData", {
          type: "NOTICE_ROOM_INFO",
          value: rootState.public,
          targets: [fromPeerId]
        });
      }
    },
    /**
     * NOTICE_ROOM_INFO
     * ルームメンバーの情報を受け取ったとき
     *
     * @param rootState
     * @param dispatch
     * @param rootGetters
     * @param peerId
     * @param roomName
     * @param roomPassword
     * @param playerName
     * @param playerPassword
     * @param playerType
     * @param resolved
     * @param rejected
     * @param isCheck
     * @param value
     */
    onNoticeRoomInfo(
      {
        rootState,
        dispatch,
        rootGetters
      }: { rootState: any; dispatch: any; rootGetters: any },
      {
        roomName,
        roomPassword,
        playerName,
        playerPassword,
        playerType,
        resolved,
        rejected,
        isGui,
        value
      }: {
        roomName: string;
        roomPassword: string;
        playerName: any;
        playerPassword: any;
        playerType: any;
        resolved: Function;
        rejected: Function;
        isGui: boolean;
        value: any;
      }
    ) {
      let isShowWindow = false;
      let isError = false;
      // 部屋パスワードチェック
      if (value.room.password !== roomPassword) {
        isShowWindow = true;
        isError = true;
        window.console.log(
          "部屋パスワードエラー",
          value.room.password,
          roomPassword
        );
        if (isGui) {
          alert("部屋パスワードエラー");
        }
      }
      const myPlayer = value.player.list.filter(
        (p: any) => p.name === playerName
      )[0];
      if (myPlayer) {
        // 同名プレイヤーが既に部屋にいる場合

        // プレイヤーパスワードチェック
        if (myPlayer.password !== playerPassword) {
          isShowWindow = true;
          isError = true;
          window.console.log(
            "プレイヤーパスワードエラー",
            myPlayer.pass,
            playerPassword
          );
          if (isGui) {
            alert("プレイヤーパスワードエラー");
          }
        }
      }

      if (playerName === null || playerPassword === null) {
        isError = true;
      }

      if (playerType === null) {
        isShowWindow = true;
      }

      // 受け取ったpublic情報でローカルを更新する
      rootState.public = value;

      const showInputWindow = () => {
        // 情報を入力してもらう
        dispatch("setProperty", {
          property: "private.display.inputPlayerInfoWindow",
          value: {
            roomName: roomName,
            roomPassword: roomPassword,
            playerName: playerName,
            playerPassword: playerPassword,
            playerType: playerType
          },
          logOff: true
        });
        dispatch("windowOpen", "private.display.inputPlayerInfoWindow");
      };

      if (isError) {
        if (!isGui) {
          rejected.call(null);
        } else {
          showInputWindow();
        }
        return;
      }

      if (isShowWindow) {
        if (isGui) {
          showInputWindow();
          return;
        }
      }

      // プレイヤーを追加する
      dispatch("addPlayer", {
        peerId: rootGetters.peerId,
        name: playerName,
        password: playerPassword,
        type: playerType,
        color: "#000000"
      });

      qLog(`Room: ${roomName} のルームメンバーとして認識されました。`);

      // チャット追加
      dispatch("addChatLog", {
        name: rootGetters.systemLog.name,
        text: `Room: ${roomName} に接続しました！！`,
        color: rootGetters.systemLog.color,
        tab: rootGetters.systemLog.tab,
        owner: rootGetters.systemLog.owner
      });

      dispatch("windowOpen", "private.display.playerBoxWindow");

      // 入室通知
      resolved.call(null);
    },
    /**
     * SEND_PRIVATE_DATA
     * privateデータを受けたとき
     * @param rootState
     * @param dispatch
     * @param rootGetters
     * @param value
     */
    onSendPrivateData(
      {
        rootState,
        dispatch,
        rootGetters
      }: { rootState: any; dispatch: any; rootGetters: any },
      { value }: { value: any }
    ) {
      rootState.volatileSaveData.members.push(value);
      if (
        rootState.volatileSaveData.members.length === rootGetters.members.length
      ) {
        dispatch("doExport");
      }
    },
    /**
     * NOTICE_OPERATION
     * 親によるDO_METHODの発令要請を受けた時
     * @param rootState
     * @param dispatch
     * @param rootGetters
     * @param value
     * @param method
     */
    onNoticeOperation(
      {
        rootState,
        dispatch,
        rootGetters
      }: { rootState: any; dispatch: any; rootGetters: any },
      { value, method }: { value: any; method: string }
    ) {
      // 自分が親だったら、この通知を処理して、ルームメンバーに土管する
      if (rootGetters.members[0].peerId === rootGetters.peerId) {
        dispatch("sendRoomData", {
          type: "DO_METHOD",
          value: value,
          method: method
        });
        dispatch(method, value);
      }
    },
    /**
     * 部屋データを受け取ったとき
     * @param rootState
     * @param dispatch
     * @param rootGetters
     * @param peerId
     * @param roomName
     * @param roomPassword
     * @param playerName
     * @param playerPassword
     * @param playerType
     * @param resolved
     * @param rejected
     * @param isCheck
     * @param message
     */
    onReceiveData(
      {
        rootState,
        dispatch,
        rootGetters
      }: { rootState: any; dispatch: any; rootGetters: any },
      {
        roomName,
        roomPassword,
        playerName,
        playerPassword,
        playerType,
        resolved,
        rejected,
        isCheck,
        message
      }: {
        roomName: string;
        roomPassword: string;
        playerName: string;
        playerPassword: string;
        playerType: string;
        resolved: Function;
        rejected: Function;
        isCheck: boolean;
        message: any;
      }
    ) {
      const fromPeerId = message.src;

      const type: string = message.data.type;
      const value: any = message.data.value;
      const method: string = message.data.method;

      // ターゲットでなければ処理しない
      const targets = message.data.targets;
      if (
        targets &&
        targets.findIndex((target: string) => target === rootGetters.peerId) ===
          -1
      ) {
        return;
      }

      // ログ出力
      const methodMsg = type === "DO_METHOD" ? `METHOD: ${method}, ` : "";
      qLog(`RoomData受信 => TYPE: ${type}, ${methodMsg}VALUE:`, value);

      /*
       * 通信内容に従って処理する
       */
      // ルームメンバーの情報を受け取ったとき
      if (type === "NOTICE_ROOM_INFO")
        dispatch("onNoticeRoomInfo", {
          roomName: roomName,
          roomPassword: roomPassword,
          playerName: playerName,
          playerPassword: playerPassword,
          playerType: playerType,
          resolved: resolved,
          rejected: rejected,
          isCheck: isCheck,
          value: value
        });
      // ルームメンバーの自己紹介を受け取ったとき
      if (type === "NOTICE_NEW_MEMBER")
        dispatch("onNoticeNewMember", {
          value: value,
          fromPeerId: fromPeerId
        });
      // privateデータの要求を受けたとき
      if (type === "REQUEST_PRIVATE_DATA")
        dispatch("sendRoomData", {
          type: "SEND_PRIVATE_DATA",
          value: rootState.private,
          targets: [fromPeerId]
        });
      // privateデータを受けたとき
      if (type === "SEND_PRIVATE_DATA")
        dispatch("onSendPrivateData", {
          value: value
        });
      // 親によるDO_METHODの発令要請を受けた時
      if (type === "NOTICE_OPERATION")
        dispatch("onNoticeOperation", {
          value: value,
          method: method
        });
      // 入力中の通知を受けたとき
      if (type === "NOTICE_OPERATION") dispatch("noticeInput", value);
      // 画面操作を受け取ったとき
      if (type === "DO_METHOD") {
        delete value.isNotice;
        dispatch(method, value);
      }
    },
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
        roomName,
        roomPassword,
        playerName,
        playerPassword,
        playerType,
        resolved,
        rejected
      }: {
        roomName: string;
        roomPassword: string;
        playerName: string;
        playerPassword: string;
        playerType: string;
        resolved: Function;
        rejected: Function;
      }
    ) {
      // 入力チェック
      if (!roomName) {
        window.console.error(`部屋名は必須項目です。`);
        alert(`部屋名は必須項目です。`);
        rejected.call(null);
        return;
      }
      dispatch("simpleJoinRoom", {
        roomName: roomName,
        resolved: () => {
          dispatch("windowOpen", "private.display.playerBoxWindow");
        },
        rejected: rejected
      });
    },
    joinPlayer(
      {
        dispatch,
        rootGetters,
        rootState
      }: { dispatch: Function; rootGetters: any; rootState: any },
      {
        roomName,
        roomPassword,
        playerName,
        playerPassword,
        playerType
      }: {
        roomName: string;
        roomPassword: string;
        playerName: string;
        playerPassword: string;
        playerType: string;
      }
    ) {
      return new Promise((resolve: Function, reject: Function) => {
        /* ------------------------------
         * 誰かが入室してきた場合
         */
        rootGetters.webRtcRoom.on("peerJoin", (peerId: string) => {
          dispatch("onJoinMember", { peerId: peerId });
        });

        /* ------------------------------
         * 誰かが退室した場合
         */
        rootGetters.webRtcRoom.on("peerLeave", (peerId: string) => {
          dispatch("onLeaveMember", { peerId: peerId });
        });

        /* ------------------------------
         * 部屋データを受信した場合
         */
        rootGetters.webRtcRoom.on("data", (message: any) => {
          dispatch("onReceiveData", {
            roomName: roomName,
            roomPassword: roomPassword,
            playerName: playerName,
            playerPassword: playerPassword,
            playerType: playerType,
            resolved: resolve,
            rejected: reject,
            message: message
          });
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
      });
    },
    /** ========================================================================
     * 部屋の存在確認チェック
     */
    checkRoomName(
      { dispatch, rootGetters }: { dispatch: Function; rootGetters: any },
      {
        roomName,
        loadingFlg = true
      }: {
        roomName: string;
        loadingFlg: boolean;
      }
    ) {
      return new Promise((resolve: Function) => {
        // 入力チェック
        if (!roomName) {
          window.console.error(`部屋名は必須項目です。`);
          alert(`部屋名は必須項目です。`);
          return;
        }

        rootGetters.webRtcRoom.getLog();
        rootGetters.webRtcRoom.on("log", (logs: string[]) => {
          dispatch("setProperty", {
            property: "public.room.name",
            value: roomName,
            logOff: true
          });
          const peerIdList: string[] = [];
          logs.forEach((log: string) => {
            // window.console.log(log);
            // 部屋存在チェック処理
            const logObj = JSON.parse(log);
            if (
              logObj.messageType === "ROOM_DATA" &&
              logObj.message.data.type === "NOTICE_NEW_MEMBER"
            ) {
              // window.console.log(`addPeerId:${logObj.message.src}`);
              peerIdList.push(logObj.message.src)
            }
            if (logObj.messageType === "ROOM_USER_LEAVE") {
              const index = peerIdList.findIndex(peerId => peerId === logObj.message.src);
              if (index > -1) {
                // window.console.log(`removePeerId:${peerIdList[index]}`);
                peerIdList.splice(index, 1);
              }
            }
          });
          let isExist = peerIdList.length > 0;
          window.console.log(`isExist:${isExist}, peerIdList:`, peerIdList);
          dispatch("setProperty", {
            property: `room.isExist`,
            value: isExist,
            logOff: true
          });
          resolve(isExist);
        });
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
      qLog("ログアウト");
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
            qLog("RoomData送信 =>", payload);
        }
        rootGetters.webRtcRoom.send(payload);
      }
    }
  }
};
