export type NavMenuItem = {
  id: string
  label: string
  slug?: string
  icon?: string
  url?: string
  target?: "_self" | "_blank"
  children?: NavMenuItem[]
  visible?: boolean
}