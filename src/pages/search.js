import React, { useState } from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import { useFlexSearch } from "react-use-flexsearch"
import styled from "styled-components"
import Seo from "../components/seo"
import Layout from "../components/layout"
import {
  PageHeader,
  SectionMeta,
  Content,
  Row,
  Col,
} from "../styles/StyledElements"

const SearchResults = styled.div`
  .search-term {
    font-style: italic;
    color: ${({ theme }) => theme.colors.red};
  }
  h2 {
    margin-top: 0;
  }

  .message {
    font-style: italic;
    font-family: ${({ theme }) => theme.type.sans};
    color: ${({ theme }) => theme.colors.red};
  }
`

const SearchItem = styled.li`
  margin-bottom: 1rem;
  a {
    font-size: 1.1rem;
    font-family: ${({ theme }) => theme.type.sans};
    font-weight: 700;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
  .type {
    font-family: ${({ theme }) => theme.type.sans};
    font-size: 0.85rem;
    display: inline-block;
    padding: 0px 6px;
    margin-right: 4px;
    margin-bottom: 4px;
    border-radius: 4px;
    background: #ddd;
  }
`

const SearchForm = styled.form`
  margin-bottom: 1rem;

  h2 {
    margin-top: 0;
  }

  input {
    font-family: ${({ theme }) => theme.type.sans};
    background-color: hsl(0, 0%, 100%);
    border-color: hsl(0, 0%, 80%);
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    padding: 6px 8px;
    width: 100%;
    ::placeholder {
      font-style: italic;
    }
  }

  .instructions {
    font-size: 0.9rem;
  }
`

export default function Search({ location, data }) {
  const index = data.localSearchPages.index
  const store = data.localSearchPages.store
  const [query, setQuery] = useState("")
  //   const results = useLunr(query, index, store)
  const results = useFlexSearch(query, index, store)

  const title = "Search"

  return (
    <Layout location={location}>
      <Seo title={title} />
      <PageHeader>
        <Content>
          <Row>
            <Col>
              <h1>{title}</h1>
            </Col>
          </Row>
        </Content>
      </PageHeader>
      <SectionMeta>
        <Content>
          <Row>
            <Col>
              <SearchForm>
                <h2>Query</h2>

                <input
                  type="search"
                  id="search"
                  placeholder="Enter your search query"
                  name="query"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />
                <p className={"instructions"}>
                  Search the full text of the Forecasts, Trends and Signals
                  within the Horizon Scan Graph. Results will appear as you
                  type.
                </p>
              </SearchForm>
            </Col>
            <Col size={3}>
              <SearchResults>
                {query !== "" ? (
                  <h2>
                    Results for&thinsp;
                    <span className={"search-term"}>&lsquo;{query}&rsquo;</span>
                    &ensp;(
                    {results.length})
                  </h2>
                ) : (
                  <h2>Results</h2>
                )}
                {results.length > 0 ? (
                  <ol className={"list"}>
                    {results.map(result => (
                      <SearchItem key={result.id}>
                        <Link to={result.path}>{result.title}</Link>&ensp;
                        <span className={"type"}>{result.type}</span>
                        {result.summary && (
                          <div className={"summary"}>{result.summary}</div>
                        )}
                      </SearchItem>
                    ))}
                  </ol>
                ) : (
                  <div className={"message"}>
                    {query === ""
                      ? "Enter a new search query to display results"
                      : "No results"}
                  </div>
                )}
              </SearchResults>
            </Col>
          </Row>
        </Content>
      </SectionMeta>
    </Layout>
  )
}

export const query = graphql`
  {
    localSearchPages {
      index
      store
    }
  }
`
