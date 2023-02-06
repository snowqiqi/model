import { defaultMetadataStorage } from '../storage';

/**
 * 该装饰器负责收集属性转换函数.<br/>
 * 该装饰器可被应用于属性声明.<br/>
 * @param transformFn 转换函数
 */
export function Transform(transformFn: (...params: any[]) => any): PropertyDecorator {

  return function (target: Object, propertyName: string | symbol): void {
    defaultMetadataStorage.addTransformMetadata({
      prototype: target,
      propertyName: propertyName as string,
      transformFn: transformFn,
    });
  };
}
