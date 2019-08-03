// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from "vue";
import Vuex from "vuex";
import Peer from "skyway-js";
import { qLog } from "@/components/common/Utility";
import moment from "moment";
// const moment = require("moment");

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
     * @param commit
     * @param dispatch
     * @param rootGetters
     * @param roomName
     * @param isWait
     * @return Promise<any>
     */
    simpleJoinRoom(
      {
        rootState,
        commit,
        dispatch,
        rootGetters
      }: { rootState: any; commit: Function; dispatch: any; rootGetters: any },
      { roomName, isWait = false }: { roomName: string; isWait: boolean }
    ): Promise<any> {
      return new Promise((resolve: Function, reject: Function) => {
        // qLog(`Peer接続開始 => Non Info.`);

        const connectFunc = () => {
          // peer接続作成
          let peer: any = null;
          try {
            peer = new Peer({ key: rootGetters.skywayKey, debug: 1 });
          } catch (err) {
            alert(
              "connect.yamlの設定を見直してください。\n現在の値：" +
                rootGetters.skywayKey
            );
            reject.call(null);
            return;
          }
          commit("updateWebRtcPeer", { peer: peer, isWait: isWait });

          /* ------------------------------
           * Peer接続成功時
           */
          peer.on("open", (peerId: string) => {
            // qLog(`Peer接続成功 => PeerId: ${peerId}`);
            const isSfu =
              rootGetters && rootGetters.connectType.toUpperCase() === "SFU";
            const connectStr = isSfu ? "SFU方式" : "Mesh方式";
            // qLog(`Room接続開始 => Room: ${roomName}, 接続方式: ${connectStr}`);
            const room = peer.joinRoom(
              roomName,
              isSfu ? { mode: "sfu" } : undefined
            );
            commit("updateWebRtcRoom", { room: room, isWait: isWait });
            commit("updatePeerId", { peerId: peerId, isWait: isWait });

            /* ------------------------------
             * Room接続成功時
             */
            room.on("open", () => {
              // qLog(`Room接続成功 => Room: ${roomName}`);
              resolve(peerId);
            });
          });

          // 画面が閉じられたらPeer接続を破棄
          // TODO 複数呼び出されたら上書きされてしまう問題
          window.onunload = window.onbeforeunload = () => {
            // マップ編集中のロックを解除
            if (rootGetters.isMapEditing === rootGetters.peerId(isWait)) {
              dispatch("setProperty", {
                property: "public.map.isEditing",
                value: null,
                isNotice: true,
                logOff: true
              });
            }
            if (peer && !peer.destroyed) {
              peer.destroy();
              peer = null;
              commit("updateWebRtcPeer", { peer: null, isWait: isWait });
              commit("updateWebRtcRoom", { room: null, isWait: isWait });
              commit("updatePeerId", { peerId: null, isWait: isWait });
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
            const msg: string[] = [];
            msg.push("接続に失敗しました。");
            msg.push(
              "たまたま通信処理の調子が悪い可能性があるので、画面を再読み込みしてもらうと直るかもしれません。"
            );
            msg.push("原因は以下のメッセージを参考にしてください。");
            msg.push("");
            msg.push(err.message);
            alert(msg.join("\n"));
          });
        };

        // 既にPeer接続していたら、その接続は破棄する
        const room = rootGetters.webRtcRoom(isWait);
        if (room) {
          room.close();
          commit("updateWebRtcRoom", { room: null, isWait: isWait });
        }
        const peer = rootGetters.webRtcPeer(isWait);
        if (peer && !peer.destroyed) {
          setTimeout(() => {
            connectFunc();
          }, 200);
          peer.destroy();
          peer.disconnect();
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
      // qLog(`入室を感知 => peerId: ${peerId}`);
    },

    /**========================================================================
     * 誰かが退室した場合の処理
     *=========================================================================
     * @param dispatch
     * @param rootGetters
     * @param peerId
     * @param isWait
     */
    onLeaveMember(
      { dispatch, rootGetters }: { dispatch: any; rootGetters: any },
      { peerId, isWait }: { peerId: string; isWait: boolean }
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

      if (rootGetters.members[0].peerId === rootGetters.peerId(isWait)) {
        dispatch("addChatLog", {
          name: rootGetters.systemLog.name,
          text: `${player.name} が退室しました。`,
          color: rootGetters.systemLog.colorKey,
          tab: rootGetters.systemLog.tab,
          target: "groupTargetTab-0",
          from: rootGetters.systemLog.from,
          owner: rootGetters.systemLog.from
        });
      }
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
     * @param isWait
     */
    onNoticeNewMember(
      {
        rootState,
        dispatch,
        rootGetters
      }: { rootState: any; dispatch: any; rootGetters: any },
      { fromPeerId, isWait }: { fromPeerId: string; isWait: boolean }
    ) {
      // 自分が親だったら、入ってきた人に部屋情報を教えてあげる
      if (rootGetters.members[0].peerId === rootGetters.peerId(isWait)) {
        dispatch("sendRoomData", {
          type: "NOTICE_ROOM_INFO",
          value: rootState.public,
          targets: [fromPeerId],
          isWait: isWait
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
     * @param useWindow
     * @param useAlert
     * @param value
     */
    onNoticeRoomInfo(
      {
        rootState,
        dispatch,
        rootGetters,
        commit
      }: { rootState: any; dispatch: any; rootGetters: any; commit: Function },
      {
        roomName,
        roomPassword,
        playerName,
        playerPassword,
        playerType,
        fontColor,
        resolve,
        reject,
        useWindow,
        useAlert,
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
        useWindow: boolean;
        useAlert: boolean;
        value: any;
      }
    ) {
      let isShowWindow = false;
      let isError = false;
      // 部屋パスワードチェック
      if (value.room.password !== (roomPassword || "")) {
        if (useAlert)
          alert(
            `部屋${roomName}は存在しましたが、\nご指定の部屋パスワードでは入室できませんでした。`
          );

        if (rootGetters.isWait) {
          commit("updateIsJoined", false);
        }
        // window.console.log("部屋パスワードエラー", rootGetters.isWait);
        reject.call(null);
        return;
      } else {
        roomPassword = value.room.password;
      }
      const myPlayer = value.player.list.filter(
        (p: any) => p.name === playerName
      )[0];
      if (myPlayer) {
        // 同名プレイヤーが既に部屋にいる場合

        // プレイヤーパスワードチェック
        if (myPlayer.password !== (playerPassword || "")) {
          if (useAlert) alert(`プレイヤーパスワードの入力をお願いします。`);
          // window.console.log("プレイヤーパスワードエラー");
          isShowWindow = true;
          isError = true;
        } else {
          playerPassword = myPlayer.password;
          playerType = myPlayer.type;
        }
      } else {
        if (!playerName || playerPassword === null) {
          isError = true;
        }
        if (playerType === null) {
          isShowWindow = true;
        }
      }

      // 受け取ったpublic情報でローカルを更新する
      const volatileList = value.chat.tab.list.map(
        (tabObj: any, index: number) => ({
          key: tabObj.key,
          isActive: index === 0,
          isHover: false,
          unRead: 0,
          order: 0
        })
      );
      Vue.set(rootState.private.chat, "tab", volatileList);
      Vue.set(rootState, "public", value);

      const showInputWindow = () => {
        // 情報を入力してもらう
        dispatch("setProperty", {
          property: "private.display.inputPlayerInfoWindow",
          value: {
            roomName: roomName,
            playerName: playerName || "",
            playerPassword: playerPassword || "",
            playerType: playerType || "PL",
            fontColor: fontColor,
            resolve: resolve
          },
          logOff: true
        });
        dispatch("windowOpen", "private.display.inputPlayerInfoWindow");
      };

      if (isError) {
        useWindow ? showInputWindow() : reject();
        return;
      }

      if (isShowWindow) {
        if (useWindow) {
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
     * @param peerId
     */
    onSendPrivateData(
      { dispatch, rootGetters }: { dispatch: any; rootGetters: any },
      { value, peerId }: { value: any; peerId: string }
    ) {
      const player = rootGetters.getPlayer(peerId);
      rootGetters.volatilePrivateData[player.key] = value;

      const saveNum = Object.keys(rootGetters.volatilePrivateData).length;
      if (saveNum === rootGetters.members.length) {
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
     * @param isWait
     */
    onNoticeOperation(
      {
        rootState,
        dispatch,
        rootGetters
      }: { rootState: any; dispatch: any; rootGetters: any },
      { value, method, isWait }: { value: any; method: string; isWait: boolean }
    ) {
      // 自分が親だったら、この通知を処理して、ルームメンバーに土管する
      if (rootGetters.members[0].peerId === rootGetters.peerId(isWait)) {
        value.processTime = moment().format("YYYY/MM/DD hh:mm:ss");
        dispatch("sendRoomData", {
          type: "DO_METHOD",
          value: value,
          method: method,
          isWait: isWait
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
     * @param useWindow
     * @param useAlert
     * @param message
     * @param isWait
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
        useWindow,
        useAlert,
        message,
        isWait
      }: {
        roomName: string;
        roomPassword: string;
        playerName: string;
        playerPassword: string;
        playerType: string;
        fontColor: string;
        resolve: Function;
        reject: Function;
        useWindow: boolean;
        useAlert: boolean;
        message: any;
        isWait: boolean;
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
        targets.findIndex(
          (target: string) => target === rootGetters.peerId(isWait)
        ) === -1
      ) {
        return;
      }

      // ログ出力
      // const methodMsg = type === "DO_METHOD" ? `METHOD: ${method}, ` : "";
      // qLog(`RoomData受信 => TYPE: ${type}, ${methodMsg}VALUE:`, value);

      /*
       * 通信内容に従って処理する
       */
      // 新規ルームメンバー通知を受け取ったとき
      if (type === "NOTICE_NEW_MEMBER")
        dispatch("onNoticeNewMember", {
          fromPeerId: fromPeerId,
          isWait: isWait
        });
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
          useWindow: useWindow,
          useAlert: useAlert,
          value: value
        });
      // 新規ルームメンバーの自己紹介を受け取ったとき
      if (type === "NOTICE_SELF_INFO") {
        // Player追加
        dispatch("addPlayer", {
          peerId: fromPeerId,
          name: value.playerName,
          password: value.playerPassword,
          type: value.playerType,
          fontColor: value.fontColor,
          isWait: isWait
        });
        const player: any = rootGetters.getPlayer(fromPeerId);
        const members: any[] = rootGetters.getMembers(player.key);
        const isContainMe: boolean =
          members.findIndex(
            (member: any) =>
              member.peerId === rootGetters.peerId(rootGetters.isWait)
          ) > -1;
        if (isContainMe && members.length > 1) {
          const msg: string[] = [];
          msg.push("あなたと同じプレイヤーとして入室した人が現れました。");
          msg.push("これがもしあなた本人による入室なら良いのですが、");
          msg.push("そうでない場合は成りすましの影響が出ます。");
          msg.push("");
          msg.push("対処するには以下の手順をとってください。");
          msg.push(
            "１. 速やかに部屋データを保存(Ctrl + S もしくは Command + S)する"
          );
          msg.push("２. ルームメンバーに成りすましの可能性を教える");
          msg.push("３. 部屋を作り直す");
          msg.push("４. （あなたは別のパスワードでログインする）");
          setTimeout(() => alert(msg!.join("\n")), 0);
        }
      }
      // privateデータの要求を受けたとき
      if (type === "REQUEST_PRIVATE_DATA") {
        // 同じプレイヤーの中で一番最初に入室した画面のみ、privateデータを送信する
        const player = rootGetters.getPlayer(rootGetters.peerId(isWait));
        const members = rootGetters.getMembers(player.key);
        if (members[0].peerId === rootGetters.peerId(isWait)) {
          const privateData = JSON.parse(JSON.stringify(rootState.private));
          // 開いてないディスプレイ情報は送信データに含めない
          for (const key in privateData.display) {
            if (!privateData.display.hasOwnProperty(key)) continue;
            if (!privateData.display[key].isDisplay) {
              delete privateData.display[key];
            } else {
              delete privateData.display[key].command;
              delete privateData.display[key].zIndex;
            }
          }

          dispatch("sendRoomData", {
            type: "SEND_PRIVATE_DATA",
            value: privateData,
            targets: [fromPeerId],
            isWait: isWait
          });
        }
      }
      // privateデータを受けたとき
      if (type === "SEND_PRIVATE_DATA")
        dispatch("onSendPrivateData", { value: value, peerId: fromPeerId });
      // 親によるDO_METHODの発令要請を受けた時
      if (type === "NOTICE_OPERATION")
        dispatch("onNoticeOperation", {
          value: value,
          method: method,
          isWait: isWait
        });
      // 入力中の通知を受けたとき
      if (type === "NOTICE_INPUT") dispatch("noticeInput", value);
      // 画面操作を受け取ったとき
      if (type === "DO_METHOD") {
        delete value.isNotice;
        dispatch(method, value);
      }
    },

    /**========================================================================
     * WebRTCでPeer接続し、Roomにも接続する
     *=========================================================================
     */
    createPeer() {
      window.console.log(`createPeer is deprecated.`);
    },

    /**========================================================================
     * 入室手続きを始める
     *=========================================================================
     * @param dispatch
     * @param commit
     * @param rootGetters
     * @param rootState
     * @param roomName
     * @param roomPassword
     * @param playerName
     * @param playerPassword
     * @param playerType
     * @param fontColor
     * @param useWindow
     * @param useAlert
     * @param isWait
     */
    joinPlayer(
      {
        dispatch,
        commit,
        rootGetters,
        rootState
      }: {
        dispatch: Function;
        commit: Function;
        rootGetters: any;
        rootState: any;
      },
      {
        roomName,
        roomPassword,
        playerName,
        playerPassword,
        playerType,
        fontColor,
        useWindow,
        useAlert,
        isWait
      }: {
        roomName: string;
        roomPassword: string;
        playerName: string;
        playerPassword: string;
        playerType: string;
        fontColor: string;
        useWindow: boolean;
        useAlert: boolean;
        isWait: boolean;
      }
    ) {
      return new Promise((resolve: Function, reject: Function) => {
        // メンバーのリセット
        commit("emptyMember");

        const room = rootGetters.webRtcRoom(isWait);

        /* ------------------------------
         * 誰かが入室してきた場合
         */
        if (room._events.peerJoin) delete room._events.peerJoin;
        room.on("peerJoin", (peerId: string) => {
          dispatch("onJoinMember", { peerId: peerId });
        });

        /* ------------------------------
         * 誰かが退室した場合
         */
        if (room._events.peerLeave) delete room._events.peerLeave;
        room.on("peerLeave", (peerId: string) => {
          dispatch("onLeaveMember", { peerId: peerId, isWait: isWait });
        });

        /* ------------------------------
         * 部屋データを受信した場合
         */
        if (room._events.data) delete room._events.data;
        room.on("data", (message: any) => {
          dispatch("onReceiveData", {
            roomName: roomName,
            roomPassword: roomPassword,
            playerName: playerName,
            playerPassword: playerPassword,
            playerType: playerType,
            fontColor: fontColor,
            resolve: resolve,
            reject: reject,
            useWindow: useWindow,
            useAlert: useAlert,
            message: message,
            isWait: isWait
          });
        });

        // ルームメンバーに自己紹介する
        dispatch("sendRoomData", {
          type: "NOTICE_NEW_MEMBER",
          isWait: isWait
        });
      });
    },

    /**========================================================================
     * 部屋の存在確認チェック
     *=========================================================================
     * @param dispatch
     * @param rootGetters
     * @param roomName
     * @param isWait
     */
    checkRoomName(
      { dispatch, rootGetters }: { dispatch: Function; rootGetters: any },
      {
        roomName,
        isWait = false
      }: {
        roomName: string;
        isWait: boolean;
      }
    ) {
      return new Promise((resolve: Function) => {
        // 入力チェック
        if (!roomName) {
          window.console.error(`部屋名は必須項目です。`);
          alert(`部屋名は必須項目です。`);
          return;
        }

        const room = rootGetters.webRtcRoom(isWait);
        room.getLog();

        if (room._events.log) {
          delete room._events.log;
        }
        room.on("log", (logs: string[]) => {
          const peerIdList: string[] = [];
          logs.forEach((log: string) => {
            // 部屋存在チェック処理
            const logObj = JSON.parse(log);

            const logTexts = [];
            logTexts.push(`peerId: ${logObj.message.src}`);
            logTexts.push(`type: ${logObj.messageType}`);
            if (logObj.messageType === "ROOM_DATA")
              logTexts.push(`data: ${logObj.message.data.type}`);
            // window.console.log(`logInfo: [${logTexts.join(", ")}]`);
            if (
              logObj.messageType === "ROOM_DATA" &&
              logObj.message.data.type === "NOTICE_SELF_INFO" &&
              logObj.message.data.value.roomName === roomName
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
          // qLog(
          //   `Room存在確認 => name: ${roomName} 存在: ${
          //     isExist ? "する" : "しない"
          //   } peerId:`,
          //   peerIdList
          // );
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
     * @param commit
     * @param rootGetters
     */
    logout({
      dispatch,
      commit,
      rootGetters
    }: {
      dispatch: Function;
      commit: Function;
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
      commit("updateWebRtcRoom", { room: null, isWait: false });
      commit("updateIsJoined", false);

      const peer = rootGetters.webRtcPeer(false);
      if (peer && peer.destroyed) {
        peer.destroy();
        commit("updateWebRtcPeer", {
          peer: null,
          isWait: false
        });
      }
    },

    /**========================================================================
     * ログアウト処理（待ち中の通信の廃棄）
     *=========================================================================
     * @param commit
     * @param rootGetters
     */
    logoutWait({
      commit,
      rootGetters
    }: {
      commit: Function;
      rootGetters: any;
    }) {
      const peer = rootGetters.webRtcPeer(true);
      if (peer && peer.destroyed) {
        peer.destroy();
        commit("updateWebRtcPeer", { peer: null, isWait: true });
        commit("updateWebRtcRoom", { room: null, isWait: true });
        commit("updatePeerId", { peerId: null, isWait: true });
      }
    },

    /**========================================================================
     * データ送信
     *=========================================================================
     * @param rootGetters
     * @param payload
     */
    sendRoomData({ rootGetters }: { rootGetters: any }, payload: any) {
      const room = rootGetters.webRtcRoom(payload.isWait);
      if (!room) return;
      // if (payload && payload.type !== "NOTICE_INPUT") {
      //   const msgList: any[] = [];
      //   msgList.push(`TYPE: ${payload.type}`);
      //   if (payload.type === "DO_METHOD") {
      //     msgList.push("METHOD:");
      //     msgList.push(payload.method);
      //   }
      //   msgList.push("VALUE:");
      //   msgList.push(payload.value);
      //   msgList.push("targets:");
      //   msgList.push(payload.targets);
      //   msgList.push("this.peerId:");
      //   msgList.push(rootGetters.peerId(payload.isWait));
      //   qLog("RoomData送信 =>", ...msgList);
      // }
      room.send(payload);
    },

    /**========================================================================
     * 新しい部屋をつくる
     *=========================================================================
     * @param dispatch
     * @param roomName
     * @param roomPassword
     * @param playerName
     * @param playerPassword
     * @param playerType
     * @param fontColor
     * @param system
     * @param isWait
     */
    doNewRoom(
      { dispatch }: { dispatch: Function },
      {
        roomName,
        roomPassword = "",
        playerName,
        playerPassword = "",
        playerType = "PL",
        fontColor,
        system,
        isWait = false
      }: {
        roomName: string;
        roomPassword: string;
        playerName: string;
        playerPassword: string;
        playerType: string;
        fontColor: string;
        system: string;
        isWait: boolean;
      }
    ): Promise<any> {
      return new Promise((resolve: Function) => {
        // 部屋に接続する
        dispatch("joinPlayer", {
          roomName: roomName,
          roomPassword: roomPassword,
          playerName: playerName,
          playerPassword: playerPassword,
          playerType: playerType,
          fontColor: fontColor,
          useWindow: true,
          useAlert: true,
          isWait: isWait
        })
          .then()
          .catch((err: any) => {
            if (err) window.console.error(err);
          });

        // 利用システムの設定
        dispatch("setProperty", {
          property: "public.room",
          value: {
            system: system,
            password: roomPassword
          },
          logOff: true
        });

        dispatch("afterRoomJoin", {
          roomName,
          roomPassword,
          playerName,
          playerPassword,
          playerType,
          fontColor,
          isWait,
          system
        });

        resolve();
      });
    },

    /**========================================================================
     * 入室処理
     *=========================================================================
     * @param dispatch
     * @param roomName
     * @param roomPassword
     * @param playerName
     * @param playerPassword
     * @param playerType
     * @param fontColor
     * @param useWindow
     * @param useAlert
     * @param isWait
     * @param system
     */
    doJoinRoom(
      { dispatch }: { dispatch: Function },
      {
        roomName,
        roomPassword,
        playerName,
        playerPassword,
        playerType,
        fontColor,
        useWindow,
        useAlert,
        system,
        isWait
      }: {
        roomName: string;
        roomPassword: string;
        playerName: string;
        playerPassword: string;
        playerType: string;
        fontColor: string;
        useWindow: boolean;
        useAlert: boolean;
        system: string;
        isWait: boolean;
      }
    ): Promise<any> {
      return new Promise((resolve: Function, reject: Function) => {
        // 部屋に接続する
        dispatch("joinPlayer", {
          roomName,
          roomPassword: roomPassword || "",
          playerName,
          playerPassword,
          playerType,
          fontColor,
          useWindow,
          useAlert,
          isWait
        })
          .then(
            ({
              playerName,
              playerPassword,
              playerType,
              fontColor
            }: {
              playerName: string;
              playerPassword: string;
              playerType: string;
              fontColor: string;
            }) => {
              dispatch("afterRoomJoin", {
                roomName,
                roomPassword,
                playerName,
                playerPassword,
                playerType,
                fontColor,
                isWait,
                system
              });
              resolve();
            }
          )
          .catch((err: any) => {
            if (err) window.console.error(err);
            reject();
          });
      });
    },

    /**
     * ====================================================================================================
     * 入室後の処理
     */
    afterRoomJoin(
      {
        dispatch,
        rootGetters,
        commit
      }: {
        dispatch: Function;
        rootGetters: any;
        commit: Function;
      },
      {
        roomName,
        roomPassword,
        playerName,
        playerPassword,
        playerType,
        fontColor,
        system,
        isWait
      }: {
        roomName: string;
        roomPassword: string;
        playerName: string;
        playerPassword: string;
        playerType: string;
        fontColor: string;
        system: string;
        isWait: boolean;
      }
    ) {
      // プレイヤーを追加する
      dispatch("addPlayer", {
        peerId: rootGetters.peerId(isWait),
        name: playerName,
        password: playerPassword,
        type: playerType,
        fontColor: fontColor,
        isWait: isWait
      });

      dispatch("setProperty", {
        property: "public.room.name",
        value: roomName,
        logOff: true
      });

      // URLを書き換える（リロードなし）
      const paramList: string[] = [];
      paramList.push(`roomName=${roomName}`);
      paramList.push(`roomPassword=${roomPassword || ""}`);
      paramList.push(`system=${system}`);
      paramList.push(`playerName=${playerName}`);
      paramList.push(`playerPassword=${playerPassword}`);
      paramList.push(`playerType=${playerType}`);
      const newUrl = `?${paramList.join("&")}`;
      window.history.replaceState("", "", newUrl);

      // 格納しているパラメータ値を更新
      dispatch("setProperty", {
        property: "param",
        value: {
          roomName: roomName,
          roomPassword: roomPassword || "",
          playerPassword: playerPassword,
          playerName: playerName,
          playerType: playerType
        },
        logOff: true
      });

      // qLog(`Room: ${roomName} のルームメンバーとして認識されました。`);

      // チャット追加
      dispatch("addChatLog", {
        name: rootGetters.systemLog.name,
        text: `${playerName} が入室しました。`,
        color: rootGetters.systemLog.colorKey,
        tab: rootGetters.systemLog.tab,
        target: "groupTargetTab-0",
        from: rootGetters.systemLog.from,
        owner: rootGetters.systemLog.from
      });

      dispatch("windowOpen", "private.display.playerBoxWindow");

      dispatch("sendRoomData", {
        type: "NOTICE_SELF_INFO",
        value: {
          playerName: playerName,
          playerPassword: playerPassword,
          playerType: playerType,
          fontColor: fontColor,
          roomName: roomName
        },
        isWait: isWait
      });

      // モーダル状態の解除
      commit("updateIsModal", false);

      // 入室状態
      commit("updateIsJoined", true);
    }
  }
};
