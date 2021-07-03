import { ReactNode } from 'react';
import cx from 'classnames';

import '../styles/question.scss';

type QuestionsProps = {
  content: string,
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswer?: boolean;
  isHighlighted?: boolean;
};

export function Questions({
  content,
  author,
  children,
  isAnswer = false,
  isHighlighted = false }: QuestionsProps) {
  return (
    <div
    className={cx(
      'question',
      { answered: isAnswer },
      { highlighted: isHighlighted  && !isAnswer}
    )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={ author.avatar } alt={ author.name } />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  )
}
