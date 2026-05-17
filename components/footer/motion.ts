export const footerEase = [0.16, 1, 0.3, 1] as const

export const footerReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.06, ease: footerEase },
  }),
}

export const footerStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
}

export const linkHover = {
  rest: { x: 0 },
  hover: { x: 4, transition: { duration: 0.2, ease: footerEase } },
}

export const socialIcon = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.08, y: -2, transition: { duration: 0.22, ease: footerEase } },
}
