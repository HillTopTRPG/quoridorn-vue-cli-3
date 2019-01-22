// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from "vue";
import Vuex from "vuex";
import JSZip from "jszip";
import saveAs from "file-saver";

Vue.use(Vuex);

/**
 * Store
 */
export default {
  actions: {
    /**
     * セーブデータ作成を開始する
     * @param dispatch
     * @param rootState
     * @param rootGetters
     */
    exportStart({
      dispatch,
      rootState,
      rootGetters
    }: {
      dispatch: Function;
      rootState: any;
      rootGetters: any;
    }) {
      if (rootGetters.members.length === 0) {
        alert("現在「保存」機能はご利用いただけません。");
        return;
      }
      // 連想配列の中身を空にする
      for (const playerKey in rootGetters.volatilePrivateData) {
        if (!rootGetters.volatilePrivateData.hasOwnProperty(playerKey))
          continue;
        delete rootGetters.volatilePrivateData.hasOwnProperty[playerKey];
      }
      const privateData = JSON.parse(JSON.stringify(rootState.private));
      // 開いてないディスプレイ情報は送信データに含めない
      for (const key in privateData.display) {
        if (!privateData.display.hasOwnProperty(key)) continue;
        if (key === "undefined" || !privateData.display[key].isDisplay) {
          delete privateData.display[key];
        } else {
          delete privateData.display[key].command;
          delete privateData.display[key].zIndex;
        }
      }
      rootGetters.volatilePrivateData[rootGetters.playerKey] = privateData;
      if (rootGetters.members.length === 1) {
        dispatch("doExport");
      } else {
        dispatch("sendRoomData", { type: "REQUEST_PRIVATE_DATA", value: null });
      }
    },

    /**
     * セーブデータ作成を実行する
     * @param dispatch
     * @param rootState
     * @param rootGetters
     */
    doExport({
      dispatch,
      rootState,
      rootGetters
    }: {
      dispatch: Function;
      rootState: any;
      rootGetters: any;
    }) {
      // セーブデータのベース作成
      const saveData = JSON.parse(
        JSON.stringify({
          public: rootState.public,
          dataVersion: "1.0.0"
        })
      );
      saveData.public.room.members = [];

      const addKeyList: string[] = [];
      const delKeyList: string[] = [];
      for (const playerKey in rootGetters.volatilePrivateData) {
        if (!rootGetters.volatilePrivateData.hasOwnProperty(playerKey))
          continue;

        // セーブデータ内のplayerのリストに各プレイヤーのprivateデータを持たせる
        const playerPrivateObj: any =
          rootGetters.volatilePrivateData[playerKey];
        saveData.public.player.list.forEach((player: any) => {
          if (player.key !== playerPrivateObj.self.playerKey) return;
          player.private = playerPrivateObj;
        });

        // 各プレイヤーのデータの操作履歴をまとめる
        const historyList = playerPrivateObj.historyList;
        delete playerPrivateObj.historyList;

        historyList.forEach((history: any) => {
          if (history.type === "add") addKeyList.push(history.key);
          if (history.type === "del") delKeyList.push(history.key);
        });
      }

      // 削除したデータが追加したデータに含まれている場合は双方のリストから消す
      const delKeyDelList: string[] = [];
      delKeyList.forEach((delKey: string) => {
        const index = addKeyList.findIndex(
          (addKey: string) => addKey === delKey
        );
        if (index > -1) {
          addKeyList.splice(index, 1);
          delKeyDelList.push(delKey);
        }
      });
      delKeyDelList.forEach((delKeyDel: string) => {
        const index = delKeyList.findIndex(
          (delKey: string) => delKey === delKeyDel
        );
        delKeyList.splice(index, 1);
      });

      // この時点で削除リストはプリセットデータの削除のみとなっているはず
      // → 対象のkeyのリストが保存データに含まれれば、ロード時に十分なデータとなる
      saveData.delKeyList = delKeyList;

      // ここからは追加データ間の関連データを調べ、差分データとして用意する
      const imageKeys = addKeyList.filter(key => key.split("-")[0] === "image");
      const getAfterKey = (beforeKey: string) => {
        const matchKey = imageKeys.filter(
          imageKey => imageKey === beforeKey
        )[0];
        if (!matchKey) return beforeKey;
        return matchKey.replace(
          /[0-9]+/,
          () => `$${imageKeys.indexOf(matchKey)}`
        );
      };
      const imgTagKeys = addKeyList.filter(
        key => key.split("-")[0] === "imgTag"
      );
      // 画像を持つオブジェクトを全部まとめた配列にし、そこから参照される画像ファイルをすべて相対参照に変換する
      const hasImgObjList: any[] = rootState.public.character.list.concat(
        rootState.public.chit.list
      );
      const hasImgKeys = addKeyList.filter(key => {
        const index = hasImgObjList.findIndex(obj => obj.key === key);
        return index > -1;
      });
      const addObjList: any[] = addKeyList.map(key => {
        const obj = JSON.parse(JSON.stringify(rootGetters.getObj(key)));
        // 画像を持つオブジェクトなら "useImageList" があるはず
        let useImageList = obj.useImageList;
        if (useImageList) {
          const useImageKeys = useImageList
            .split("|")
            .map((str: string) => str.replace(":R", ""));
          useImageKeys.forEach((uiKey: string) => {
            const afterKey = getAfterKey(uiKey);
            useImageList = useImageList.replace(uiKey, afterKey);
          });
          obj.useImageList = useImageList;
        }
        const imageKey = obj.imageKey;
        if (imageKey) {
          obj.imageKey = getAfterKey(imageKey);
        }
        return obj;
      });
      addObjList.forEach(addObj => {
        const prefix = addObj.key.split("-")[0];
        if (prefix === "image") {
          addObj.key = getAfterKey(addObj.key);
        } else {
          addObj.key = addObj.key.replace(/[0-9]+/, "?");
        }
      });

      // 追加データに記録されるものは二重管理となるため削除
      delete saveData.public.character;
      delete saveData.public.chit;
      delete saveData.public.mapMask;
      delete saveData.public.image;
      delete saveData.public.bgm;

      // お試しデータのカードデッキはとりあえず削除
      delete saveData.public.deck;

      saveData.addObjList = addObjList;

      // zipファイルの生成
      const zip = new JSZip();
      zip.file("save.json", JSON.stringify(saveData, undefined, 2));
      zip.generateAsync({ type: "blob" }).then((blob: any) => {
        const d = new Date();
        saveAs(
          blob,
          `Quoridorn_${d.getFullYear()}${d.getMonth() +
            1}${d.getDate()}_${d.getHours()}${d.getMinutes()}${d.getSeconds()}.zip`
        );
      });
    },
    importStart(
      { dispatch, rootState }: { dispatch: Function; rootState: any },
      zipFiles: any[]
    ) {
      const zip: any = new JSZip();
      const zipList: any[] = [];
      const promiseList: PromiseLike<any>[] = [];
      for (const file of zipFiles) {
        promiseList.push(
          new Promise(resolve => {
            zip.loadAsync(file).then((zip: any) => {
              // you now have every files contained in the loaded zip
              zip
                .file("save.json")
                .async("string")
                .then((jsonStr: string) => {
                  const saveData = JSON.parse(jsonStr);
                  zipList.push({
                    fileName: file.name,
                    saveData: saveData
                  });
                  resolve();
                });
            });
          })
        );
      }
      Promise.all(promiseList).then(() => {
        rootState.private.display.dropZipWindow.zipList = zipList;
        dispatch("windowOpen", "private.display.dropZipWindow");
      });
    },
    doImport(
      { dispatch, rootState }: { dispatch: Function; rootState: any },
      importData: any
    ) {
      const publicData = importData.public;
      const privateData = importData.private;
      const importFunc = () => {
        // 設定データは上書きでいい
        if (publicData.setting) {
          rootState.public.setting = publicData.setting;
        }
        // FIXME
        // チャットデータは上書きでいい…かな？（差分方式がいい気もしている
        if (publicData.chat) {
          rootState.public.chat = publicData.chat;
        }
        // TODO 追加された画像を元に、各プレイヤーの履歴情報を更新すること。
        let addImageKeyList: string[];
        if (publicData.image) {
          addImageKeyList = publicData.image.list.map((imgObj: any) => {
            dispatch("doAddImage", imgObj);
            return `image-${rootState.public.image.maxKey}`;
          });
          const func = (hisObj: any) => {
            let key = hisObj.key;
            if (key.split("-")[0] === "image") {
              const matchObj = key.match(/\$([0-9]+)/);
              const index = parseInt(matchObj[1], 10);
              hisObj.key = addImageKeyList[index];
            }
          };
          privateData.history.forEach(func);
          publicData.room.members.forEach((memberObj: any) => {
            memberObj.private.history.forEach(func);
          });
        }
        if (publicData.map) {
          rootState.public.map = publicData.map;
        }
        if (publicData.mapMask) {
          publicData.mapMask.list.forEach((mapMaskObj: any) => {
            dispatch("doAddPieceInfo", mapMaskObj);
          });
        }
        // TODO 追加されたキャラクターを元に、各プレイヤーの履歴情報を更新すること。
        // let addCharacterKeyList = null
        if (publicData.character) {
          // addCharacterKeyList =
          publicData.character.list.map((charObj: any) => {
            let useImageList = charObj.useImageList;
            addImageKeyList.forEach((key, index) => {
              useImageList = useImageList.replace(
                new RegExp(`image-\\$${index}$`, "g"),
                key
              );
            });
            charObj.useImageList = useImageList;
            dispatch("doAddPieceInfo", charObj);
            return `character-${rootState.public.character.maxKey}`;
          });
        }
        // TODO 追加されたチットを元に、各プレイヤーの履歴情報を更新すること。
        // let addChitKeyList = null
        if (publicData.chit) {
          // addChitKeyList =
          publicData.chit.list.map((chitObj: any) => {
            let imageKey = chitObj.imageKey;
            addImageKeyList.forEach((key, index) => {
              imageKey = imageKey.replace(
                new RegExp(`image-\\$${index}$`, "g"),
                key
              );
            });
            chitObj.imageKey = imageKey;
            dispatch("doAddPieceInfo", chitObj);
            return `chit-${rootState.public.chit.maxKey}`;
          });
        }
        if (publicData.publicMemo) {
          rootState.public.publicMemo = publicData.publicMemo;
        }
        if (publicData.room.members.length > 0) {
          dispatch("windowOpen", "private.display.selectPeerWindow");
        }
      };
      if (publicData.room && publicData.room.name !== "") {
        const roomName = publicData.room.name;
        const peerId = privateData.self.peerId;
        // 部屋の存在チェック
        dispatch("checkRoomName", {
          roomName: roomName,
          /** 部屋が見つかったときのコールバック */
          roomFindFunc: () => {
            // 部屋が見つかったら接続しにいく。他のセーブデータは使わない。
            rootState.private.display.confirmLoadRoomWindow.importData = importData;
            dispatch("windowOpen", "private.display.confirmLoadRoomWindow");
          },
          /** 部屋が見つからなかったときのコールバック */
          roomNonFindFunc: () => {
            // ルームメンバーを自分も含めて、一旦入室前の状態にする
            rootState.public.room = publicData.room;

            if (peerId) {
              // TODO 引数修正
              dispatch("createPeer", { peerId: peerId, roomName: roomName });
            }
            importFunc();
          }
        });
      } else {
        // セーブデータに部屋情報が無いなら、単にログアウトしてからロード処理をする
        dispatch("logout");
        importFunc();
      }
    }
  }
};
