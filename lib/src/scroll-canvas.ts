import { TScrollCanvasOptions } from './typings';

export default class ScrollCanvas {
  private readonly _className: string;
  private readonly _options: TScrollCanvasOptions;
  private _canvas: HTMLCanvasElement;
  private _root: HTMLElement | Document;
  private _observer: IntersectionObserver;
  private _wrapperElement: HTMLElement;
  private _containerElement: HTMLElement;
  private _images: HTMLImageElement[];
  private _currentIndex?: number;

  constructor (options: TScrollCanvasOptions) {
    this._images = [];
    this._options = options;
    this._className = options.className || 'cs';
    this.handleScroll = this.handleScroll.bind(this);
  }

  bootstrap () {
    const { width, height, imagePaths } = this._options;

    this.preloadImages(imagePaths)
      .then((images) => {
        if (images.length === 0) {
          throw new Error('Preloading images has failed. There are no images provided for the canvas.');
        }

        this._images = images;
        this._canvas = this.createCanvas(width, height);
        this._wrapperElement = this.createWrapper(this._canvas);
        this._root = this.initializeRoot();
        this._containerElement = this.initializeContainer();
    
        this._observer = this.createObserver(this._root);
        this._observer.observe(this._containerElement);
        this.handleScroll();
      });
  }

  get canvas () {
    return this._canvas;
  }

  destroy () {
    this._root.removeEventListener('scroll', this.handleScroll);
    this._observer.unobserve(this._containerElement);
    this._wrapperElement?.remove();
    this._canvas.remove();
  }

  private initializeRoot () {
    const { rootElement } = this._options;
    const root = rootElement ? rootElement : document;

    if (root instanceof HTMLElement) {
      const styles: Partial<CSSStyleDeclaration> = {
        height: '100vh',
        overflowY: 'auto',
      };
      Object.assign(root.style, styles);
    }
    
    return root;
  }

  private initializeContainer () {
    const { containerElement } = this._options;

    if (containerElement.hasChildNodes()) {
      console.error(`Container element should not have children. The space is reserved for the canvas.`, containerElement);
    }

    containerElement.style.height = '400vh';
    containerElement.append(this._wrapperElement!);
    return containerElement;
  }

  private createObserver (root: HTMLElement | Document) {
    return new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          root.addEventListener('scroll', this.handleScroll, { passive: true });
        } else {
          root.removeEventListener('scroll', this.handleScroll);
        }
      },
      { threshold: [0, 1] }
    );
  }

  private createCanvas (width: number, height: number) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.classList.add(`${this._className}__canvas`);
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';

    return canvas;
  }

  private createWrapper (canvas: HTMLCanvasElement) {
    const wrapper = document.createElement('div');
    wrapper.classList.add(this._className);
    wrapper.append(canvas);
    
    const styles: Partial<CSSStyleDeclaration> = {
      position: 'sticky',
      top: '0',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };
    Object.assign(wrapper.style, styles);

    return wrapper;
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
    const context = this._canvas.getContext('2d')!;
    context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    context.drawImage(this._images[index], 0, 0, this._canvas.width, this._canvas.height);
  }

  private preloadImages (imagePaths: string[]) {
    const images = [];
    for (const imagePath of imagePaths) {
      images.push(this.createImage(imagePath));
    }
    return Promise.all(images);
  }

  private getRootScrollTop () {
    return this._root instanceof HTMLElement ? this._root.scrollTop : this._root.documentElement.scrollTop;
  }

  private handleScroll () {
    requestAnimationFrame(() => {
      const frameCount = this._images.length;
      const maxScrollTop = this._containerElement.offsetHeight - window.innerHeight;
      const scrollFraction = (this.getRootScrollTop() - this._containerElement.offsetTop) / maxScrollTop;
      const frameIndex = Math.max(0, Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount)));

      if (frameIndex === this._currentIndex) return;
      this._currentIndex = frameIndex;
      this.updateImage(frameIndex);
    });
  }
}
