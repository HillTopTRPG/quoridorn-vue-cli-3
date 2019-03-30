// URLパラメータ取得処理
export function getUrlParam(
  name: string,
  url: string = window.location.href
): any {
  name = name.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  let results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/(\+)|(¥%20)/g, " "));
}

export function qLog(...a: any): void {
  // window.console.log(...arguments)

  let format = "";
  const logs = [];

  format += "%c%s";
  logs.push("color:blue; font-weight: bold;");
  logs.push("[System]");

  const args: any[] = [];
  let str = "";
  Array.prototype.slice.call(arguments).forEach(arg => {
    if (toString.call(arg) === "[object String]") {
      str += ` ${arg}`;
    } else {
      args.push(str.trim());
      str = "";
      args.push(arg);
    }
  });
  if (str !== "") {
    args.push(str.trim());
  }

  args.forEach((arg: any) => {
    const indent = "        ";
    const toString = Object.prototype.toString;
    if (toString.call(arg) === "[object String]") {
      const m1 = arg.match(/^(\[[^\]]+])(.+)$/);
      if (m1) {
        format += `%c${format.endsWith("\n") ? indent : ""}${m1[1]}`;
        logs.push("color:blue; font-weight: bold;");
        arg = m1[2];
      }
      const m2 = arg.match(/^ *(.+) +=> *(.*)$/);
      if (m2) {
        format += `%c${m2[1]}`;
        logs.push(
          "color:magenta; font-size: 120%; margin-left: 0.5em; font-weight: bold; border-radius: 3px; border: 1px solid magenta; padding: 1px 4px;"
        );
        format += `%c=>`;
        logs.push("margin: 0 0.5em;");
        arg = m2[2];
      }
      let m3;
      while (
        arg &&
        (m3 = arg.match(
          /^( *[^:]* +)?(([^ ]+) *: *((\([^)]+\))|([^ ,]*)))([ ,]+.+)?$/
        ))
      ) {
        // (\([^)]+\))|
        // window.console.log(arg)
        // window.console.log(m3)
        if (m3[1]) {
          format += `%c${format.endsWith("\n") ? indent : ""}${m3[1]}`;
          logs.push("");
        }
        format += `%c${format.endsWith("\n") ? indent : ""}${m3[3]}:`;
        logs.push(
          "color:white; background-color: green; font-weight: bold; padding: 1px 4px; border-radius: 0px; border: 1px solid green; border-right: none;"
        );
        format += `%c${m3[4] || m3[5] || ""}`;
        logs.push(
          "color:green; background-color: white; font-weight: bold; padding: 1px 4px; border-radius: 0px; border: 1px solid green; border-left: none;"
        );
        arg = m3[7];
      }
      if (arg) {
        format += `%c${format.endsWith("\n") ? indent : ""}${arg}`;
        logs.push("");
      }
    } else if (toString.call(arg) === "[object Array]") {
      format += "%c%s";
      logs.push("color: blue;");
      logs.push(`[ ${arg.join(", ")} ]`);
    } else if (toString.call(arg) === "[object Undefined]") {
      format += "%s";
      logs.push(arg);
    } else {
      const jsonStr = JSON.stringify(arg, undefined, 2)
        .split("\n")
        .map(line => `${indent}${line}`)
        .join("\n");

      // Objectを整形して出力するかそのまま出力するか
      if (jsonStr.length > 0) {
        format += "%O";
        logs.push(arg);
      } else {
        format += "%c\n%s\n";
        logs.push("color: blue;");
        logs.push(jsonStr);
      }
    }
  });
  window.console.log(format, ...logs);
}

/**
 * 文字列をクリップボードにコピーする
 * @param text
 */
export function execCopy(text: string): boolean {
  const temp = document.createElement("div");

  temp.appendChild(document.createElement("pre")).textContent = text;

  const s = temp.style;
  s.position = "fixed";
  s.left = "-100%";

  document.body.appendChild(temp);
  document.getSelection()!.selectAllChildren(temp);

  const result = document.execCommand("copy");

  document.body.removeChild(temp);
  // true なら実行できている falseなら失敗か対応していないか
  return result;
}

export function removeExt(fileName: string): string {
  const matchExt: string[] | null = fileName.match(/(.*)(?:\.([^.]+$))/);
  return matchExt ? matchExt[1] : fileName;
}

export function getFileNameArgList(fileName: string): string[] {
  const matchExt: string[] | null = fileName.match(/(.*)(?:\.([^.]+$))/);

  const useFileName: string = matchExt ? matchExt[1] : fileName;
  const index: number = useFileName.indexOf("__");

  if (index < 0) return [];

  const argStr: string = useFileName.substring(index + 2).trim();

  return argStr ? argStr.split("_") : [];
}

