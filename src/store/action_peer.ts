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
    /**========================================================================
     * 指定された名前の部屋に接続する
     *=========================================================================
     * @param rootState
     * @param dispatch
     * @param rootGetters
     * @param roomName
     * @return Promise<any>
     */
    simpleJoinRoom(
      {
        rootState,
        dispatch,
        rootGetters
      }: { rootState: any; dispatch: any; rootGetters: any },
      { roomName }: { roomName: string }
    ): Promise<any> {
      return new Promise((resolve: Function, reject: Function) => {
        qLog(`Peer接続開始 => Non Info.`);

        const connectFunc = () => {
          // peer接続作成
          let peer: any = null;
          try {
            peer = new Peer({ key: __SKYWAY_KEY__, debug: 1 });
          } catch (err) {
            alert(
              "__SKYWAY_KEY__の設定を見直してください。\n現在の値：" +
                __SKYWAY_KEY__
            );
            reject.call(null);
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
            dispatch("setProperty", {
              property: "private.self.peerId",
              value: peerId,
              isNotice: false,
              logOff: true
            });

            /* ------------------------------
             * Room接続成功時
             */
            room.on("open", () => {
              qLog(`Room接続成功 => Room: ${roomName}`);
              resolve(peerId);
            });
          });

          // 画面が閉じられたらPeer接続を破棄
          window.onunload = window.onbeforeunload = () => {
            // マップ編集中のロックを解除
            if (rootGetters.isMapEditing === rootGetters.peerId) {
              dispatch("setProperty", {
                property: "public.map.isEditting",
                value: null,
                isNotice: true,
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
            window.console.error(err.type);
            window.console.error(err.message);
            if (
              err.message.indexOf("Please make sure the peerId is correct") > 0
            ) {
              // 切断済みの相手に対するSkyWayAPIの内部的な処理によるエラーのため無視する
              window.console.error(err.message);
              return;
            }

            // その他エラー
            reject.call(null);
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
          setTimeout(() => {
            connectFunc();
          }, 200);
          rootGetters.webRtcPeer.destroy();
          rootGetters.webRtcPeer.disconnect();
        } else {
          connectFunc();
        }
      });
    },

    /**========================================================================
     * 誰かが入室してきた場合の処理
     *=========================================================================
     * @param payload
     * @param peerId
     */
    onJoinMember(payload: any, { peerId }: { peerId: string }) {
      qLog(`入室を感知 => peerId: ${peerId}`);
    },

    /**========================================================================
     * 誰かが退室した場合の処理
     *=========================================================================
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
        text: `${player.name}（${peerId}） が退室しました。`,
        color: rootGetters.systemLog.color,
        tab: rootGetters.systemLog.tab,
        owner: rootGetters.systemLog.owner
      });
    },

    /**========================================================================
     * NOTICE_NEW_MEMBER
     * 新規ルームメンバー通知を受け取ったとき
     *=========================================================================
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
      { fromPeerId }: { fromPeerId: string }
    ) {
      // 自分が親だったら、入ってきた人に部屋情報を教えてあげる
      if (rootGetters.members[0].peerId === rootGetters.peerId) {
        dispatch("sendRoomData", {
          type: "NOTICE_ROOM_INFO",
          value: rootState.public,
          targets: [fromPeerId]
        });
      }
    },

    /**========================================================================
     * NOTICE_ROOM_INFO
     * ルームメンバーの情報を受け取ったとき
     *=========================================================================
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
     * @param reject
     * @param isGui
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
        fontColor,
        resolve,
        reject,
        isGui = true,
        value
      }: {
        roomName: string;
        roomPassword: string;
        playerName: string;
        playerPassword: string;
        playerType: string;
        fontColor: string;
        resolve: Function;
        reject: Function;
        isGui: boolean;
        value: any;
      }
    ) {
      let isShowWindow = false;
      let isError = false;
      // 部屋パスワードチェック
      if (value.room.password !== roomPassword) {
        if (isGui) alert("部屋パスワードエラー");
        reject.call(null);
        return;
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
          if (isGui) alert("プレイヤーパスワードエラー");
        }
      }

      if (!playerName || playerPassword === null) {
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
            roomPassword: roomPassword || "",
            playerName: playerName || "",
            playerPassword: playerPassword || "",
            playerType: playerType || "",
            fontColor: fontColor,
            resolve: resolve
          },
          logOff: false
        });
        dispatch("windowOpen", "private.display.inputPlayerInfoWindow");
      };

      if (isError) {
        if (!isGui) {
          reject.call(null);
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

      // 入室通知
      resolve({
        playerName: playerName,
        playerPassword: playerPassword,
        playerType: playerType,
        fontColor: fontColor
      });
    },

    /**========================================================================
     * SEND_PRIVATE_DATA
     * privateデータを受けたとき
     *=========================================================================
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

    /**========================================================================
     * NOTICE_OPERATION
     * 親によるDO_METHODの発令要請を受けた時
     *=========================================================================
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

    /**========================================================================
     * 部屋データを受け取ったとき
     *=========================================================================
     * @param rootState
     * @param dispatch
     * @param rootGetters
     * @param peerId
     * @param roomName
     * @param roomPassword
     * @param playerName
     * @param playerPassword
     * @param playerType
     * @param fontColor
     * @param resolve
     * @param reject
     * @param isGui
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
        fontColor,
        resolve,
        reject,
        isGui,
        message
      }: {
        roomName: string;
        roomPassword: string;
        playerName: string;
        playerPassword: string;
        playerType: string;
        fontColor: string;
        resolve: Function;
        reject: Function;
        isGui: boolean;
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
      // 新規ルームメンバー通知を受け取ったとき
      if (type === "NOTICE_NEW_MEMBER")
        dispatch("onNoticeNewMember", { fromPeerId: fromPeerId });
      // ルームメンバーの情報を受け取ったとき
      if (type === "NOTICE_ROOM_INFO")
        dispatch("onNoticeRoomInfo", {
          roomName: roomName,
          roomPassword: roomPassword,
          playerName: playerName,
          playerPassword: playerPassword,
          playerType: playerType,
          fontColor: fontColor,
          resolve: resolve,
          reject: reject,
          isGui: isGui,
          value: value
        });
      // 新規ルームメンバーの自己紹介を受け取ったとき
      if (type === "NOTICE_SELF_INFO")
        // Player追加
        dispatch("addPlayer", {
          name: value.playerName,
          password: value.playerPassword,
          type: value.playerType,
          fontColor: value.fontColor,
          peerId: fromPeerId
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
        dispatch("onSendPrivateData", { value: value });
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

    /**========================================================================
     * WebRTCでPeer接続し、Roomにも接続する
     *=========================================================================
     * @param rootState
     * @param dispatch
     * @param rootGetters
     * @param roomName
     * @param roomPassword
     * @param playerName
     * @param playerPassword
     * @param playerType
     * @param resolved
     * @param rejected
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

    /**========================================================================
     * 入室手続きを始める
     *=========================================================================
     * @param dispatch
     * @param rootGetters
     * @param rootState
     * @param roomName
     * @param roomPassword
     * @param playerName
     * @param playerPassword
     * @param playerType
     * @param fontColor
     * @param isGui
     */
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
        playerType,
        fontColor,
        isGui
      }: {
        roomName: string;
        roomPassword: string;
        playerName: string;
        playerPassword: string;
        playerType: string;
        fontColor: string;
        isGui: boolean;
      }
    ) {
      return new Promise((resolve: Function, reject: Function) => {
        /* ------------------------------
         * 誰かが入室してきた場合
         */
        if (rootGetters.webRtcRoom._events.peerJoin)
          delete rootGetters.webRtcRoom._events.peerJoin;
        rootGetters.webRtcRoom.on("peerJoin", (peerId: string) => {
          dispatch("onJoinMember", { peerId: peerId });
        });

        /* ------------------------------
         * 誰かが退室した場合
         */
        if (rootGetters.webRtcRoom._events.peerLeave)
          delete rootGetters.webRtcRoom._events.peerLeave;
        rootGetters.webRtcRoom.on("peerLeave", (peerId: string) => {
          dispatch("onLeaveMember", { peerId: peerId });
        });

        /* ------------------------------
         * 部屋データを受信した場合
         */
        if (rootGetters.webRtcRoom._events.data)
          delete rootGetters.webRtcRoom._events.data;
        rootGetters.webRtcRoom.on("data", (message: any) => {
          dispatch("onReceiveData", {
            roomName: roomName,
            roomPassword: roomPassword,
            playerName: playerName,
            playerPassword: playerPassword,
            playerType: playerType,
            fontColor: fontColor,
            resolve: resolve,
            reject: reject,
            isGui: isGui,
            message: message
          });
        });

        // ルームメンバーに自己紹介する
        dispatch("sendRoomData", {
          type: "NOTICE_NEW_MEMBER"
        });
      });
    },

    /**========================================================================
     * 部屋の存在確認チェック
     *=========================================================================
     * @param dispatch
     * @param rootGetters
     * @param roomName
     * @param loadingFlg
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

        if (rootGetters.webRtcRoom._events.log) {
          delete rootGetters.webRtcRoom._events.log;
        }
        rootGetters.webRtcRoom.on("log", (logs: string[]) => {
          dispatch("setProperty", {
            property: "public.room.name",
            value: roomName,
            logOff: true
          });
          const peerIdList: string[] = [];
          logs.forEach((log: string) => {
            // 部屋存在チェック処理
            const logObj = JSON.parse(log);
            const logTexts = [];
            logTexts.push(`peerId: ${logObj.message.src}`);
            logTexts.push(`type: ${logObj.messageType}`);
            if (logObj.messageType === "ROOM_DATA")
              logTexts.push(`data: ${logObj.message.data.type}`);
            window.console.log(`logInfo: [${logTexts.join(", ")}]`);
            if (
              logObj.messageType === "ROOM_DATA" &&
              logObj.message.data.type === "NOTICE_SELF_INFO"
            ) {
              // window.console.log(`addPeerId:${logObj.message.src}`);
              peerIdList.push(logObj.message.src);
            }
            if (logObj.messageType === "ROOM_USER_LEAVE") {
              const index = peerIdList.findIndex(
                peerId => peerId === logObj.message.src
              );
              if (index > -1) {
                // window.console.log(`removePeerId:${peerIdList[index]}`);
                peerIdList.splice(index, 1);
              }
            }
          });
          let isExist = peerIdList.length > 0;
          qLog(
            `Room存在確認 => name: ${roomName} 存在: ${
              isExist ? "する" : "しない"
            } peerId:`,
            peerIdList
          );
          dispatch("setProperty", {
            property: `room.isExist`,
            value: isExist,
            logOff: true
          });
          resolve(isExist);
        });
      });
    },

    /**========================================================================
     * ログアウト処理（画面遷移なし）
     *=========================================================================
     * @param dispatch
     * @param rootGetters
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

    /**========================================================================
     * データ送信
     *=========================================================================
     * @param rootGetters
     * @param payload
     */
    sendRoomData({ rootGetters }: { rootGetters: any }, payload: any) {
      if (!rootGetters.webRtcRoom) return;
      if (payload && payload.type !== "NOTICE_INPUT") {
        qLog(`RoomData送信 => TYPE: ${payload.type}, VALUE:`, payload.value);
      }
      rootGetters.webRtcRoom.send(payload);
    }
  }
};
