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
    exportStart({ dispatch, rootState }: { dispatch: Function, rootState: any }) {
      // 配列の中身を空にする
      rootState.volatileSaveData.members.splice(
        0,
        rootState.volatileSaveData.members.length
      );
      rootState.volatileSaveData.members.push(rootState.private);
      if (rootState.public.room.members.length <= 1) {
        dispatch("doExport");
      } else {
        dispatch("sendRoomData", { type: "REQUEST_PRIVATE_DATA", value: null });
      }
    },
    doExport({ dispatch, rootState }: { dispatch: Function, rootState: any }) {
      // セーブデータのベース作成
      const saveData = JSON.parse(
        JSON.stringify({
          private: rootState.private,
          public: rootState.public,
          dataVersion: "1.0.0"
        })
      );
      // 開いてないディスプレイ情報は保存データには含めない
      for (const key in saveData.private.display) {
        if (!saveData.private.display.hasOwnProperty(key)) continue;
        if (!saveData.private.display[key].isDisplay) {
          delete saveData.private.display[key];
        }
      }
      const historyAddKeys: string[] = [];
      const historyDelKeys: string[] = [];
      // 部屋情報のメンバーリストに、収集した各個人のデータを詰め込んでいく
      rootState.volatileSaveData.members.forEach((memberData: any) => {
        const peerId = memberData.self.peerId;
        const saveMemObj = saveData.public.room.members.filter(
          (saveMemObj: any) => saveMemObj.peerId === peerId
        )[0];
        if (saveMemObj) {
          saveMemObj.private = memberData;
        }
        memberData.history.forEach((hisObj: any) => {
          if (hisObj.type === "add") historyAddKeys.push(hisObj.key);
          if (hisObj.type === "del") historyDelKeys.push(hisObj.key);
        });
      });
      const imageKeys = historyAddKeys.filter(
        key => key.split("-")[0] === "image"
      );
      const imgTagKeys = historyAddKeys.filter(
        key => key.split("-")[0] === "imgTag"
      );
      const hasImgKeys = historyAddKeys.filter(key => {
        const prefex = key.split("-")[0];
        // 今のところ、画像を持つのはキャラクターだけだが、ここに or で接頭語判定を増やしていく
        return prefex === "character" || prefex === "chit";
      });
      // 画像を持つオブジェクトを全部まとめた配列にし、そこから参照される画像ファイルをすべて相対参照に変換する
      const hasImgObjList = rootState.public.character.list.concat(
        rootState.public.chit.list
      );
      const filteredHasImgKeys = hasImgKeys.map(hiKey => {
        let hiObj = hasImgObjList.filter((hiObj: any) => hiObj.key === hiKey)[0];
        if (!hiObj) {
          return null;
        }
        hiObj = JSON.parse(JSON.stringify(hiObj));
        let useImageList = hiObj.useImageList;
        if (useImageList) {
          const useImageKeys = useImageList
            .split("|")
            .map((str: string) => str.replace(":R", ""));
          useImageKeys.forEach((uiKey: string) => {
            const matchKey = imageKeys.filter(iKey => iKey === uiKey)[0];
            if (!matchKey) return;
            const afterKey = matchKey.replace(
              /[0-9]+/,
              () => `$${imageKeys.indexOf(matchKey)}`
            );
            useImageList = useImageList.replace(matchKey, afterKey);
          });
          hiObj.useImageList = useImageList;
        }
        let imageKey = hiObj.imageKey;
        if (imageKey) {
          const matchKey = imageKeys.filter(iKey => iKey === imageKey)[0];
          if (matchKey) {
            const afterKey = matchKey.replace(
              /[0-9]+/,
              () => `$${imageKeys.indexOf(matchKey)}`
            );
            imageKey = imageKey.replace(matchKey, afterKey);
            hiObj.imageKey = imageKey;
          }
        }
        return hiObj;
      });

      const func = (hisObj: any) => {
        const prefex = hisObj.key.split("-")[0];
        if (prefex === "image") {
          hisObj.key = hisObj.key.replace(
            /[0-9]+/,
            () => `$${imageKeys.indexOf(hisObj.key)}`
          );
        }
        if (prefex === "character" || prefex === "chit") {
          hisObj.key = hisObj.key.replace(
            /[0-9]+/,
            () => `$${hasImgKeys.indexOf(hisObj.key)}`
          );
        }
      };
      saveData.private.history.forEach(func);
      saveData.public.room.members.forEach((memberData: any) => {
        memberData.private.history.forEach(func);
      });

      // キャラクター一覧
      saveData.public.character.list = filteredHasImgKeys.filter(hiObj => {
        if (!hiObj) return false;
        return hiObj.key.split("-")[0] === "character";
      });
      delete saveData.public.character.maxKey;

      // チット一覧
      saveData.public.chit.list = filteredHasImgKeys.filter(hiObj => {
        if (!hiObj) return false;
        return hiObj.key.split("-")[0] === "chit";
      });
      delete saveData.public.chit.maxKey;

      // 画像一覧
      saveData.public.image.list = imageKeys
        .map(iKey => {
          const imgObj = rootState.public.image.list.filter(
            (imgObj: any) => imgObj.key === iKey
          )[0];
          return !imgObj ? null : imgObj;
        })
        .filter(iObj => {
          return iObj !== null;
        });
      saveData.public.image.deleteList = historyDelKeys;
      delete saveData.public.image.maxKey;

      // 画像タグ一覧
      saveData.public.image.tags.list = imgTagKeys
        .map(itKey => {
          const imgTagObj = rootState.public.image.tags.list.filter(
            (imgObj: any) => imgObj.key === itKey
          )[0];
          return !imgTagObj ? null : imgTagObj;
        })
        .filter(itObj => {
          return itObj !== null;
        });
      saveData.public.image.tags.deleteList = historyDelKeys;
      delete saveData.public.image.tags.maxKey;

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
    importStart({ dispatch, rootState }: { dispatch: Function, rootState: any }, zipFiles: any[]) {
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
    doImport({ dispatch, rootState }: { dispatch: Function, rootState: any }, importData: any) {
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
