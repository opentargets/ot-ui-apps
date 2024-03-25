import { Html, Head, Main, NextScript, DocumentProps, DocumentContext } from "next/document";
import {
  DocumentHeadTags,
  DocumentHeadTagsProps,
  documentGetInitialProps,
} from "@mui/material-nextjs/v14-pagesRouter";

export default function MyDocument(props: DocumentProps & DocumentHeadTagsProps) {
  return (
    // <Html lang="en" className={roboto.className}>
    <Html lang="en">
      <Head>
        {/* <meta name="theme-color" content={theme.palette.primary.main} /> */}
        <meta name="theme-color" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="emotion-insertion-point" content="" />
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};
