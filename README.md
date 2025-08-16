# How to edit the Website

First of all, to do anything on the website, you have to make a GitHub Account and ask Ine to become a collaborator on this repository. Then you can edit everything of the website right here. To apply the changes you made, go to [www.boskanter.earth/build](www.boskanter.earth/build), type in the password and click "rebuld website".

## Table of Contents

- [Writing a blogpost](#writing-a-blogpost)
- [Writing an article page](#writing-an-article-page)
- [Adding a picture: For general use, to be displayed in the gallery or to be used as an icon](#adding-a-picture-for-general-use-to-be-displayed-in-the-gallery-or-to-be-used-as-an-icon)
- [Editing specific pages](#editing-specific-pages)
	+ [Homepage](#the-homepage)
	+ [Calendar](#the-calendar)
	+ [Gallery](#the-gallery)
- [Editing the navigation bar](#editing-the-navigation-bar)
- Writing markdown


## Writing a Blogpost
1. Decide which language you want to write in: The website supports english (en), french (fr) and dutch (nl). 
2. Create a new file in `/src/en/blog/posts` if you want to write in english. If you want to write in french or dutch exchange `en` with `fr` or `nl`. Your filename should end with `.md`. I will showcase how everything works by showing exerpts from the blogpost `/src/en/blog/posts/a_sustainable_website.md`

3. In the first lines of the file, provide the posts metadata. It should look like this:

```
---  
title: A sustainable website  
icon: plant.svg  
category: low-tech  
blogtags: internet, low-tech, website, saving energy, privacy  
author: Philipp  
authorcountry: Germany  
---
```


Dont forget the 3 dashes in the beginning and end, and write title, icon ... just as they are written here. You can ommit any line but "title" if you dont want to provide this information. In the respective lines after ": " you have to give: 
- a title
- optionally an icon (the filename of a graphic saved in `/src/icons` - your welcome to add your own svg graphic)
- optionally a category key (available categories are written down in `/src/_data/blog/categories.js`)
- optionally a comma separated list of blogtags - this can be anything you like. Maybe try to give about 5 that describe your post
- optionally an author - just write whatever you want to be displayed
- optionally the country your from - I thought that might give an interesting glimpse into the international nature of Boskanter
	
4. After the block with metadata, you can write your post in markdown. Markdown is a specific code to write formatted text in a regular text file. See more in the chapter [writing markdown](#writing_markdwown). The first few lines after the block with metadata in a_sustainable_website.md, which include markdown code for a numbered list, a second level heading and a table, look like this for example:

```
My name is Philipp and I was a long-term volunteer in Boskanter from ...

So to summarize, when making this website, I tried to deal most ...

1. Energy usage of the website
2. How "addictive" is the website (How good is the website at giving ...
3. Privacy (What data do we collect from you, what data do we enable ...

Lets discuss how we tried to deal with that:

## Pictures

Most of the data that is sent by the old website is pictures. This is ...

|File|Size|
|---|---|
|The whole bible as a txt file| 5MB |
|A jpg picture with 1500x1500 pixels (medium resolution)|500KB = 0,5MB|

```


## Writing an article page
An article page is any page that isnt a blogpost and doesnt have a custom layout like the homepage, the calendar, the blogfeed and the gallery. It is a plain page where you can write anything that you can write in markdown. To writen an article page.
1. Decide what language the page should be in. Then create the file in `/src/en/path/to/your/file.md` if it is in english and exchange `en` by the respective acronym (`fr` or `nl`) if you write in a different language. The rendered page will then be accessible at `www.boskanter.earth/en/path/to/your/file/`. I recommend that you write most article pages of permanent relevance in all languages if you have the time. Then it is important that all three of them have, besides the different language acronyms, the same filepath, so for example `/src/en/path/to/your/file.md`, `/src/fr/path/to/your/file.md` and `/src/nl/path/to/your/file.md`. Then when people change the language of the site, they are transfered to the version of your page written in the respective language.
2. In the first few lines you have to provide some metadata enclosed by two lines with three dashes - in this case only the title and the layout, which has to be `layouts/article.html`. Alltogheter it could look like this:
```
---
title: directions
layout: layouts/article.html
---
```
3. After the block with metadata, you can write your post in markdown. Markdown is a specific code to write formatted text in a regular text file. See more in the chapter [writing markdown](#writing_markdwown).
4. Linking to other pages: write '/nl/folder/filename'; if you just write 'filename' it considers the path being '/nl/folder with name of file you write in/filename'


## Adding a picture: For general use, to be displayed in the gallery or to be used as an icon

### For general use
Upload the picture in `/src/pictures` and rebuild the website. The picture will then be available at `www.boskanter.earth/pictures/filname.jpg`. You can then add it to your pages by writing `![write image description here](/pictures/filname.jpg)`.

### To be displayed in the gallery
To put a pciture in the gallery, you (1) add it just as a regular picture and then (2) tell the website that this picture belongs in the gallery. To do that
1. Do everything described in the previous section.
2. Open `/src/_data_gallery/pictures.json`. You will see, that the file has the general structure of a comma seperated lists of blocks wrapped in curly brackets. The list itself is in turn wrapped in square brackets. To add the picture to the gallery, add a new block with curly brackets (dont forget to add a new comma after the previous one). It should look like this:
```
    {
        "key": "pizzafeestje.jpg",
        "date": "10.1.2024",
        "category": "something",
        "description": {"en": "pizza party", "fr": "pizza", "nl": "pizzafeestje"}
    }
```

Here you can also ommit the lines "date" and "category". It is very important that you respect the JSON syntax (otherwise an error will pe produced): Remember to put a comma after each line but the last one and wrap any word or sentence in quotation marks. The order of entries is not important. In the respective lines after ": " you have to give:

- The name of your file as you uploaded it to `pictures`
- Optionally a date
- Optionally a categorykey (The available categorykeys are written down and can be edited in `/src/_data/gallery/categories.js`)
- A description object, with descriptions in english, french and dutch


## Editing specific pages

### The Homepage
The content of the homepage feeds itself from three files in `/src/_data/homepage`: `blogtags.js`, `yellowbox.json` and `highlights.json`.

#### blogtags.js

`blogtags.js`is responsible for generating the word cloud with tags from the blog. The default behavior is, that the 30 tags that appear the most are used for the wordcloud (you can modify this number by changing the line `const numberOfTags = 30` to a different number). If you want to control yourself what appears in the wordcloud and with which size, write the following between the two lines `\\ edit after here`, `\\ edit before here`:

```
// edit after here

tags = {
	"a tag": 10,
 	"another tag": 20,
  	"yet another tag": 10,
	"add": 1,
 	"as": 4,
  	"many": 5,
   	"as": 10,
	"you": 100,
 	"like": 200
}

// edit before here
```

Between the brackets you can write your desired words with a number (in the default behaviour this number is the number of appearances as a tag). In the wordcloud the area of each letter of the word will be proportional to this number. If you want the default beavior just make sure that the lines between the two are empty. Also pay attention to the correct syntax: Write a comma after each line between the brackets but the last one.


#### yellowbox.json

This one is responsible for filling the yellow box with content. I saw it as space for a little introduction, but of course anything can go in there. In the file there is an object with the attributes `"en"`, `"fr"` and `"nl"`. After the colon, write, enclosed by qoutes, the content in the specified language. You can also write HTML (but no markdown), to add a heading (`<h1>...</h1>`) or bold text (`<strong>...</strong>`) for example. A viable fileentry could be for example:

```
{
	"en": "<h1>Hello</h1>Welcome to our website",
	"fr": "<h1>Salut</h1>Bienvenue sur notre site",
	"nl": "<h1>Hallo</h1>Welkomen op onze website"
}
```

#### highlights.json

Here you specifiy which highlights will be shown on the website: A highlight is a little heading, a description, optionally a picture with a caption and a link to any page you want to highlight. You will see, that the file has the general structure of a comma seperated lists of blocks wrapped in curly brackets. The list itself is in turn wrapped in square brackets. Each block in the list corresponds to a highlight. It should look like this:

```
{ 
	"title": { "en": "forest", "fr": "fôret", "nl": "bos"},
	"image": "forest.jpg",
	"imagesubtitle": { "en": "A forest", "fr": "une fôret", "nl": "een bos" },
	"description": { 
		"en": "<em>A lot of trees</em></p><p>Thats a forest.</p>",
		"fr": "<em>Beacoup d'arbres</em>C'est un fôret.",
		"nl": "<em>Veel bomen</em><p>Dat is een bos.</p>"
	},
	"link": "en/blog/posts/what_is_a_forest/"
}
```

Here you can also ommit the lines "image" and "imagesubtitle" (to make the wesbite faster and safe energy it is even better if you do). It is very important that you respect the JSON syntax (otherwise an error will pe produced): Remember to put a comma after each line but the last one and wrap any word or sentence in quotation marks. The order of entries is not important. In the respective lines after ": " you have to give:

- a title in english, french and dutch
- Optionally an image via the name of a file that is uploaded to `/src/pictures`
- Optionally an imagesubtitle in english, french and dutch
- A description in english, french and dutch
- A link to a page on the website - Here the behaviour is that if the link does not start with `en`, `fr` or `nl`, for example `path/to/page/`, the link leads to `www.boskanter.earth/en/path/to/page/`, `www.boskanter.earth/fr/path/to/page` or `www.boskanter.earth/nl/path/to/page` depending on which language they are viewing the homepage. If the link starts with `en`, `fr` or `nl`, for example `en/path/to/page`, the link always leads to `www.boskanter.earth/en/path/to/page`.

### The Calendar
To edit the entries in the calendar, open `/src/_data/calendar_entries.js`. In the beginning of the file you will find the array `entries` that contains all the entries. An entry is a block wrapped by two curly brackets. The whole array could look like this:

```
const entries = [
    {
        start: "23.7.2024",
        end: "23.7.2024", 
        title: {en: "Pizza Party", nl: "Pizza Party", fr: "Pizza Party"}, 
        description: {en: "We will bake Pizza in our oven. Click <a href='/en/pizza_party'>here</a> for details.", nl: " ... ", fr: " ... "}
    },
    {
        start: "8.7.2024",
        end: "28.7.2024",
        title: {en: "Workcamp", fr: "Workcamp", nl: "Workcamp"},
        description: {en: "We will invite 10 people from all over Europe to work with us", nl: " ... ", fr: " ... "}
    } 
]
```
In an entry you have to provide
- a start and end date (written as (D)D.(M)M.YYYY, day and month can be one or two letters)
- a title in english, french and dutch
- a description in english, french and dutch. Here you can also write HTML to link to other pages (<a href='/path/to/your/page'>linkname</a>) or to write things bold, italic, etc... The description will be displayed when the entry is clicked in the calendar.

Remember to put commas and quotationmarks as in the example. Otherwise the server will not be able to rebuild the website.

### The Gallery
Read how to add a picture to the gallery in the section "Adding Pictures".


## Editing the navigation bar
The navigation bar is rendered into html as a nested list (with nesting depth not more than one). For example currently the html understands it as

- Boskanter
- Principles
	+ Permaculture
	+ Transition Towns
	+ Links
- Practical
	+ ESC Volunteering
	+ Workaway Volunteering
	+ Directions
- Blog
	+ All Categories
	+ Category 1
	+ Category 2 ...
- Caledar
- Gallery
	+ All Categories
	+ Category 1
	+ Category 2 ...

The second level items will be rendered dropping down from the first level items they belong to. This list is rendered from the contents of `/src/_data/navigation_bar.js`. The entries are written down at the beginning of the file in the array `nav`. The array nav includes regular entries and instructions. 

The instructions specify how nav is processed afterwards, at the moment there are the instructions `"insert blog categories here"` and `"insert gallery categories here"`. They specify where the blog- and gallerycategories should be added. You are welcome to change the position of these instructions or delete them, but I discourage any editor from trying to make new ones, because you would need to modify the code below.

What nav now describes is each entry of the nested list in the order they appear. In each entry it is specified wether it appears as a first level or second level element. An entry looks like this

```
{
    type: "normal",
    title: {en: "principles", fr: "principes", nl: "principes"},
    link: "principles"
}
```
in the case of a first level element, and like this
```
{
    type: "subordinated",
    title: {en: "permaculture", fr: "permaculture", nl: "permakultuur"},
	link: "permaculture"
}
```
in the case of a second level element. Here
- type describes the level and can be either "normal" (level 1) or "subordinated" (level 2)
- title is an object that describes what is displayed in each language
- link is a page of the website (available in each language). If the link is `path/to/page`, then the entry will link to `www.boskanter.earth/en/path/to/page`, `www.boskanter.earth/fr/path/to/page`, `www.boskanter.earth/nl/path/to/page`. Depending which language the visitor has selected at the moment. If you want to link to a specific language, for example dutch, then include it in the link by writing for example `nl/path/to/page`. When link starts with `en/`, `fr/` or `nl/`, it will always link to the specified language, no matter of the language the visitor selected.
- the page referred to can be directly under `en` etc, or it can be in a dubfolder; linking to a heading in a file doesn't work

### navigating between articles

- to link to a file in the same folder or subfolder, just give in the name of the file, without folders












