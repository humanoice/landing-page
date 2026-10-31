/** The root <html> is English; every /th page declares its language here, once. */
export default function ThaiLayout({ children }: LayoutProps<"/th">) {
  return <div lang="th">{children}</div>;
}
