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
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// quoridornLog = window.console.log.bind(console, '%c[System] %c%s', 'color:blue;font-weight:bold', '')

export function quoridornLog(...a: any): void {
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
      logs.push(arg.join(", "));
    } else {
      const jsonStr = JSON.stringify(arg, undefined, 2)
        .split("\n")
        .map(line => `${indent}${line}`)
        .join("\n");
      if (jsonStr.length > 200) {
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

  // // あとで元に戻すためにバックアップ
  // const backupPrepare = Error.prepareStackTrace
  //
  // // 第2引数に渡した関数はスタックトレースから除外される
  // Error.captureStackTrace(this, quoridornLog)
  //
  // Error.prepareStackTrace = function (_, stack) {
  //   // window.console.log('---------------------', stack)
  //   // stackはCallSiteオブジェクトの配列
  //   stack.forEach(function (callSite, i, self) {
  //     // if (i < stack.length - 1) return
  //     // window.console.log(i, self.length, self)
  //     let fileName = callSite.getFileName()
  //     // window.console.log('FileName', fileName)
  //     if (fileName) {
  //       fileName = fileName.replace(/^.+\//, '')
  //     }
  //     const lineNumber = callSite.getLineNumber()
  //     const txt = `${i} ${fileName}:${lineNumber}`
  //     format += '%c%s'
  //     logs.push('margin-left: 20px; color:white; border-radius: 3px; background-color: black; padding: 2px 5px;')
  //     logs.push(txt)
  //     // window.console.log(format, ...logs)
  //   })
  // }
  //
  // // stackプロパティにアクセスしないとprepareStackTraceが呼ばれない
  // this.stack
  //
  // // デフォルトのprepareStackTrace関数に戻す
  // setTimeout(() => {
  //   Error.prepareStackTrace = backupPrepare
  // })
}

// quoridornLog('aaaa -> bbb: val1', {rrr: 123, qqq: 432}, 'bbb ccc: val2 ddd', {ppp: 222, fff: 4444})
