import { FacebookIcon, FacebookShareButton, TwitterShareButton,TwitterIcon,
    WhatsappIcon,WhatsappShareButton,RedditShareButton,RedditIcon,LinkedinShareButton,LinkedinIcon   } from 'next-share';
import { FC } from 'react';

interface Props {
    url: string,
    title?: string,
    quote?: string

}

const Share: FC<Props> = ({url, title, quote}): JSX.Element => {
  return <div className='flex items-center space-x-3'>
    <p className='font-semibold text-primary-dark dark:text-primary'>Share: </p>
    <FacebookShareButton url={url} title={title} quote={quote}>
        <FacebookIcon round size={30}/>
    </FacebookShareButton>
    <TwitterShareButton url={url} title={title}>
        <TwitterIcon  round size={30}/>
    </TwitterShareButton>
    <WhatsappShareButton url={url} title={title} separator=':: '>
        <WhatsappIcon  round size={30}/>
    </WhatsappShareButton>
    <RedditShareButton url={url} title={title}>
        <RedditIcon   round size={30}/>
    </RedditShareButton>
    <LinkedinShareButton url={url} title={title} source={quote}>
        <LinkedinIcon    round size={30}/>
    </LinkedinShareButton>
  </div>;
};

export default Share;