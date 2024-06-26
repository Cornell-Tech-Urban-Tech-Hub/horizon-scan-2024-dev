import React from "react"
import { Link } from "gatsby"

const { slugFormat } = require("./slugFormat")

const NodeLink = ({ children, name, id, type, format = "name" }) => {
  let url

  if (format === "name") {
    url = `/${type}s/${slugFormat(name)}`
  } else {
    url = `/${type}s/${id}`
  }

  return <Link to={url}>{children}</Link>
}

export default NodeLink
