import ScrollCanvas from 'scroll-canvas';

async function init() {
  const rootElement = document.querySelector<HTMLElement>('.root');
  const containerElement = document.querySelector<HTMLElement>('.example');
  const imagePaths = await Promise.all([
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
    import('./images/24.png'),
  ]);

  if (!containerElement || !rootElement) {
    return;
  }

  const canvas = new ScrollCanvas({
    containerElement: containerElement,
    rootElement: rootElement,
    width: 800,
    height: 800,
    imagePaths: imagePaths.map((image) => image.default),
  });

  canvas.bootstrap();
}

init();
