import type { CollectionEntry } from 'astro:content'

export default (post: CollectionEntry<'lyrics'>) => {
  return (
    <div
      style={{
        background: '#fefbfb',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '20px',
        }}
      >
        <p
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            maxHeight: '84%',
            overflow: 'hidden',
            wordBreak: 'keep-all',
            textWrap: 'pretty',
          }}
        >
          {post.data.title}
        </p>
        <p
          style={{
            fontSize: 48,
          }}
        >
          {post.data.author}
        </p>
      </div>
    </div>
  )
}
