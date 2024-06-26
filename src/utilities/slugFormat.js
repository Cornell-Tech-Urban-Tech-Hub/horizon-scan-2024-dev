var slugify = require("slugify")

// export default function slugFormat(string) {
//   return slugify(string, {
//     // replacement: '-',  // replace spaces with replacement character, defaults to `-`
//     remove: undefined, // remove characters that match regex, defaults to `undefined`
//     lower: true, // convert to lower case, defaults to `false`
//     strict: true, // strip special characters except replacement, defaults to `false`
//     trim: true, // trim leading and trailing replacement chars, defaults to `true`
//   })
// }

const slugFormat = string => {
  return slugify(string, {
    // replacement: '-',  // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: true, // strip special characters except replacement, defaults to `false`
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  })
}

module.exports = { slugFormat }
