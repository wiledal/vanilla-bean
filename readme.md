# Vanilla Bean
v1.2.0

## What?
Vanilla Bean is an opinionated project structure guideline for developing frameworkless javascript applications.

## Why?
Frameworks tend to be slow and the codebases made with them can get messy even if you have good intentions. They often take weeks to learn and can take many months, if not years to fully understand.

Some of us favor `vanilla`, since anyone with `js` experience should be able to understand it without having to watch 12-part tutorial. However, it can be daunting for companies to take over an existing codebase written this way, since the code is "undocumented" and "lacking community support".

An app written with `Vanilla Bean` structure can be understood just by looking at the source, and would look familiar to devs invested in frameworks.

The `Vanilla Bean` guideline is abstract and applies constraints only so that you don't have to think twice about where your files should go.

TL;DR:  
framework structure good, vanilla structure potential spaghetti, `vanilla bean` structure good!

## Contents
1. [Coding standards](#1-coding-standards)  
  1.1 [Linting and Code Style](#11-linting-and-code-style)  
  1.2 [Pre-processing](#12-pre-processing)

2. [Design Patterns](#2-design-patterns)  
  2.1 [Components](#21-components)  
  2.2 [Services](#22-services)  
  2.3 [Stores](#23-stores)  

3. [Project Structure](#3-project-structure)  
  3.1 [Folder Overview](#31-folder-overview)

## 1. Coding Standards
Following a js standard is _non-essential_ to the outcome of a project, but it's good practice to be inline with your fellow developers.

### 1.1 Linting and Code Style
Set up your project with a linter, and select a standard that works for you.  
Some good examples of standards are:  

- [AirBnB](https://github.com/airbnb/javascript)
- [StandardJS](http://standardjs.com/rules.html)

### 1.2 Pre-processing
Use a pre-processor to bundle your scripts and/or provide backwards compatibility.

Example `gulpfile.js`:
```js
var gulp = require('gulp')
var concat = require('gulp-concat')
var merge = require('merge2')
var babel = require('gulp-babel')

function handleError (err) {
  console.log(err.stack)
  this.emit('end')
}

gulp.task('js', () => {
  var vendor = gulp.src('source/js/vendor/**/*.js')

  var app = gulp.src('source/js/myapp/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
      .on('error', handleError)

  return merge(vendor, app)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build/js'))
})
```

## 2. Design Patterns
An app structured with `Vanilla Bean` uses three key concepts.

### 2.1 Components
`Components` build up the DOM elements of your app. They can work standalone, alongside or within other elements, and use `services` and `stores` to behave and display data.

Example (in [CustomElements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements/Custom_Elements_with_Classes) style):  
```js
class CandyGrid extends HTMLElement {
  connectedCallback () {
    this.classList.add('loading')
    CandyStore.load().then((data) => {
      this.classList.remove('loading')
      // Draw grid of candies
    })
  }
}
customElements.define('candy-grid', CandyGrid)
```

Is it in the DOM? Make it a `component`.

### 2.2 Services
A `service` is a one-off instance that provides useful methods to the rest of your app. We keep the code wrapped in a controller `[Object]` so that a change to data or structure will be reflected in every reference instantly.

Example:
```js
const CandyAPIService = (() => {
  // Private methods and variables can be defined isolated in the scope of the Service/Store
  var endpoint = 'https://example.com/api'

  // All public methods and variables are available in the controller
  const controller = {
    call (data = {}) {
      return new Promise((resolve, reject) => {
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          data: JSON.stringify(data)
        }).then((response) => {
          return response.json()
        }).then((json) => {
          resolve(json)
        })
      })
    }
  }

  return controller
})()
```

Services are also used to bridge elements to each other. Example: here a `ModalService` is exposed globally so that any element that needs it can request a modal display.
```js
const ModalService = (() => {
  var currentModal = null

  const controller = {
    show (modalName) {
      if (currentModal) currentModal.hide()
      currentModal = document.querySelector(`[data-modal=${modalName}]`)
      currentModal.in()
    }
  }

  return controller
})()

ModalService.show('newsletter-signup') // Show the newsletter modal
```

Is it not an element and can be accessed by many things? Make it a `service`.

### 2.3 Stores
A `store` is a `service` specifically designed to work as data-gateways between `services` and `components`.

Example:
```js
const CandyStore = (() => {
  // Private methods and variables can be defined isolated in the scope of the Service/Store
  function formatData (data) {
    return data.filter(entry => entry.visible)
  }

  // All public methods and variables are available in the controller
  const controller = {
    data: [],

    fetch () {
      return new Promise((resolve, reject) => {
        CandyAPIService.call('/candies').then((data) => {
          controller.data = transformData(data.candies)
          resolve(candies)
        })
      })
    },
    getByID (id) {
      return candies.filter( entry => entry.id === id )[0]
    }
  }

  return controller
})()
```

Does it give access to data? Make it a `store`.

## 3. Project Structure
### 3.1 Folder Overview
Maintaining a good folder structure is key to keeping satisfaction while working on lots of code.

Here's an example structure of a `vanilla bean` project.

```
project-root/
├── source/
│   ├── js/
│   │   ├── app.js
│   │   ├── vendor/
│   │   ├── components/
│   │   ├── services/
│   │   ├── stores/
```

Further, you'd probably want your components to be bundled in terms of their relationship to each other, like so:
```
project-root/
├── source/
│   ├── js/
│   │   [...]
│   │   ├── components/
│   │   │   ├── app-main.js
│   │   │   ├── common/
│   │   │   │   ├── smart-image.js
│   │   │   │   ├── video-player.js
│   │   │   ├── navigation/
│   │   │   │   ├── cool-logo-randomizer.js
│   │   │   │   ├── menu-item.js
│   │   │   │   ├── search-input.js
```

That way you know where to look based on where the component lives on the page.
