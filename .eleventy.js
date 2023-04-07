const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginNavigation = require('@11ty/eleventy-navigation')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const pluginEmbedEverything = require('embedEverything')
const { minify } = require('terser')

const markdownIt = require('markdown-it')
const markdownItAttrs = require('markdown-it-attrs')
const markdownItFootnote = require('markdown-it-footnote')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItToCDoneRight = require('markdown-it-toc-done-right')

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
  eleventyConfig.addPlugin(pluginRss, {
    posthtmlRenderOptions: {
      closingSingleTag: 'default' // opt-out of <img/>-style XHTML single tags
    }
  })
  eleventyConfig.addPlugin(pluginNavigation)
  eleventyConfig.addPlugin(pluginSyntaxHighlight)
  eleventyConfig.addPlugin(embedEverything)

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

  // Markdown
  let markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true
  }
  let markdownLib = markdownIt(markdownItOptions)
    .use(markdownItAttrs)
    .use(markdownItFootnote)
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink({
        safariReaderFix: true
      })
    })
    .use(markdownItToCDoneRight)
  //TODO:!! add [num] infront of footnotes
  markdownLib.renderer.rules.footnote_block_open = () =>
    '<section class="footnotes">\n' +
    '<h4 class="mt-3">Footnotes</h4>\n' +
    '<ol class="footnotes-list">\n'
  eleventyConfig.setLibrary('md', markdownLib)

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
