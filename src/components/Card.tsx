import { slugifyStr } from '@utils/slugify'
import Datetime from './Datetime'

export type Frontmatter = {
  title: string
  pubDatetime: string | Date
  modDatetime?: string | Date
  description: string
}

export interface Props {
  href?: string
  frontmatter: Frontmatter
  secHeading?: boolean
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, modDatetime, description } = frontmatter

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: 'text-lg font-medium decoration-dashed hover:underline',
  }

  return (
    <li className="my-6">
      <a
        href={href}
        className="inline-block text-lg font-medium text-[var(--color-accent)] decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
      </a>
      <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} />
      <p>{description}</p>
    </li>
  )
}
