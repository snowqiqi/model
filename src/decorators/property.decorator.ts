import { defaultMetadataStorage } from '../storage';

/**
 * 该装饰器负责收集目标属性.<br/>
 * 该装饰器可被应用于属性声明.<br/>
 * @param properties 目标属性
 */
export function Property(...properties: string[]): PropertyDecorator {

  return function (target: Object, propertyName: string | symbol): void {
    defaultMetadataStorage.addPropertyMetadata({
      prototype: target,
      propertyName: propertyName as string,
      properties: properties,
    });
  };
}
