import { ReactNode } from 'react'
import cx from 'classnames'

import './styles.scss'

type QuestionProps = {
  content: string
  author: {
    name: string
    avatar: string
  }
  children?: ReactNode
  isAnsewered?: boolean
  isHighlighted?: boolean
}

export function Question({
  content,
  author,
  isAnsewered = false,
  isHighlighted =false,
  children,
}: QuestionProps) {
  return (
    <div 
      className={cx(
        'question',
        { ansewered: isAnsewered },
        { highlighted: isHighlighted && !isAnsewered },
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  )
}