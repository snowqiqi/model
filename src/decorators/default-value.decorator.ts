import { defaultMetadataStorage } from '../storage';

/**
 * 该装饰器负责收集属性默认值.<br/>
 * 该装饰器可被应用于属性声明.<br/>
 * @param defaultValue 默认值
 */
export function DefaultValue(defaultValue: any): PropertyDecorator {

  return function (target: Object, propertyName: string | symbol): void {
    defaultMetadataStorage.addDefaultValueMetadata({
      prototype: target,
      propertyName: propertyName as string,
      defaultValue: defaultValue,
    });
  };
}
