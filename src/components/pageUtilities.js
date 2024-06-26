export function contentMapAirtable(contentNodes) {
  let map = new Map()
  contentNodes?.forEach(d => {
    map.set(d.data["Content_Ref"], d)
  })
  return map
}

export function contentMapMarkdown(contentNodes) {
  let map = new Map()
  contentNodes?.forEach(d => {
    map.set(d.frontmatter.ref, d)
  })
  return map
}
