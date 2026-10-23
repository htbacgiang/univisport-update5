// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="vi-VN">
      <Head>
        <meta name="google-site-verification" content="kNL7mAgNeJ_YF0n5xp1aWaEILSmJvt4hFsNJPOpMujY" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="p:domain_verify" content="46fb224c998b15a6ef1c551d52257138" />
        
        {/* Preload critical web fonts để loại bỏ hoàn toàn hiện tượng nhảy/đổi font (FOUT) */}
        <link
          rel="preload"
          href="/fonts/SVN-Gilroy-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/SVN-Gilroy-Medium.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Anton-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/STIXTwoText-Italic.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
