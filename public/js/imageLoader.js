export const previewFile = (el, file) => {
  // FileReaderオブジェクトを作成
  const reader = new FileReader();

  // ファイルが読み込まれたときに実行する
  reader.onload = function (e) {
    // 画像のURLはevent.target.resultで呼び出せる
    const imageUrl = e.target.result;
    // 画像のURLをimg要素にセット
    el.src = imageUrl;
  }

  // ファイルを読み込む
  reader.readAsDataURL(file);
}