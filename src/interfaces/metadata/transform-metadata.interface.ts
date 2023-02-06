/**
 * 此对象为 @Transform 装饰器分配的元数据
 */
export interface TransformMetadata {
  prototype: Object;

  /**
   * 属性名称
   */
  propertyName: string;

  /**
   * 转换函数
   */
  transformFn: (...params: any[]) => any;
}
