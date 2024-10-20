interface DateSortable {
  data: {
    draft?: boolean
    modDatetime?: string | Date
    pubDatetime: string | Date
  }
}

function getSortedPosts<T extends DateSortable>(posts: T[]) {
  return posts
    .filter(({ data }) => !data.draft)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000,
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000,
        ),
    )
}

export default getSortedPosts
