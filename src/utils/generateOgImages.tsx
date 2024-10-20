import satori, { type SatoriOptions } from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { type CollectionEntry } from 'astro:content'
import postOgImage from './og-templates/post'
import lyricsOgImage from './og-templates/lyrics'
import siteOgImage from './og-templates/site'

const fetchFonts = async () => {
  // Regular Font
  const pretendardRegular = await fetch(
    'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Regular.woff',
  ).then((r) => r.arrayBuffer())

  // Bold Font
  const pretendardBold = await fetch(
    'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff',
  ).then((r) => r.arrayBuffer())

  const notoSansRegular: ArrayBuffer = await fetch(
    'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/OTF/Korean/NotoSansCJKkr-Regular.otf',
  ).then((r) => r.arrayBuffer())
  const notoSansBold: ArrayBuffer = await fetch(
    'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/OTF/Korean/NotoSansCJKkr-Bold.otf',
  ).then((r) => r.arrayBuffer())

  return {
    pretendardRegular,
    pretendardBold,
    notoSansRegular,
    notoSansBold,
  }
}

const { pretendardRegular, pretendardBold, notoSansRegular, notoSansBold } =
  await fetchFonts()

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
}

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg)
  const pngData = resvg.render()
  return pngData.asPng()
}

export async function generateOgImageForPost(post: CollectionEntry<'blog'>) {
  const svg = await satori(postOgImage(post), options)
  return svgBufferToPngBuffer(svg)
}

export async function generateOgImageForLyrics(
  post: CollectionEntry<'lyrics'>,
) {
  const svg = await satori(lyricsOgImage(post), options)
  return svgBufferToPngBuffer(svg)
}

export async function generateOgImageForSite() {
  const svg = await satori(siteOgImage(), options)
  return svgBufferToPngBuffer(svg)
}
