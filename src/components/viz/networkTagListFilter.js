import React, { useState, useEffect } from "react"
// import * as d3 from "d3"
import styled from "styled-components"
import { summarizeNodeTaxonomy } from "./dataUtilities"

const StyledTabs = styled.div`
  ul {
    list-style-type: none;
    margin-left: 0;
    padding: 0;
    li {
      display: inline;
    }

    a {
      font-family: ${props => props.theme.type.sans};
      display: inline-block;
      padding: 0;
      margin: 0 0.5rem -1px 0;
      text-decoration: none;
      color: #000;
      &.active {
        border-bottom: 3px solid ${props => props.theme.colors.link};
      }
      &:hover {
        border-bottom: 3px solid ${props => props.theme.colors.link};
      }
    }
  }

  .tabpanel {
    display: none;
    &.active {
      display: block;
    }
  }
`

const TagGroup = styled.div`
  line-height: 2;
`

const TagCounted = styled.div`
  font-family: ${({ theme }) => theme.type.sans};
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
  padding: 0px 6px;
  margin-right: 4px;
  margin-bottom: 2px;
  border-radius: 4px;
  background: rgba(0, 0, 0, ${props => props.opacity});

  border: 2px solid #fff;

  .count {
    font-weight: 500;
  }

  &.active {
    border: 2px solid rgb(128, 0, 128);
  }

  &:hover {
    border: 2px solid #000;
  }
`

const ClearSelection = styled.button`
  border-radius: 0.5rem;
  font-family: ${({ theme }) => theme.type.serif};
  border: 1px solid ${({ theme }) => theme.colors.coolgrey};
  cursor: pointer;
  background: none;
  transition: all 0.5s ease;
  :hover {
    background: ${({ theme }) => theme.colors.coolgrey};
    color: #fff;
  }
`

export function NetworkTagListFilter({
  nodes,
  selectable,
  filterAdditive = true,
  filterUpdate,
}) {
  // let tagset = summarizeTags(dataset.nodes)
  // console.log({ tagset })
  let tags = summarizeNodeTaxonomy(nodes, "tagsArray")
  // console.log({ tags })
  let sectors = summarizeNodeTaxonomy(nodes, "sectorsArray")
  // console.log({ sectors })

  const [selectedTags, setSelectedTags] = useState([])
  // const [filteredTags, setFilteredTags] = useState(
  //   summarizeNodeTaxonomy(nodes, "tagsArray")
  // )

  const [selectedSectors, setSelectedSectors] = useState([])
  // const [filteredSectors, setFilteredSectors] = useState(
  //   summarizeNodeTaxonomy(nodes, "sectorsArray")
  // )

  // const [filterAdditive, setFilterAdditive] = useState(true)

  useEffect(() => {
    filterNodes(nodes)
  }, [selectedTags, selectedSectors, filterAdditive])

  function filterNodes(nodes) {
    // console.log("FILTER NODES")
    let checkTags = selectedTags.map(d => d.value)
    let checkSectors = selectedSectors.map(d => d.value)

    let filteredSet = nodes.map(d => d)

    if (checkTags.length > 0) {
      filteredSet = filteredSet.filter(d => {
        if (d.tagsArray) {
          if (filterAdditive) {
            return checkTags.every(elem => d.tagsArray.includes(elem))
          } else {
            return checkTags.some(elem => d.tagsArray.includes(elem))
          }
        } else {
          return false
        }
      })
    }

    if (checkSectors.length > 0) {
      filteredSet = filteredSet.filter(d => {
        if (d.sectorsArray) {
          if (filterAdditive) {
            return checkSectors.every(elem => d.sectorsArray.includes(elem))
          } else {
            return checkSectors.some(elem => d.sectorsArray.includes(elem))
          }
        } else {
          return false
        }
      })
    }

    // setFilteredTags(summarizeNodeTaxonomy(filteredSet, "tagsArray"))
    // setFilteredSectors(summarizeNodeTaxonomy(filteredSet, "sectorsArray"))

    filterUpdate(filteredSet, { sectors: selectedSectors, tags: selectedTags })
  }

  // function handleChangeTags(selection) {
  //   setSelectedTags(selection)
  //   // console.log(`Option selected:`, selectedTags)
  // }
  // function handleChangeSectors(selection) {
  //   setSelectedSectors(selection)
  //   // console.log(`Option selected:`, selectedTags)
  // }

  const handleTagClick = React.useCallback((e, item, type) => {
    e.preventDefault()
    if (type === "sector") {
      setSelectedSectors([item])
      setSelectedTags([])
      setActiveTag(item.value)
    }
    if (type === "tag") {
      setSelectedSectors([])
      setSelectedTags([item])
      setActiveTag(item.value)
    }
  })

  const clearTagSelections = e => {
    e.preventDefault()
    setSelectedSectors([])
    setSelectedTags([])
    setActiveTag(null)
  }

  const handleTabClick = (e, tab) => {
    e.preventDefault()
    setSelectedTab(tab)
  }

  const [selectedTab, setSelectedTab] = useState("sectors")
  const [activeTag, setActiveTag] = useState(null)
  const tabsValues = [
    { type: "sectors", label: "Sectors" },
    { type: "tags", label: "Tags" },
  ]

  return (
    <StyledTabs>
      <ul>
        {tabsValues?.map((tab, i) => (
          <a
            href={`#tabpanel_${tab.type}`}
            className={tab.type === selectedTab ? "active" : null}
            onClick={e => handleTabClick(e, tab.type)}
            key={`${tab.type}-${i}`}
          >
            {tab.label}
          </a>
        ))}
      </ul>
      {/* {sectors?.map((tag, i) => (
        <TagCounted
          className={tag.value === activeTag ? "active" : null}
          onClick={() => handleTagClick(tag, "sector")}
          //opacity={(tag.count / maxCount) * 0.25}
          className={`ct-${tag.count}`}
          key={`sector-${i}`}
        >
          {tag.label} ({tag.count})
        </TagCounted>
      ))} */}
      <div
        id={`tabpanel_sectors`}
        name={`tabpanel_sectors`}
        className={`tabpanel ${selectedTab === "sectors" ? "active" : ""}`}
      >
        <ListTagsCounted
          array={sectors}
          type={"sector"}
          selected={activeTag}
          handleTagClick={handleTagClick}
        />
      </div>
      <div
        id={`tabpanel_tags`}
        name={`tabpanel_tags`}
        className={`tabpanel ${selectedTab === "tags" ? "active" : ""}`}
      >
        <ListTagsCounted
          array={tags}
          type={"tag"}
          selected={activeTag}
          handleTagClick={handleTagClick}
        />
      </div>
      <p>
        <small>
          Select a sector or tag to highlight in network.{" "}
          {(selectedTags.length > 0 || selectedSectors.length > 0) && (
            <ClearSelection href={"#"} onClick={e => clearTagSelections(e)}>
              Clear Selection
            </ClearSelection>
          )}
        </small>
      </p>
    </StyledTabs>
  )
}

export const ListTagsCounted = ({ array, type, selected, handleTagClick }) => {
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
          className={tag.value === selected ? "active" : null}
          onClick={e => handleTagClick(e, tag, type)}
          opacity={(tag.count / maxCount) * 0.25}
          // className={`ct-${tag.count}`}
          key={`${type}-${i}`}
        >
          {tag.label} <span className={"count"}>({tag.count})</span>
        </TagCounted>
      ))}
    </TagGroup>
  )
}
