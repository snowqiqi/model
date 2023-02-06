import { defaultMetadataStorage } from './storage';

// 简单类型
const simpleTypes = [String, Number, Boolean, Symbol];

/**
 * 查询指定路径属性
 * @param object
 * @param path
 */
function queryProperty(object: any, path: string): any {
  // 1. 路径解析
  // []替换成.调用符
  // 分割嵌套路径
  // 过滤空白路径
  const pathArray = path
    .replace(/\[(.*?)]/g, '.$1')
    .split('.')
    .filter((prop: string) => prop);
  // 2. 查询目标属性
  return pathArray.reduce((pre, property) => pre && (pre = pre[property]), object);
}

/**
 * 查询指定路径属性列表
 * @param object
 * @param paths
 */
function queryProperties(object: any, paths: string[]) {
  return paths.map(path => queryProperty(object, path));
}

/**
 * 获取不同类型对应的默认值
 * @param constructor
 */
function getDefaultValue(constructor: Function): any {
  if (constructor === String) return '';
  if (constructor === Number) return 0;
  if (constructor === Boolean) return false;
  if (constructor === Symbol) return Symbol('');
  if (constructor === Array) return [];
  if (constructor === Object) return {};
  return {};
}

export class Transformer {

  transform(source: Record<string, any>, value: Record<string, any> = {}, type: Function): any {
    const propertyList = defaultMetadataStorage.getPropertyList(type.prototype);

    propertyList.forEach(property => {
      const key = property.propertyName;
      // 获取类型
      const typeMetadata = defaultMetadataStorage.findType(property.prototype, key);
      const propertyType = typeMetadata.type || typeMetadata.reflectedType;

      // 查询映射值
      let targetValues = queryProperties(value, property.properties);
      // 执行转换函数并赋值
      this.executeTransformFn(source, key, targetValues, type);

      if (!propertyType) { // 无类型
        source[key] = undefined;

      } else if (typeMetadata.reflectedType === Array) { // 数组类型
        let list = source[key];
        source[key] = [];
        // 映射子项
        if (Array.isArray(list) || list instanceof Set) {
          list = Array.from(list);
          list.forEach((item: any, i: number) => {
            if (simpleTypes.includes(propertyType)) {
              source[key][i] = item;
              this.verifyType(source[key], i, propertyType);
              this.setDefaultValue(source[key], i, type, propertyType);
            } else if (!typeMetadata.type) {
              source[key][i] = item;
            } else {
              const object = Array.isArray(item) || item instanceof Set ? {} : item;
              source[key][i] = new propertyType(object);
            }
          });
        }

      } else if (simpleTypes.includes(propertyType)) { // 简单类型
        this.verifyType(source, key, propertyType);
        this.setDefaultValue(source, key, type, propertyType);

      } else { // 自定义类型
        const propertyValue = source[key];
        const object = Array.isArray(propertyValue) || propertyValue instanceof Set ? {} : propertyValue;
        source[key] = new propertyType(object);
      }
    });
    return source;
  }

  // 执行转换函数
  executeTransformFn(object: Record<string, any>, propertyName: any, propertyValues: any[], constructor: Function) {
    const metadata = defaultMetadataStorage.findTransform(constructor.prototype, propertyName);

    object[propertyName] = metadata
      ? object[propertyName] = metadata.transformFn(...propertyValues)
      : propertyValues[0];
  }

  // 校验类型
  verifyType(object: Record<string, any>, propertyName: any, type: Function) {
    if (object[propertyName] && object[propertyName].constructor !== type) {
      object[propertyName] = undefined;
    }
  }

  // 设置默认值
  setDefaultValue(object: Record<string, any>, propertyName: any, constructor: Function, type: Function) {
    if (object[propertyName] !== undefined && object[propertyName] !== null) return;
    const metadata = defaultMetadataStorage.findDefaultValue(constructor.prototype, propertyName);
    object[propertyName] = metadata
      ? metadata.defaultValue
      : getDefaultValue(type);
  }

}
