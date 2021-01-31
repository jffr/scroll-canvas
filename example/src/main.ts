import ScrollCanvas from 'scroll-canvas';

async function bootstrap() {
  const rootElement = document.querySelector('.root') as HTMLElement;
  const containerElement = document.querySelector('.example') as HTMLElement;
  const images = [
    import('./images/01.png'),
    import('./images/02.png'),
    import('./images/03.png'),
    import('./images/04.png'),
    import('./images/05.png'),
    import('./images/06.png'),
    import('./images/07.png'),
    import('./images/08.png'),
    import('./images/09.png'),
    import('./images/10.png'),
    import('./images/11.png'),
    import('./images/12.png'),
    import('./images/13.png'),
    import('./images/14.png'),
    import('./images/15.png'),
    import('./images/16.png'),
    import('./images/17.png'),
    import('./images/18.png'),
    import('./images/19.png'),
    import('./images/20.png'),
    import('./images/21.png'),
    import('./images/22.png'),
    import('./images/23.png'),
    import('./images/24.png')
  ];

  const imagePaths = await Promise.all(images);
  
  if (containerElement !== null) {
    const canvas = new ScrollCanvas({
      className: 'example-canvas',
      containerElement: containerElement,
      rootElement: rootElement,
      width: 800,
      height: 800,
      imagePaths: imagePaths.map((image) => image.default)
    });
  
    const wrapper = document.querySelector('.example-wrapper')!;
    wrapper.append(canvas.canvas);
  }
}

bootstrap();