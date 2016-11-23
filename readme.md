# Vanilla Bean (name TBA)
> Draft v1.1.1 (wip)

## What?
Vanilla Bean is an opinionated project structure guideline for developing frameworkless javascript applications.

## Why?
Frameworks tend to be slow and their codebases can easily get messy if written by an inexperienced developer. They often take weeks to learn and can take many months, if not years to fully understand.

Some of us favor `vanilla`, since anyone with `js` experience can understand it without having to watch a "Hello World" tutorial. However, it can be daunting for companies to take over an existing codebase written this way, since the code is "undocumented" and "lacking community support".

An app written with `Vanilla Bean` structure can be understood just by looking at the source, and would look familiar to devs invested in frameworks.

`Vanilla Bean` is very abstract and applies constraints only so that you don't have to think twice about where to put your code.

TL;DR:  
framework structure good, vanilla structure (possibly) random spaghetti, `vanilla bean` structure good!

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

4. [Examples](#4-examples)

5. [How do I X?](#5-how-do-i-x) (common scenarios)  
  5.1 Component communication

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
var include = require('gulp-include')
var concat = require('gulp-concat')
var merge = require('merge2')
var babel = require('gulp-babel')

function handleError (err) {
  console.log(err.stack)
  this.emit('end')
}

gulp.task('js', () => {
  var vendor = gulp.src('source/js/vendor.js')
    .pipe(include())

  var app = gulp.src('source/js/app.js')
    .pipe(include())
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
  attachedCallback () {
    this.classList.add('loading')
    CandyStore.fetch().then((data) => {
      this.classList.remove('loading')
      // Draw grid of candies
    })
  }
}
document.registerElement('candy-grid', CandyGrid)
```

Is it in the DOM? Make it a `component`.

### 2.2 Services
A `service` is a one-off instance that provides useful methods to the rest of your app.

Example:
```js
var CandyAPIService = (() => {
  var endpoint = 'https://example.com/api'

  function call (data = {}) {
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

  return {
    call
  }
})()
```

Is it outside the DOM and can be used by many things? Make it a `service`.

### 2.3 Stores
A `store` is a `service` specifically designed to work as data-gateways between `services` and `components`.

Example:
```js
var CandyStore = (() => {
  var candies = []

  formatData (data) {
    // Transform the data
    return data
  }

  function fetch () {
    return new Promise((resolve, reject) => {
      CandyAPIService.call('/candies').then((data) => {
        candies = transformData(data.candies)
        resolve(candies)
      })
    })
  }

  function getByID (id) {
    return candies.filter( entry => entry.id === id )[0]
  }

  return {
    fetch
    getByID
  }
})()
```

Does it give access to data? Make it a `store`.

## 3. Project Structure
### 3.1 Folder Overview
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

## 4. Examples
### 4.1 Candy Store Example
(wip)

## 5. How do I X? (common scenarios)
### 5.1 Component communication
Your components need to talk to each other. There are many ways of achieving this using:
- Event firing and listening
- Direct method calling
- Service middleman

## (WIP)
