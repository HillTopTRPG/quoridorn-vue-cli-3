<template>
  <spec-frame property="addEditBgmWindowSpec" label-str="BGM追加・編集画面" lastVersion="1.0.0b9" :isSpecFixed="true">
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作">
      <li>BGM設定画面の追加ボタンまたは編集ボタンをクリック</li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>「URL」と「タイトル」と「タグ」を入力して「確定」ボタンを押せばOK</li>
      <li>指定できる形式
        <ol>
          <li>Youtube動画の再生
            <ul>
              <li>Youtube動画のURLをそのままURLに指定すればOK</li>
              <li>利用している「YoutubeAPI」の利用規約として、Youtubeコントローラー（Youtubeの画面）を非表示にはできない</li>
            </ul>
          </li>
          <li>Quoridornを設置したサーバ内に配置したmp3ファイルの再生
            <ul>
              <li>mp3ファイルの絶対パスを指定するか、Quoridornのindex.htmlからの相対パスを指定すればOK</li>
              <li>同じサーバ内のmp3でないと、クロスオリジン制約で再生できない</li>
            </ul>
          </li>
          <li>DropBoxに設置したmp3ファイルの再生
            <ul>
              <li>DropBoxの操作で「共有」の「リンク」を作成し、そのURLを指定してすればOK<br>例）https://www.dropbox.com/s/vc7os1os5uyneac/Fade.mp3?dl=0</li>
            </ul>
          </li>
        </ol>
      </li>
      <li>
        CreditURL
        <ol>
          <li>Youtube動画でないURLを指定した場合にのみ設定可能</li>
          <li>再生中BGM一覧画面のサムネイルをクリックした際に、指定された「URL」より優先的に使われるURL<br>著作者のURLなどをこの項目にちゃんと指定しないと、サムネイルをクリックした時に「URL」が他の人に分かる仕様。</li>
        </ol>
      </li>
      <li>
        再生開始
        <ol>
          <li>0.1秒単位で再生開始の時点を指定する（最大10000：1000秒）</li>
        </ol>
      </li>
      <li>
        再生終了
        <ol>
          <li>0.1秒単位で再生開始の時点を指定する（最大10000：1000秒）</li>
          <li>マイナスを指定すると末尾からの時間指定</li>
        </ol>
      </li>
      <li>
        fadeIn
        <ol>
          <li>0.1秒単位でフェードインにかける時間を指定する（最大2000：200秒）</li>
          <li>時間をかけて音量0から再生前に指定されていた音量まで上がる</li>
        </ol>
      </li>
      <li>
        fadeOut
        <ol>
          <li>0.1秒単位でフェードアウトにかける時間を指定する（最大2000：200秒）</li>
          <li>時間をかけて元の音量から音量0まで下がる</li>
        </ol>
      </li>
    </spec-item>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <spec-item class-str="request" label-str="ユーザ要望">
      <li>画面にドロップインでmp3を再生したい<br>→技術検証が多く必要。かなり大変そう。WebRTCでできる方法知っている人は教えてほしい。</li>
    </spec-item>
    <!----------------------
     ! 未実装事項
     !--------------------->
    <spec-item class-str="unImplemented" label-str="未実装事項">
      <li>画面にドロップインでmp3を再生したい</li>
    </spec-item>
    <!----------------------
     ! 実装しない機能
     !--------------------->
    <spec-item class-str="unSupport" label-str="実装しない機能">
      <li>なし</li>
    </spec-item>
    <!----------------------
     ! 関連項目
     !--------------------->
    <spec-item class-str="ref" label-str="関連項目">
      <li><spec-link property="settingBgmWindowSpec" title-str="">BGM設定画面</spec-link></li>
    </spec-item>
  </spec-frame>
</template>

<script>
import SpecMixin from "./SpecMixin";
export default { mixins: [SpecMixin] };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./spec.css">
</style>
