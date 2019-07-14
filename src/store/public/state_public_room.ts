export default {
  /** 部屋情報 */
  state: {
    name: "",
    members: [],
    system: "DiceBot",
    password: ""
  },
  actions: {},
  mutations: {
    /**
     * ルームメンバを空にする
     * @param state
     * @returns { *[] }
     */
    emptyMember: (state: any) => state.members.splice(0, state.members.length)
  },
  getters: {
    members: (state: any): any[] => state.members,
    roomName: (state: any): string => state.name,
    roomPassword: (state: any): string => state.password,
    roomSystem: (state: any) => state.system,
    inviteUrl: (state: any, getters: any): string => {
      const baseUrl = location.href.replace(/\?.+$/, "");
      const params: string[] = [];
      params.push(`roomName=${getters.roomName}`);
      params.push(`roomPassword=${getters.roomPassword}`);
      params.push(`system=${getters.roomSystem}`);
      return `${baseUrl}?${params.join("&")}`;
    }
  }
};
