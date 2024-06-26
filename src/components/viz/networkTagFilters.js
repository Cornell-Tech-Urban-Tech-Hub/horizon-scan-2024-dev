import React, { useState, useEffect } from "react"
// import * as d3 from "d3"
import Select from "react-select"
import styled from "styled-components"
import { summarizeNodeTaxonomy } from "./dataUtilities"

// const Section = styled.section`
//   padding-top: 2rem;
// `

const StyledNetworkFilter = styled.div`
  padding: 1rem 0;
  .multiselect {
    margin-bottom: 0.5rem;
  }
`

const InputGroup = styled.div``

export function NetworkTagFilters({ nodes, filterUpdate, filterTypes }) {
  // let tagset = summarizeTags(dataset.nodes)
  // console.log({ tagset })

  // console.log(filterTypes)
  // console.log(filterTypes.sectors)

  const [selectedTags, setSelectedTags] = useState([])
  const [filteredTags, setFilteredTags] = useState(
    summarizeNodeTaxonomy(nodes, "tagsArray")
  )

  const [selectedSectors, setSelectedSectors] = useState([])
  const [filteredSectors, setFilteredSectors] = useState(
    summarizeNodeTaxonomy(nodes, "sectorsArray")
  )

  const [filterAdditive, setFilterAdditive] = useState(true)

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

    setFilteredTags(summarizeNodeTaxonomy(filteredSet, "tagsArray"))
    setFilteredSectors(summarizeNodeTaxonomy(filteredSet, "sectorsArray"))

    filterUpdate(filteredSet, { sectors: selectedSectors, tags: selectedTags })
  }

  function handleChangeTags(selection) {
    setSelectedTags(selection)
    // console.log(`Option selected:`, selectedTags)
  }
  function handleChangeSectors(selection) {
    setSelectedSectors(selection)
    // console.log(`Option selected:`, selectedTags)
  }

  return (
    <StyledNetworkFilter>
      {filterTypes.sectors && (
        <>
          <label id="select-sectors-label" htmlFor="select-sectors">
            Highlight Sectors
          </label>
          <Select
            id={"select-sectors"}
            aria-labelledby="select-sectors-label"
            className={"multiselect"}
            isMulti
            onChange={handleChangeSectors}
            options={filteredSectors}
            placeholder={"Highlight by Sector"}
            formatOptionLabel={(option, { context }) => {
              /* context can be either `menu` or `value`
               menu - dropdown
               value - value displayed
            */
              return context === "menu"
                ? `${option.label} (${option.count})`
                : `${option.label}`
            }}
          />
        </>
      )}
      {filterTypes.tags && (
        <>
          <label id="select-tags-label" htmlFor="select-tags">
            Highlight Tags
          </label>
          <Select
            id="select-tags"
            aria-labelledby="select-tags-label"
            className={"multiselect"}
            isMulti
            onChange={handleChangeTags}
            options={filteredTags}
            //getOptionLabel={option => `${option.label} (${option.count})`}
            formatOptionLabel={(option, { context }) => {
              /* context can be either `menu` or `value`
               menu - dropdown
               value - value displayed
            */
              return context === "menu"
                ? `${option.label} (${option.count})`
                : `${option.label}`
            }}
          />
        </>
      )}
      <input
        id="filter-additive"
        aria-labelledby="filter-additive-label"
        name="filterAdditive"
        type="checkbox"
        checked={filterAdditive}
        onChange={e => setFilterAdditive(!filterAdditive)}
      />
      <label htmlFor="filter-additive">{" Match All Selections"}</label>
    </StyledNetworkFilter>
  )
}
