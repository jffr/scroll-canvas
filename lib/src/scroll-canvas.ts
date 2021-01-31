type TScrollCanvasOptions = {
  width: number;
  height: number;
  imagePaths: string[];
  containerElement: HTMLElement;
  rootElement?: HTMLElement;
  className?: string;
};

export default class ScrollCanvas {
  private readonly _canvas: HTMLCanvasElement;
  private readonly _containerElement: HTMLElement;
  private readonly _rootElement: HTMLElement | Document;
  private _context: CanvasRenderingContext2D;
  private _images: HTMLImageElement[];
  private _currentIndex: number;
  private _observer: IntersectionObserver;

  constructor (options: TScrollCanvasOptions) {
    const { width, height, imagePaths, className, rootElement, containerElement } = options;
    this._canvas = document.createElement('canvas');
    this._canvas.width = width;
    this._canvas.height = height;
    this._context = this._canvas.getContext('2d')!;
    this._currentIndex = 0;
    this._rootElement = rootElement ? rootElement : document;
    this._containerElement = containerElement;
    this._images = [];
    this.handleScroll = this.handleScroll.bind(this);

    this._containerElement.style.height = '400vh';

    if (className) {
      this._canvas.classList.add(className);
    }

    if (this._rootElement instanceof HTMLElement) {
      const styles: Partial<CSSStyleDeclaration> = {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        overflow: 'auto'
      };
      Object.assign(this._rootElement.style, styles);
    }

    this._observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          this._rootElement.addEventListener('scroll', this.handleScroll, { passive: true });
        } else {
          this._rootElement.removeEventListener('scroll', this.handleScroll);
        }
      },
      { threshold: [0, 1] }
    );

    this.preloadImages(imagePaths).then((images) => {
      if (images.length === 0) throw new Error('There are no images loaded for the canvas.');
      this._images = images;
      this._context.drawImage(this._images[0], 0, 0, this._canvas.width, this._canvas.height);
      this._observer.observe(this._containerElement);
    });
  }

  get canvas () {
    return this._canvas;
  }

  destroy () {
    this._rootElement.removeEventListener('scroll', this.handleScroll);
    this._observer.unobserve(this._containerElement);
    this._canvas.remove();
  }

  private createImage (imagePath: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imagePath;
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      return img;
    });
  }

  private updateImage (index: number) {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._context.drawImage(this._images[index], 0, 0, this._canvas.width, this._canvas.height);
  }

  private preloadImages (imagePaths: string[]) {
    const images = [];
    for (const imagePath of imagePaths) {
      images.push(this.createImage(imagePath));
    }
    return Promise.all(images);
  }

  private handleScroll () {
    requestAnimationFrame(() => {
      const scrollTop = this._rootElement instanceof HTMLElement ? this._rootElement.scrollTop : this._rootElement.documentElement.scrollTop;
      const frameCount = this._images.length;
      const maxScrollTop = this._containerElement.offsetHeight - window.innerHeight;
      const scrollFraction = (scrollTop - this._containerElement.offsetTop) / maxScrollTop;
      const frameIndex = Math.max(0, Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount)));

      if (frameIndex === this._currentIndex) return;
      this._currentIndex = frameIndex;
      this.updateImage(frameIndex);
    });
  }
}
