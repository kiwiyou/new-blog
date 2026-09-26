import { readFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'

const fonts = [
  { name: 'Noto Sans CJK', data: readFileSync('src/assets/og/NotoSansCJKkr-Regular.otf'), weight: 400 as const, style: 'normal' as const },
]

export async function ogImage(title: string, subtitle = '') {
  const node = {
    type: 'div',
    props: {
      style: {
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '72px 84px', background: '#302e2a',
        color: '#f1eff0', fontFamily: 'Noto Sans CJK', borderTop: '20px solid #93de58',
      },
      children: [
        { type: 'div', props: { style: { fontSize: 32, color: '#93de58' }, children: '키위밭  /  kiwifarm' } },
        { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: 24 }, children: [
          { type: 'div', props: { style: { fontSize: title.length > 28 ? 58 : 76, fontWeight: 400, lineHeight: 1.25, wordBreak: 'keep-all' }, children: title } },
          subtitle ? { type: 'div', props: { style: { fontSize: 34, color: '#c7c5c4' }, children: subtitle } } : null,
        ].filter(Boolean) } },
        { type: 'div', props: { style: { fontSize: 26, color: '#93de58' }, children: 'blog.kiwiyou.dev' } },
      ],
    },
  }
  const svg = await satori(node as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts })
  return new Resvg(svg).render().asPng()
}
