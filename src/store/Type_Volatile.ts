export type Locate = {
  x: number;
  y: number;
};

export type Matrix = {
  c: number;
  r: number;
};

export interface VolatileMouse extends Locate {
  drag: {
    from: Locate;
    move: Locate;
  };
}

export type DiceSystem = {
  system: string;
  name: string;
};

type VolatileChat = {
  activeChatTab: string;
  hoverChatTab: string;
  actorKey: string;
  diceSystemList: DiceSystem[];
};

export type VolatileMapMoveObjInfo = {
  isMoving: boolean;
  key: string;
};

export type VolatileMapRollObjInfo = {
  isRolling: boolean;
  key: string;
};

export type VolatileMapMoveInfo = {
  from: Locate;
  total: Locate;
  dragging: Locate;
};

export type VolatileMapAngleInfo = {
  dragging: number;
  dragStart: number;
};

type VolatileMap = {
  grid: Matrix;
  mouse: {
    onScreen: Locate;
    onTable: Locate;
    onCanvas: Locate;
  };
  isDraggingLeft: boolean;
  isMouseDownRight: boolean;
  isDraggingRight: boolean;
  isOverEvent: boolean;
  move: VolatileMapMoveInfo;
  moveObj: VolatileMapMoveObjInfo;
  rollObj: VolatileMapRollObjInfo;
  angle: VolatileMapAngleInfo;
};

export type Dice = { [P in string]: string };
export type DiceInfo = {
  type: string;
  label: string;
  pips: Dice[];
};
export type VolatileDice = { [P in string]: DiceInfo[] };

export type Volatile = {
  mouse: VolatileMouse;
  self: { webRtcPeer: any | null; webRtcPeerWait: any | null };
  param: {
    roomName: string | null;
    roomPassword: string | null;
    playerName: string | null;
    playerPassword: string | null;
    playerType: string | null;
    system: string | null;
  };
  room: {
    webRtcRoom: any;
    webRtcRoomWait: any;
    isExist: boolean;
    isJoined: boolean;
  };
  chat: VolatileChat;
  map: VolatileMap;
  deck: {
    viewMode: string;
    hoverIndex: number;
    hoverKey: string;
    command: string | null;
    isReverse: boolean;
  };
  dice: VolatileDice;
  volatileSaveData: {
    players: [];
  };
  mode: {
    isModal: boolean;
    isLoading: number;
    isWait: boolean;
  };
};