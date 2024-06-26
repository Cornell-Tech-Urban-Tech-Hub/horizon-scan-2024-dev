import React from "react"
import styled from "styled-components"

const ShareBlock = styled.div`
  text-align: center;
`

const SocialLink = styled.a`
  display: inline-block;
  margin-right: 0.5rem;
  transition: all 0.2s ease-in-out;
  border-radius: 50%;
`

// const SocialLinkIcon = styled.a`
//   width: 2.5rem;
//   height: 2.5rem;
//   display: inline-block;
//   margin-right: 0.5rem;
//   transition: all 0.2s ease-in-out;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `

const PageSocialShare = ({ location, text = "" }) => {
  const encodedURL = encodeURIComponent(location.href)
  const encodedText = encodeURIComponent(text)
  return (
    <ShareBlock>
      {"Share: "}
      <SocialLink
        className={"facebook"}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`}
        target="_blank"
      >
        Facebook
      </SocialLink>
      <SocialLink
        className={"twitter"}
        href={`https://www.twitter.com/intent/tweet?url=${encodedURL}&amp;text=${encodedText}`}
        target="_blank"
      >
        Twitter
      </SocialLink>
      <SocialLink
        className={"email"}
        href={`mailto:?subject=&body=${encodedText}%0D%0A${encodedURL}`}
      >
        Email
      </SocialLink>
    </ShareBlock>
  )
}

export default PageSocialShare
