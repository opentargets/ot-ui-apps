export default function DynamicTag({ tagName, children, ...props }) {
  const Tag = tagName; // capitalize to use it as a component
  return <Tag {...props}>{children}</Tag>;
}
