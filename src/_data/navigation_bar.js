// PLEASE EDIT HERE

let nav = [
    {
        type: "normal",
        title: {en: "who we are", fr: "qui sommes-nous?", nl: "wie we zijn"},
        link: "boskanter"
    },
    {
        type: "subordinated",
        title: {en: "who we are", fr: "qui sommes-nous?", nl: "wie we zijn"},
        link: "boskanter"
    },
    {
        type: "subordinated",
        title: {en: "permaculture", fr: "permaculture", nl: "permacultuur"},
        link: "boskanter/permaculture"
    },
    {
        type: "subordinated",
        title: {en: "transition towns",  fr: "villes en transition",  nl: "stransition towns"},  
        link: "boskanter/transition_towns"
    },
    {
        type: "subordinated",
        title: {en: "degrowth",  fr: "décroissance",  nl: "degrowth"},  
        link: "boskanter/degrowth"
    },
    {
        type: "subordinated",
        title: {en: "soil farm",  fr: "soil farm",  nl: "bodemboerderij"},  
        link: "boskanter/soilfarm"
    },
    {
        type: "subordinated",
        title: {en: "links",  fr: "links",  nl: "links"},  
        link: "boskanter/links"
    },
    {
        type: "normal",
        title: {en: "practical",  fr: "practical",  nl: "praktisch"},
        link: "practical"
    },
    {
        type: "subordinated",
        title: {en: "the way to Boskanter",  fr: "la route vers Boskanter",  nl: "de weg naar Boskanter"}, 
        link: "practical/contact"
    },
    {
        type: "subordinated",
        title: {en: "newsletter",  fr: "newsletter",  nl: "nieuwsbrief"}, 
        link: "https://boskanter.be/en/nieuwsbrieven/"
    },
    {
        type: "normal",
        title: {en: "offer", fr: "offre", nl: "aanbod"},
        link: "offer"
    },
    {
        type: "subordinated",
        title: {en: "What can Boskanter mean for you?",  fr: "Quoi peut Boskanter signifier pour toi?",  nl: "Wat kan Boskanter voor jou betekenen?"},
        link: "offer"
    },
    {
        type: "subordinated",
        title: {en: "activities",  fr: "activités",  nl: "activiteiten"}, 
        link: "offer/activities"
    },
    {
        type: "subordinated",
        title: {en: "products",  fr: "produits",  nl: "producten"}, 
        link: "offer/products"
    },
    {
        type: "subordinated",
        title: {en: "your activity in Boskanter",  fr: "votre activité à Boskanter",  nl: "jouw activiteit op Boskanter"}, 
        link: "offer/location"
    },
    {
        type: "subordinated",
        title: {en: "local volunteer",  fr: "volontair local",  nl: "plaatselijke vrijwilliger"},  
        link: "volunteer/local"
    },  
    {
        type: "normal",
        title: {en: "calendar",  fr: "calendrier",  nl: "kalender"},  
        link: "calendar"
    },
    {
        type: "normal",
        title: {en: "volunteering",  fr: "volontariat",  nl: "vrijwilligers"},
        link: "volunteer"
    },
    {
        type: "subordinated",
        title: {en: "volunteering in Boskanter",  fr: "volontariat à Boskanter",  nl: "vrijwilligers in Boskanter"},
        link: "volunteer"
    },
    {
        type: "subordinated",
        title: {en: "local volunteer",  fr: "volontair local",  nl: "plaatselijke vrijwilliger"},  
        link: "volunteer/local"
    },   
    {
        type: "subordinated",
        title: {en: "food and lodging",  fr: "gite et couvert",  nl: "kost en inwoon"}, 
        link: "volunteer/stay"
    },
    {
        type: "subordinated",
        title: {en: "subsidies",  fr: "subventions",  nl: "subsidies"}, 
        link: "volunteer/subsidy"
    },
    {
        type: "normal",
        title: {en: "blog",  fr: "blog",  nl: "blog"}
    },

    "insert blog categories here", 
    
    {
        type: "normal",
        title: {en: "Gallery", fr: "Galerie", nl: "Galerij"}
    },

    "insert gallery categories here",

    {
        type: "normal",
        title: {en: "practical",  fr: "practical",  nl: "praktisch"},
        link: "practical"
    },
    {
        type: "subordinated",
        title: {en: "the way to Boskanter",  fr: "la route vers Boskanter",  nl: "de weg naar Boskanter"}, 
        link: "practical/contact"
    },
    {
        type: "subordinated",
        title: {en: "newsletter",  fr: "newsletter",  nl: "nieuwsbrief"}, 
        link: "newsletter/subscribe"
    },
        
]

// DONT EDIT AFTER HERE

const blogcats = require('./blog/categories.js').short
const gallerycats = require('./gallery/categories.js').short
    
let entries = [["blog", blogcats], ["gallery", gallerycats]].map((cats) => cats[1].map((c) => {
    return {
        type: "subordinated",
        title: c.title,
        link: `${cats[0]}/${c.key}/`
    }
}))
let i = nav.findIndex((p) => p ==  "insert blog categories here")
let j = nav.findIndex((p) => p ==  "insert gallery categories here")
nav = [nav.slice(0,i), entries[0], nav.slice(i+1, j), entries[1]].flat()

function link(l, locale) {
	if (l.slice(0,4) == "http") { return l }
    return ["en/", "fr/", "nl/"].includes(l.slice(0,3)) ? "/" + l : "/" + locale + "/" + l 
}

const navbar = {en: undefined, fr: undefined, nl: undefined}

for (locale of ["en", "fr", "nl"]) {
    let lis = nav.map((p) => "<li>" + (p.link ? `<a href='${link(p.link, locale)}'>` : "") + p.title[locale] + (p.link ? "</a>" : ""))
    let types = nav.map((p) => p.type == "normal");
    types.push(false);
    let s = "";
    for (i=0; i<lis.length; i++) {
        s += lis[i] + ["<ul>", "</li>", "</ul></li>"][types[i+1]-types[i]+1];
    }
    navbar[locale] = `<ul><li><a href='/${locale}'>Boskanter</a></li>${s}</ul>`
}

module.exports = navbar
