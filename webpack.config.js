const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //css파일과 main.js를 서로 다른 파일로 만들기 위해서 필요한 코드
const path  = require("path");

const BASE_JS = "./src/client/js/";

module.exports = {
    entry: {
        main: BASE_JS + "main.js",
        videoPlayer: BASE_JS + "videoPlayer.js",
        recorder: BASE_JS + "recorder.js",
        commentSection: BASE_JS + "commentSection.js",
    }, //npm run asstes 할때 마다 삭제해줘야하는 번거로움을 해소하기 위해서 작성.
    plugins: [
        new MiniCssExtractPlugin({
          filename: "css/styles.css", //styles.css를 다른 파일에 생성.
        }),
      ],
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        clean:true, //프론트가 새로고침될때마다 백엔드가 새로고침되눈개 뷸푠험.
    },
    module:{
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]],
                    },
                },
            },
            {
                test: /\.scss$/,
                //webpack에서는 역순으로 실행되므로 역순으로 적어준다.
                //sass-loader >> scss파일을 css파일로 바꿔주는 거
                //style-loader >> 웹브라우저에 css파일을 보여주는 거
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
                //style-loader이라는 loader를 사용하면, javascript코드가 css파일을 읽는데, 
                //우리는 css파일 따로, js파일 따로 웹팩으로 번들화 시키고싶다. 한번에 할 경우 js 로딩을 기다려야하기 때문이다.그래서 MiniCssExcractPlugin.loader를 사용한다.
            },
        ],
    },
}; 