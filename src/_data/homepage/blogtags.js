const fs = require("fs")
const { sin, cos, sqrt, max, min } = require('mathjs')

const numberOfTags = 30

let tags = []
for (locale of ['en', 'fr', 'nl']) {
    for (file of fs.readdirSync(`src/${locale}/blog/posts`)) {
        if (file == "posts.json") {continue}
        let h = fs.readFileSync(`src/${locale}/blog/posts/${file}`, { encoding: 'utf8' }).split('---\n')[1]
		if (h === undefined) {continue}
        let attributes = new Map(h.split('\n').map((l) => l.split(': ')))
        if (attributes.has("blogtags")) {
            for (t of attributes.get("blogtags").split(", ")) {
                tags[t] ? tags[t]++ : tags[t] = 1
            }
        }
    }
}

// edit after here

// edit before here

for (t in tags) {
	let scale = Math.pow(tags[t], 0.5)
	tags[t] = {scale: scale, width: t.length*scale, height: 1.8*scale, pos: undefined}
}

function spiral(n) {
	const rad = Math.sqrt(n)/10
	return [4*Math.sin(n)*rad, Math.cos(n)*rad]
}

function collision(a, b) {
	return (Math.max(a[0],b[0]) < Math.min(a[2],b[2])) && (Math.max(a[1],b[1]) < Math.min(a[3],b[3]))
}

const boxes = []

for (t in tags) {
	for (n=0; true; n++) {
		let pos = spiral(n)
		let box = [pos[0], pos[1], pos[0]+tags[t].width, pos[1]+tags[t].height]
		if (!boxes.reduce((acc, curr) => acc || collision(curr,box), false)) {
			boxes.push(box)
			tags[t].pos = pos
			break
		}
	}
}

const dimensions = boxes.reduce((acc, curr) => [Math.min(acc[0],curr[0]),Math.min(acc[1],curr[1]),Math.max(acc[2],curr[2]),Math.max(acc[3],curr[3])], [0,0,0,0])

const border = 0
const scale = 20
const tagscale = 2.1*scale/40
const width = scale*(dimensions[2]-dimensions[0])+2*border
const height = scale*(dimensions[3]-dimensions[1])+2*border

for (t in tags) {
	tags[t].pos = [scale*(tags[t].pos[0]-dimensions[0])+border, scale*(tags[t].pos[1]-dimensions[1])+border]
}

let svg = {en: undefined, fr: undefined, nl: undefined}

for (l of ["en", "fr", "nl"]) {
	svg[l] = `<svg id="tags" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`
	for (t in tags) {
		let tt = tags[t]
		svg[l] += `<a href="/${l}/blog/all/?q=${t}">`
			+`<text x="0" y="0" font-size="30" text-anchor="left" dominant-baseline="hanging" transform="translate(${tt.pos[0]} ${tt.pos[1]}), scale(${tt.scale*tagscale})" font-family="monospace">${t}</text>`
			+ "</a>"
	}
	svg[l] += "</svg>"
}

module.exports = svg
