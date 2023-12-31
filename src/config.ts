import type { Site, SocialObjects } from './types';

export const SITE: Site = {
  website: 'https://blog.kiwiyou.dev/', // replace this with your deployed domain
  author: 'kiwiyou',
  desc: `A journey of problem solver.`,
  title: 'kiwifarm',
  ogImage: 'opengraph.png',
  lightAndDarkMode: true,
  postPerPage: 5,
};

export const LOCALE = {
  lang: 'ko', // html lang code. Set this empty and default will be "en"
  langTag: ['ko-KR'], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
};

export const SOCIALS: SocialObjects = [
  {
    name: 'Github',
    href: 'https://github.com/kiwiyou',
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: 'Mail',
    href: 'mailto:kiwiyou@kiwiyou.dev',
    linkTitle: `Send an email to ${SITE.title}`,
    active: false,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/giwiyou',
    linkTitle: `${SITE.title} on Twitter`,
    active: true,
  },
  {
    name: 'Discord',
    href: 'https://discordapp.com/users/kiwiyou',
    linkTitle: `${SITE.title} on Discord`,
    active: true,
  },
  {
    name: 'Telegram',
    href: 'https://t.me/kiwiyou',
    linkTitle: `${SITE.title} on Telegram`,
    active: true,
  },
];