export function toInitiativeObjList(
  format: string
): {
  property: string;
  min: number | string | null;
  max: number | string | null;
  type: string;
}[] {
  const absoluteTrans = (list: any[], index: number): boolean => {
    // 全角文字を半角に変換
    if (/^(ー?[０-９]+|？)$/.test(list[index])) {
      window.console.log(list[index]);
      list[index] = list[index].replace(/[ー０-９？]/g, (s: string) => {
        if (s === "ー") return "-";
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
      });
      window.console.log(list[index]);
    }
    if (list[index] === "?") return true;
    if (/^-?[0-9]+$/.test(list[index])) {
      list[index] = parseInt(list[index], 10);
      return true;
    }
    return false;
  };
  const check = (list: any[], index: number): number => {
    if (/^(-?[0-9]+|\?)$/.test(list[index])) return 1;
    if (/^(ー?[０-９]+|？)$/.test(list[index])) return 2;
    return 0;
  };
  const resultList: any = [];

  let colorPickIndex: number = 0;
  const colorList: string[] = [
    "#D40044",
    "#99CF30",
    "#0D2189",
    "#FF7F15",
    "#008679",
    "#56017B",
    "#FE411A",
    "#33A244",
    "#271383",
    "#FFE62F",
    "#035D86",
    "#AF0063"
  ];

  /* eslint no-irregular-whitespace: ["error", {"skipRegExps": true}] */
  if (format === "") return resultList;
  format.split(/[ 　]+/).forEach(str => {
    const fs: any[] = str.split(/[<＜]/);

    const obj: any = {
      type: "number",
      property: str,
      fromProperty: null,
      refStr: str,
      min: null,
      max: null,
      color: "#000"
    };

    // 想定外の多さ
    if (fs.length > 3) {
      resultList.push(obj);
      return;
    }

    // min＜item＜max
    if (fs.length === 3) {
      if (!absoluteTrans(fs, 0)) {
        resultList.push(obj);
        return;
      }
      if (!absoluteTrans(fs, 2)) {
        resultList.push(obj);
        return;
      }
      if (fs[0] === "?") {
        resultList.push({
          type: "min",
          property: fs[1] + "の最小値",
          fromProperty: fs[1],
          refStr: fs[1] + "-min",
          min: null,
          max: null
        });
      } else {
        obj.min = fs[0];
      }

      obj.property = fs[1];
      obj.refStr = fs[1];

      if (fs[2] !== "?") {
        obj.max = fs[2];
      }
      resultList.push(obj);
      if (fs[2] === "?") {
        resultList.push({
          type: "max",
          property: fs[1] + "の最大値",
          fromProperty: fs[1],
          refStr: fs[1] + "-max",
          min: null,
          max: null
        });
      }
    }

    // min<item or item<max
    if (fs.length === 2) {
      const check0 = check(fs, 0);
      const check1 = check(fs, 1);
      if ((check0 === 0 && check1 === 0) || (check0 > 0 && check1 > 0)) {
        resultList.push(obj);
        return;
      }
      if (check0 === 2) absoluteTrans(fs, 0);
      if (check1 === 2) absoluteTrans(fs, 1);
      if (check0 > 0) {
        if (fs[0] === "?") {
          resultList.push({
            type: "min",
            property: fs[1] + "の最小値",
            fromProperty: fs[1],
            refStr: fs[1] + "-min",
            min: null,
            max: null
          });
        } else {
          obj.min = fs[0];
        }

        obj.property = fs[1];
        obj.refStr = fs[1];

        resultList.push(obj);
      }
      if (check1 > 0) {
        obj.property = fs[0];
        obj.refStr = fs[0];

        if (fs[1] !== "?") obj.max = fs[1];
        resultList.push(obj);
        if (fs[1] === "?") {
          resultList.push({
            type: "max",
            property: fs[0] + "の最大値",
            fromProperty: fs[0],
            refStr: fs[0] + "-max",
            min: null,
            max: null
          });
        }
      }
    }

    // item
    if (fs.length === 1) {
      const checkMatchResult = fs[0].match(/^[*＊](.+)$/);
      if (checkMatchResult) {
        obj.type = "checkbox";

        obj.property = checkMatchResult[1];
        obj.refStr = checkMatchResult[1];

        // TODO 色の設定
        const color: string = colorList[colorPickIndex++];
        if (colorPickIndex >= colorList.length) colorPickIndex = 0;
        obj.color = color;
      }
      resultList.push(obj);
    }
  });
  return resultList;
}

export function sum(list: number[]): number {
  return list.reduce((accumlator, current) => accumlator + current);
}

export function arrangeInitiativeWidthList(
  widthList: number[],
  formatObjList: any[]
): number[] {
  const contentWidth = sum(widthList);
  const orderWidth = 20;
  const baseWidth = 30;
  const newWidthList = [
    orderWidth,
    baseWidth,
    baseWidth,
    baseWidth,
    ...formatObjList.map(() => baseWidth),
    0
  ];
  const textColumnWidth =
    contentWidth +
    (widthList.length - 1) -
    (newWidthList.length - 1) -
    sum(newWidthList);
  newWidthList[newWidthList.length - 1] = textColumnWidth;
  if (textColumnWidth < baseWidth) {
    newWidthList[newWidthList.length - 1] = baseWidth;
    const diffSum = baseWidth - textColumnWidth;
    const diff = Math.ceil(diffSum / newWidthList.length);
    const useDiffSum = diffSum - diff * newWidthList.length;
    newWidthList.forEach((val, index) => (newWidthList[index] -= diff));
    newWidthList[newWidthList.length - 1] -= useDiffSum;
  }
  return newWidthList;
}

export function listDelete(
  list: any[],
  filterFunc: (item: any, index: number) => {}
) {
  const deleteList: any[] = list.filter(filterFunc);
  const deleteIndexList: number[] = deleteList.map(deleteItem =>
    list.indexOf(deleteItem)
  );
  deleteIndexList.sort((n1: number, n2: number) => {
    if (n1 > n2) return -1;
    if (n1 < n2) return 1;
    return 0;
  });
  deleteIndexList.forEach(deleteIndex => list.splice(deleteIndex, 1));
}
