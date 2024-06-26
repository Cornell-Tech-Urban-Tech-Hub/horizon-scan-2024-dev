import React from "react"
import styled from "styled-components"

const StyledTabs = styled.div`
  ul {
    list-style-type: none;
    margin-left: 0;
    padding: 0;
    li {
      display: inline;
    }
  }
  a {
    font-family: ${props => props.theme.type.sans};
    display: inline-block;
    padding: 0.25rem 0;
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

  .tabpanel {
    display: none;
    &.active {
      display: block;
    }
  }
`

export const Tab = ({ children, index, isSelected }) => (
  <div
    id={`tabpanel_${index}`}
    name={`tabpanel_${index}`}
    className={`${isSelected() ? "active" : ""} tabpanel`}
  >
    {children}
  </div>
)

export class Tabs extends React.Component {
  constructor(props) {
    super(props)
    this.tabs = props.children
    this.state = {
      selected: this.tabs.find(tab => tab.props.selected) || this.tabs[0],
    }
    this.selectTab = this.selectTab.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  componentDidUpdate() {
    this.activeLink.focus()
  }
  selectTab(tab) {
    this.setState({ selected: tab })
  }
  handleClick(e, tab) {
    e.preventDefault()
    this.selectTab(tab)
  }
  render() {
    return (
      <StyledTabs>
        <ul>
          {this.tabs.map((tab, i) => (
            <li key={`tab_${i}`}>
              <a
                id={`tab_${i}`}
                href={`#tabpanel_${i}`}
                className={`${tab === this.state.selected ? "active" : ""}`}
                onClick={e => this.handleClick(e, tab)}
                ref={link => {
                  if (tab === this.state.selected) this.activeLink = link
                }}
              >
                {tab.props.title}
              </a>
            </li>
          ))}
        </ul>
        <div>
          {this.tabs.map((tab, i) =>
            React.cloneElement(tab, {
              key: `tabpanel_${i}`,
              index: i,
              isSelected: () => tab === this.state.selected,
            })
          )}
        </div>
      </StyledTabs>
    )
  }
}
