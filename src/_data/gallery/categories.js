// PLEASE EDIT HERE 

const categories = [
    {
        key: "all",
        title: {en: "All categories", fr: "Toutes les catégories", nl: "Alle categorieën"}
    },
    {
        key: "accomodation",
        title: {en: "accomodation", fr: "accomodation", nl: "accomodatie"}
    },
    {
        key: "activities",
        title: {en: "activities", fr: "activités", nl: "activiteiten"}
    },
    {
        key: "volunteers",
        title: {en: "volunteers", fr: "volontairs", nl: "vrijwilligers"}
    },
    {
        key: "garden",
        title: {en: "garden", fr: "jardin", nl: "tuin"}
    },
    {
        key: "surrounding",
        title: {en: "environment", fr: "environnement", nl: "omgeving"}
    },
    {
        key: "food",
        title: {en: "food", fr: "nutrition", nl: "voedsel"}
    },
    {
        key: "crafts",
        title: {en: "crafts", fr: "artisanat", nl: "ambachten"}
    },
    {
        key: "construction",
        title: {en: "construction", fr: "construction", nl: "verbouwingen"}
    },
    {
        key: "nature",
        title: {en: "nature", fr: "nature", nl: "natuur"}
    }
]

// DONT EDIT AFTER HERE

const long = ["en", "fr", "nl"].map((l) => categories.map((c) => ({locale: l, key: c.key, title: c.title}))).flat()

module.exports = {short: categories, long: long}
