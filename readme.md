# Vanilla Bean
> Draft v1.0.0

## What?
Vanilla Bean is an opinionated collection of development structure guidelines for developing javascript applications using a frameworkless approach.

## Concepts
1. Coding standards  
  1.1 Linting and Code Style  
  1.2 Pre-processing

2. Design Patterns  
  2.1 Components  
  2.2 Services  
  2.3 Stores

3. Project Structure  
  3.1 Folder Overview

4. Examples

## 1. Coding Standards
### 1.1 Linting and Code Style
Set up your project to use a linter, and select a standard that works for you.  
Some good examples of standards are:  
- AirBnB
- StandardJS

### 1.2 Pre-processing
Use a pre-processor to bundle your scripts and/or provide backwards compatibility.

## 2. Design Patterns
Frameworks such as Angular and React all have clear structures making up the building blocks of apps. Building an app with `vanilla` should be no different. Following a clear structure makes your app understandable and easily digested.

Following these steps will help you design understandable apps.

### 2.1 Components
Components build up the elements of your app. They can work standalone, alongside or within other elements.  
Example (in `CustomElements` style):  
```js
class CandyGrid extends HTMLElement {
  attachedCallback() {
    this.classList.add('loading')
    CandyStore.fetch().then(() => {
      this.classList.remove('loading')
      // draw grid of candies
    })
  }
}
document.registerElement('candy-grid', CandyGrid)
```

### 2.2 Services
Services are one-off instances that provide useful methods to the rest of your app.  
Example:  
```js
const CandyAPIService = (function() {
  var endpoint = development ? 'localhost/api' : 'http://api.com'

  function call(action, data = {}) {
    return new Promise((resolve, reject) => {
      fetch(`${endpoint}${action}`, {
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

### 2.3 Stores
Stores are one-off instances that serve as data-gateways between `services` and `components`.  
Example:  
```js
const CandyStore = (function() {
  var candies = []

  async function fetch() {
    return new Promise((resolve, reject) => {
      CandyAPIService.call('/candies').then((data) => {
        candies = data.candies
        resolve(data)
      })
    })
  }

  function getByID(id) {
    return candies.filter( (entry) => entry.id === id )[0]
  }

  return {
    fetch
    getByID
  }
})()
```

## 3. Project Structure
### 3.1 Folder Overview
```
project-root/
├── source/
│   ├── js/
│   │   ├── app.js
│   │   ├── vendor/
│   │   ├── components/
│   │   ├── stores/
│   │   ├── services/
```
