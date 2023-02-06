import { Transformer } from './Transformer';

export class Model {

  constructor(object: any | any[]) {
    const transformer = new Transformer();
    if (Array.isArray(object) || object instanceof Set) {
      const instances: any[] = [];
      object.forEach((item: any) => {
        const instance: any = {};
        instance.__proto__ = this.constructor.prototype;
        instances.push(transformer.transform(instance, item, this.constructor))
      });
      return instances as any;
    } else {
      const instance: any = {};
      instance.__proto__ = this.constructor.prototype;
      return transformer.transform(instance, object, this.constructor)
    }
  }

}
