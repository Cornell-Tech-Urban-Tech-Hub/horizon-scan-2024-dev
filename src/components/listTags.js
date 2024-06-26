import React from "react"
import styled from "styled-components"

const TagGroup = styled.div`
  font-family: ${({ theme }) => theme.type.sans};
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 2;
`

const TagGroupSmall = styled.div`
  font-family: ${({ theme }) => theme.type.sans};
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.6;
`

const TagGroupCard = styled.div`
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  line-height: 2;
`

const TagElement = styled.div`
  display: inline-block;
  padding: 0px 6px;
  margin-right: 4px;
  margin-bottom: 4px;
  border-radius: 4px;
  background: #ddd;
`

const TagHeader = styled(TagElement)`
  background: #bbb;
`

const TagElementLight = styled(TagElement)`
  background: #fff;
`

const TagCounted = styled(TagElement)`
  font-weight: 600;
  background: rgba(0, 0, 0, ${props => props.opacity});
`

export const ListTags = ({ array, type }) => {
  return (
    <>
      {array?.length > 0 && (
        <TagGroup>
          <TagHeader>{type}</TagHeader>
          {array?.map((tag, i) => (
            <TagElement key={`${type}-${i}`}>{tag}</TagElement>
          ))}
        </TagGroup>
      )}
    </>
  )
}

export const ListTagsSmall = ({ array, type }) => {
  return (
    <>
      {array?.length > 0 && (
        <TagGroupSmall>
          <TagHeader>{type}</TagHeader>
          {array?.map((tag, i) => (
            <TagElementLight key={`${type}-${i}`}>{tag}</TagElementLight>
          ))}
        </TagGroupSmall>
      )}
    </>
  )
}

export const ListTagsComma = ({ array, type }) => {
  return (
    <>
      {array.length > 0 && (
        <TagGroupCard>
          <strong>{type}: </strong> {array?.join(", ")}
        </TagGroupCard>
      )}
    </>
  )
}

export const ListTagsCounted = ({ array, type }) => {
  let maxCount = Math.max.apply(
    Math,
    array.map(function (d) {
      return d.count
    })
  )
  return (
    <TagGroup>
      {array?.map((tag, i) => (
        <TagCounted
          opacity={(tag.count / maxCount) * 0.25}
          className={`ct-${tag.count}`}
          key={`{type}-${i}`}
        >
          {tag.label} ({tag.count})
        </TagCounted>
      ))}
    </TagGroup>
  )
}
