import ScrollCanvas from 'scroll-canvas';

const rootElement = document.querySelector('.root') as HTMLElement;
const containerElement = document.querySelector('.example') as HTMLElement;
const imagePaths = [...containerElement.getElementsByClassName('example-image')].map(el => el.getAttribute('src'));

if (containerElement !== null) {
  const canvas = new ScrollCanvas({
    className: 'example-canvas',
    containerElement: containerElement,
    rootElement: rootElement,
    width: 800,
    height: 800,
    imagePaths: imagePaths as string[]
  });

  const wrapper = document.querySelector('.example-wrapper')!;
  wrapper.innerHTML = '';
  wrapper.append(canvas.canvas);
  console.log(canvas);
}

