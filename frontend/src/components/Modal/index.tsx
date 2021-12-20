import { ReactNode } from 'react'
import { css } from '@emotion/react'

export const Modal = ({ children, closeModal }: IProps) => {
  return (
    <div
      css={css`
        position: absolute;
        z-index: 1000;
        left: 0;
        top: 0px;
        height: 100vh;
        width: 100vw;
        background: rgba(0, 0, 0, 0.5);
      `}
    >
      <div
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          display: flex;
          flex-direction: column;
          row-gap: 1rem;
          width: 90vw;
          padding: 1rem;
          transform: translate(-50%, -50%);
          background: var(--color-theme-1-light);
          border: 1px solid var(--color-theme-1);
          border-radius: 5px;
        `}
      >
        {children}
      </div>
    </div>
  )
}

interface IProps {
  children: ReactNode
  closeModal: () => void
}
