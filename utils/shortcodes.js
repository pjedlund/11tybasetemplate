const Image = require('@11ty/eleventy-img')
const path = require("path");

module.exports = {
    
    // usage: icon('/img/icon.svg')
    icon: function (name) {
        return `<svg class="icon icon--${name}" role="img" aria-hidden="true" width="24" height="24">
                    <use xlink:href="#svg-${name}"></use>
                </svg>`
    },
    
    // usage: {% image "bear.jpeg", "photo of my bear" %}
    image: async function(src, alt, classname, sizes = "100vw") {
      if(alt === undefined) {
          throw new Error(`Missing \`alt\` for: ${src}`);
      }
      // Prepend the image src with the full directory `inputPath`:
      let className = classname;
      let imageSrc = `${path.dirname(this.page.inputPath)}/${src}`;
      let metadata = await Image(imageSrc, {
        widths: [300, 1000],
        formats: ['avif','webp','jpeg'],
        // Write processed images to the correct `outputPath`
        // https://gfscott.com/blog/eleventy-img-without-central-image-directory/
        outputDir: path.dirname(this.page.outputPath),
        // Prepend the correct path to the image `src` value
        urlPath: this.page.url,
        filenameFormat: function (id, src, width, format, options) {
          const extension = path.extname(src);
          const name = path.basename(src, extension);
          return `${name}-${width}.${format}`;
        }
      });
      let imageAttributes = { alt, sizes, loading: 'lazy', decoding: 'async'}
      
      let lowsrc = metadata.jpeg[0];
      let highsrc = metadata.jpeg[metadata.jpeg.length - 1];
      
      //console.log(metadata);
    
      //return imageAttributes.sizes;
      return `<figure class='extend'><picture>
      ${Object.values(metadata).map(imageFormat => {
          return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
      }).join("\n")}
          <img
              src="${lowsrc.url}"
              width="${highsrc.width}"
              height="${highsrc.height}"
              alt="${alt}"
              loading="lazy"
              decoding="async">
      </picture>
      <figcaption>${alt}</figcaption>
      </figure>`;
    }

}
