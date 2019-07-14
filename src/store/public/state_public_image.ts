export default {
  /** 画像 */
  state: {
    /** 画像のタグ */
    tags: {
      list: [
        { key: "imgTag-0", name: "(全て)" },
        { key: "imgTag-1", name: "マップ" },
        { key: "imgTag-2", name: "キャラクター" },
        { key: "imgTag-3", name: "フロアタイル" },
        { key: "imgTag-4", name: "立ち絵" }
      ],
      maxKey: 4
    },

    /** 画像のプリセットデータ */
    list: [],
    maxKey: -1
  },
  actions: {},
  mutations: {},
  getters: {
    imageTagList: (state: any) => state.tags.list,
    imageList: (state: any) => state.list,
    imageListTagStringList: (state: any, getter: any): string[] => {
      const resultList: string[] = [];
      const regExp = new RegExp("[ 　]+", "g");
      getter.imageList.forEach((imageObj: any) => {
        const tagList: string[] = imageObj.tag.split(regExp);
        tagList.forEach(imageTagStr => {
          const index = resultList.findIndex(result => result === imageTagStr);
          if (index < 0) resultList.push(imageTagStr);
        });
      });
      return resultList;
    },
    imageListFromTagKey: (state: any, getter: any): Function => (
      tagKey: string
    ): any[] => {
      // (全て)なら全部
      if (tagKey === "imgTag-0") return getter.imageList;

      return getter.imageList.filter(
        (obj: any) =>
          obj.tag
            .split(" ")
            .map(
              (tagName: string) =>
                getter.imageTagList.filter(
                  (imageTag: any) => imageTag.name === tagName
                )[0]
            )
            .filter((imageObj: any) => imageObj.key === tagKey)[0]
      );
    }
  }
};
