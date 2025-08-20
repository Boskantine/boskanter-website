const categories = require("./src/_data/gallery/categories")
const sass = require("sass");
const path = require("path")

module.exports = function(eleventyConfig) {
  for (folder of ["pictures", "scripts", "fonts", "build", "sendnewsletter", "icons"]) {
    eleventyConfig.addPassthroughCopy(`./src/${folder}`)
  }

    // Recognize Sass as a "template languages"
  eleventyConfig.addTemplateFormats("scss");

  // Compile Sass
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: async function (inputContent, inputPath) {
      // Skip files like _fileName.scss
      let parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) {
        return;
      }

      // Run file content through Sass
      let result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || "."],
        sourceMap: false, // or true, your choice!
      });

      // Allow included files from @use or @import to
      // trigger rebuilds when using --incremental
      this.addDependencies(inputPath, result.loadedUrls);

      return async () => {
        return result.css;
      };
    },
  });
  
  eleventyConfig.addShortcode('preview', (picture, subtitles) => `
	<div class="preview"> 
    <img src="/picturepreviews/${picture}"><br>
	  ${subtitles}` + (subtitles == "" ? "" : "<br>") +
  	  `<a href="/pictures/${picture}">see uncompressed version</a>
	</div>
  `)

  eleventyConfig.addFilter("extractSubjects", function(col) {
    let subjects = []
    for (p of col) {
      for (s of p.data.subject) {
        if (!subjects.includes(s)) {subjects.push(s)}
      }
    }
    return subjects
  })
  
  eleventyConfig.addFilter("reformatCalendarEntries", function(entries) {
    let events = []
    for (e of entries) {
      date = e.date.split(".").map(parseInt)
      events.push({ date : date[2] + ", " + (date[1]-1) + ", " + date[0], title: e.title, link: e.link })
    }
    return events
  })

  eleventyConfig.addFilter("removeLocale", function(url) {
    return url.slice(4)
  })

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: '_site'
    }
  }
}
