export default {
  /** マップ */
  state: {
    list: [
      {
        key: `map-0`,
        imageTag: "imgTag-1",
        imageKey: "image-0",
        isReverse: false,
        margin: {
          gridSize: 5,
          gridColor: "#FFFFFF",
          maskColor: "#145014",
          maskAlpha: 0.1,
          isUseGridColor: true,
          isUseImage: false,
          borderWidth: 10
        },
        grid: { totalColumn: 20, totalRow: 15, size: 48, color: "#000000" },
        background: "#92A8B3",
        chatLinkage: 0,
        chatLinkageSearch: ""
      }
    ],
    isEditing: null,
    maxKey: 0,
    current: "map-0"
  },
  actions: {},
  mutations: {},
  getters: {
    currentMap: (state: any) =>
      state.list.filter((map: any) => map.key === state.current)[0],
    getBackgroundImage: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      const imageObj = rootGetters.imageList.filter(
        (image: any) => image.key === getters.currentMap.imageKey
      )[0];
      return imageObj ? imageObj.data : null;
    },
    marginGridColor: (state: any, getters: any): string =>
      getters.currentMap.margin.gridColor,
    marginMaskColor: (state: any, getters: any): string =>
      getters.currentMap.margin.maskColor,
    marginMaskAlpha: (state: any, getters: any): number =>
      getters.currentMap.margin.maskAlpha,
    isUseGridColor: (state: any, getters: any): boolean =>
      getters.currentMap.margin.isUseGridColor,
    isUseImage: (state: any, getters: any): boolean =>
      getters.currentMap.margin.isUseImage,
    columns: (state: any, getters: any): number =>
      getters.currentMap.grid.totalColumn,
    rows: (state: any, getters: any): number =>
      getters.currentMap.grid.totalRow,
    gridSize: (state: any, getters: any): number =>
      getters.currentMap.grid.size,
    borderWidth: (state: any, getters: any): number =>
      getters.currentMap.margin.borderWidth,
    marginGridSize: (state: any, getters: any): number =>
      getters.currentMap.margin.gridSize,
    isMapEditing: (state: any, getters: any): boolean =>
      getters.currentMap.isEditing,
    gridColor: (state: any, getters: any): string =>
      getters.currentMap.grid.color,
    isReverse: (state: any, getters: any): boolean =>
      getters.currentMap.isReverse,
    canvasSize(state: any, getters: any) {
      return {
        w: getters.columns * getters.gridSize,
        h: getters.rows * getters.gridSize
      };
    },
    backgroundColor: (state: any, getters: any) => getters.currentMap.background
  } /* end of getters */
};
