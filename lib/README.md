# Scroll Canvas

## Features
* Easy API for creating scroll animations on your website;
* No custom CSS needed;
* Control the speed of the animation by providing the distance of the canvas;
* Scroll Canvas will not calculate the frame positions when it is outside the viewport;
* Example page to get you started (see GIT project).

## Example
Visit the [demo page](https://scrollcanvasstorage.z6.web.core.windows.net/) to see Scroll Canvas in action! _Big props to [Maikel Kerkhoven](https://www.maikelkerkhoven.com) for the artwork._

## Install

```
npm install scroll-canvas
```

## Usage
After installing the package you can import it into your project. Initialize `ScrollCanvas` with a list of images, and dimensions. You must also provide a container element, so it knows where to render the canvas.

```html
<div id="canvas"></div>
``` 

```typescript
import ScrollCanvas from 'scroll-canvas';

const canvas = new ScrollCanvas({
  container: document.getElementById('canvas'),
  distance: 4,
  width: 800,
  height: 800,
  imagePaths: [
    '/assets/images/01.jpg',
    '/assets/images/02.jpg',
    '/assets/images/03.jpg',
    '/assets/images/04.jpg',
    '/assets/images/05.jpg',
    '/assets/images/06.jpg'
  ]
});

canvas.bootstrap();
```
The frames are calculated with the scrollTop property of the document element. Calculating the position will not work when the canvas is placed inside an overflow element. To fix this you must also add the root element when initializing `ScrollCanvas`:
```javascript
const canvas = new ScrollCanvas({
  ...,
  root: document.getElementById('overflowElement')
})
```
