import { FC } from "react";
import Head from "next/head";

interface Props {
  title?: string;
  desc?: string;
  thumbnail?: string;
  url?: string;
}

export const APP_NAME = "Đồng phục Univi";

const AppHead: FC<Props> = ({ title, desc, thumbnail, url }): JSX.Element => {

  return (
    <Head>
      <title>{title ? title + " | " + APP_NAME : APP_NAME}</title>
    </Head>
  );
};

export default AppHead;
