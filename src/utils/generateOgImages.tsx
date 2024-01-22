import satori, { type SatoriOptions } from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { type CollectionEntry } from 'astro:content';
import postOgImage from './og-templates/post';
import lyricsOgImage from './og-templates/lyrics';
import siteOgImage from './og-templates/site';
import fs from 'fs/promises';
import path from 'path';
import notoSansRegularUrl from './og-templates/NotoSansCJKkr-Regular.otf';
import notoSansBoldUrl from './og-templates/NotoSansCJKkr-Bold.otf';

const fetchFonts = async () => {
  // Regular Font
  const filePretendardRegular = await fetch(
    'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Regular.woff',
  );
  const pretendardRegular: ArrayBuffer =
    await filePretendardRegular.arrayBuffer();

  // Bold Font
  const filePretendardBold = await fetch(
    'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff',
  );
  const pretendardBold: ArrayBuffer = await filePretendardBold.arrayBuffer();

  const notoSansRegular: ArrayBuffer = await fs
    .readFile(new URL(path.join('../../', notoSansRegularUrl), import.meta.url))
    .then((b) => b.buffer);
  const notoSansBold: ArrayBuffer = await fs
    .readFile(new URL(path.join('../../', notoSansBoldUrl), import.meta.url))
    .then((b) => b.buffer);

  return {
    pretendardRegular,
    pretendardBold,
    notoSansRegular,
    notoSansBold,
  };
};

const { pretendardRegular, pretendardBold, notoSansRegular, notoSansBold } =
  await fetchFonts();

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: 'Pretendard',
      data: pretendardRegular,
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Pretendard',
      data: pretendardBold,
      weight: 600,
      style: 'normal',
    },
    {
      name: 'Noto Sans CJK KR',
      data: notoSansRegular,
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Noto Sans CJK KR',
      data: notoSansBold,
      weight: 600,
      style: 'normal',
    },
  ],
};

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost(post: CollectionEntry<'blog'>) {
  const svg = await satori(postOgImage(post), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForLyrics(
  post: CollectionEntry<'lyrics'>,
) {
  const svg = await satori(lyricsOgImage(post), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await satori(siteOgImage(), options);
  return svgBufferToPngBuffer(svg);
}
