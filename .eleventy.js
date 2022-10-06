const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginNavigation = require('@11ty/eleventy-navigation')
const { minify } = require('terser')
const markdownIt = require('markdown-it')

const shortcodes = require('./utils/shortcodes.js')
const filters = require('./utils/filters.js')
const transforms = require('./utils/transforms.js')

const IS_PRODUCTION = process.env.ELEVENTY_ENV === 'production'

const CONTENT_GLOBS = {
  posts: 'src/posts/*/*.md',
  notes: 'src/notes/*.md',
  media: '*.jpg|*.jpeg|*.png|*.gif|*.mp4|*.webp|*.webm'
}

module.exports = function (eleventyConfig) {
  //set deep data merge to...
  //eleventyConfig.setDataDeepMerge(false)

  // Collection: allposts
  eleventyConfig.addCollection('allposts', function (collection) {
    return collection.getFilteredByGlob(CONTENT_GLOBS.posts)
  })
  // Collection: notes
  eleventyConfig.addCollection('allnotes', function (collection) {
    return collection.getFilteredByGlob(CONTENT_GLOBS.notes)
  })
  // Collection: featured
  eleventyConfig.addCollection('allfeatured', function (collection) {
    return collection.getFilteredByTags('featured')
  })

  // Plugins
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(pluginNavigation)

  // Shortcodes
  Object.keys(shortcodes).forEach((shortcodeName) => {
    eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
  })

  // Filters
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName])
  })

  // Transforms
  Object.keys(transforms).forEach((transformName) => {
    eleventyConfig.addTransform(transformName, transforms[transformName])
  })

  // Asset Watch Targets
  eleventyConfig.addWatchTarget('src/_assets')

  // Pass-through files
  eleventyConfig.addPassthroughCopy('src/robots.txt')
  eleventyConfig.addPassthroughCopy('src/humans.txt')
  eleventyConfig.addPassthroughCopy('src/site.webmanifest')
  eleventyConfig.addPassthroughCopy('src/_assets/fonts')
  eleventyConfig.addPassthroughCopy('src/_assets/images')

  // Pass-through for post-images
  eleventyConfig.addPassthroughCopy(
    'src/posts/*/*.{jpg,jpeg,png,gif,mp4,webp,webm,avif}'
  )

  return {
    passthroughFileCopy: true,

    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data'
    },
    templateFormats: ['njk', 'md', '11ty.js'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  }
}
