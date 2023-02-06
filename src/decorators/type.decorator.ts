import { defaultMetadataStorage } from '../storage';

/**
 * 该装饰器负责收集属性类型.<br/>
 * 该装饰器可被应用于属性声明.<br/>
 * @param type 属性类型
 */
export function Type(type: Function): PropertyDecorator {

  return function (target: Object, propertyName: string | symbol): void {
    defaultMetadataStorage.addTypeMetadata({
      prototype: target,
      propertyName: propertyName as string,
      reflectedType: Reflect.getMetadata('design:type', target, propertyName),
      type: type,
    });
  };
}
