[![Travis](https://img.shields.io/travis/locize/locizify/master.svg?style=flat-square)](https://travis-ci.org/locize/locizify)
[![Coveralls](https://img.shields.io/coveralls/locize/locizify/master.svg?style=flat-square)](https://coveralls.io/github/locize/locizify)
[![npm version](https://img.shields.io/npm/v/locizify.svg?style=flat-square)](https://www.npmjs.com/package/locizify)
[![Bower](https://img.shields.io/bower/v/locizify.svg)]()
[![David](https://img.shields.io/david/locize/locizify.svg?style=flat-square)](https://david-dm.org/locize/locizify)

# locizify

Drop the locizify script onto your website and it will automatically start to segment your content and connect it to your [locize](http://locize.com) project. Translating your content was never easier.

Just drop the following line to your header to deliver your content in any language:

```html
<script id="locizify" projectid="[PROJECT_ID]" apikey="[API_KEY]" referencelng="[LNG]" fallbacklng="[LNG]" src="https://unpkg.com/locizify@^2.0.0" />
```

locizify uses virtual-dom to update your page with translations based on the current content. MutationObserver is used to trigger translations on dynamically added content. So it should play well with any static or dynamic page not using a own virtual-dom implementation.

locizify comes bundled with [i18next](http://i18next.com/).



# Getting started

Add the script to your page:

```html
<!DOCTYPE html>
<html>
  <head>
    <script id="locizify"
      projectid="[PROJECT_ID]"
      apikey="[API_KEY]"
      referencelng="[LNG]"
      fallbacklng="[LNG]"
      src="https://unpkg.com/locizify@^2.0.0"
    />
  </head>
  ...
```

1. Reload your page.

2. Refresh your project on locize.io - there should be added a new namespace in your reference language having all the segments of this page.

3. Add a new language to your project and translate the content

4. Reload your page with `?lng='[newLanguage]'`

## Initialize with optional options

### via attibutes on script element

```html
<!DOCTYPE html>
<html>
  <head>
    <script id="locizify"
      projectid="[PROJECT_ID]"
      apikey="[API_KEY]"
      referencelng="[LNG]"
      fallbacklng="[LNG]"
      src="https://unpkg.com/locizify@^2.0.0"

      /* optional */
      version="[VERSION]"
      savemissing="[true|false (default true)]"
      debug="[true|false (default false)]"
    />
  </head>
  ...
```
### via init function

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/locizify@^2.0.0"></script>
    <script>
      locizify.init({
        // required
        fallbackLng: '[LNG]',
        backend: {
          projectId: '[PROJECT_ID]',
          apiKey: '[API_KEY]', // only needed if you like to add missing segments
          referenceLng: '[LNG]',
          version: '[VERSION]' // defaults to latest
        },

        // defaults that are set
        autorun: true, // setting to false init will return an object with start function
        ele: document.body, // pass in another element if you like to translate another html element
        ignoreTags: ['SCRIPT'], // tags to ignore

        // optional
        ignoreIds: ['ignoreMeId'],
        ignoreClasses: ['ignoreMeClass'],

        // attributes to translate
        translateAttributes: ['placeholder', 'title', 'alt', 'value#input.type=button', 'value#input.type=submit'],

        // merging content (eg. a tags in p tags)
        mergeTags: [], // tags to merge innerHtml to one key
        inlineTags: [], // tags to inline (eg. a, span, abbr, ...)
        ignoreInlineOn: [], // tags to ignore inlining tags under inlineTags

        // cleanup for keys
        cleanIndent: true, // removes indent, eg. if a p tag spans multiple lines
        ignoreCleanIndentFor: ['PRE', 'CODE'], // ignores cleaning up of indent for those tags needing that extra spaceing
        cleanWhitespace: true, // removes surrounding whitespace from key

        namespace: false, // set another name - default namespace will be translation
        namespaceFromPath: false // set true will use namepace based on window.location.pathname
        ns: ['common'] // -> only set if accessing more then one namepace

        // + all options available in i18next
      });
    </script>
  </head>
  ...
```

## Get project languages

To build some dynamic language selector you can load the available languages:

```js
locizify.getLanguages(function(err, lngs) {
  console.warn(lngs);
});

// returns something like
{
  "en": {
    "name": "English",
    "nativeName": "English",
    "translated": {
       "latest": 1,
       "production": 1
     }
  },
  "de": {
    "name": "German",
    "nativeName": "Deutsch",
    "translated": {
       "latest": 0.8,
       "production": 1
     }
  }
}
```

## Delay initial translation

```js
const translation = locizify.init({
  autorun: false
});

setTimeout(function () {
  translation.start();
}, 1000);
```

## Merge content

Just set translated attribute:

```html
<p merge>all inside will be used as on segment, even if having other <a>elements inside</a></p>

// key = all inside will be used as on segment, even if having other <a>elements inside</a>
```
Same could be done using options:

```html
mergeTags: [], // tags to merge innerHtml to one key
inlineTags: [], // tags to inline (eg. a, span, abbr, ...)
ignoreInlineOn: [], // tags to ignore inlining tags under inlineTags
```

## Fragment replacement for links and images

```html
<img src="/images/{{a.png}}" alt="big A" />
```

You will find `a.png` to be a key in your translation files - it's value can be replaced to eg. `a-de.png` for german (all other languages will fallback to `a.png`)

```html
<a href="/{{statistic}}">Open my statistics</a>
```

`statistic` will be a regular key that can be translated. But be aware you will need to provide that routes - eg. using [localized routes on the server](https://github.com/i18next/i18next-express-middleware#add-localized-routes)


## Avoid translating an element

###### By  attribute

Just set translated attribute:

```html
<div translated>this will not get translated - nor this elements children</div>
```

###### By ignoring tag, class, id

Just add needed items to the specific array:

```js
locizify.init({
  ignoreTags: ['SCRIPT'], // need to be uppercased
  ignoreIds: ['ignoreMeId'],
  ignoreClasses: ['ignoreMeClass']
});
```

```html
<script>this will not get translated - nor this elements children</script>
<div id="ignoreMeId">this will not get translated - nor this elements children</div>
<div class="ignoreMeClass">this will not get translated - nor this elements children</div>
```

Just add `translated`-attribute

## Advanced Translation Features

For [advanced translations](http://i18next.com/translate/) like plurals, interpolation, ... you need to add options to the element

#### Interpolation

```html
<div i18next-options='{"foo": "bar"}'>
  foo {{bar}}
  <p i18next-options='{"foo2": "bar2"}'>foo {{foo}}; foo2 {{foo2}}</p>
</div>
```

Options get inherited from parent to child nodes.

#### Plural

```html
<p i18next-options='{"count": 2}'>plural {{count}} items</p>
```

## Set different namespaces

Default would be translation.

#### Set a different one:

```js
locizify.init({
  namespace: 'myNamespace'
});
```

#### autogenerate one per route:

```js
locizify.init({
  namespaceFromPath: true
});
```

## Access different namespaces

This is useful for reused elements that are on every page, eg. like footer,... and you're using namespaceFromPath. This way you can avoid having that segments on every routes namespace file.

```js
locizify.init({
  namespaceFromPath: true
  ns: ['common'] // -> add additional namespaces to load
});
```

```html
<div i18next-options='{"ns": "common"}'>
  <p>different namespace common is used</p>
  <p>all the way down</p>
</div>
```



## Avoid flickering on initial load

To avoid to show the user the untranslated content in the reference language you can:

```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body style="display: none">
  ...
```

Just set the element style display to none. locizify will change it to block when ready.

## Change namespace dynamically per code

You can change the namespace after loading to some other file (eg. before transitioning to another page).

```js
locizify.changeNamespace('newNamespace');
```
