import { PropertyMetadata } from './interfaces';
import { DefaultValueMetadata } from './interfaces';
import { TransformMetadata } from './interfaces';
import { TypeMetadata } from './interfaces';

export class MetadataStorage {

  private _propertyMetadatas = new Map<Object, Map<string, PropertyMetadata>>();
  private _defaultValueMetadatas = new Map<Object, Map<string, DefaultValueMetadata>>();
  private _transformMetadatas = new Map<Object, Map<string, TransformMetadata>>();
  private _typeMetadatas = new Map<Object, Map<string, TypeMetadata>>();

  addPropertyMetadata(metadata: PropertyMetadata): void {
    const metadatas = this._propertyMetadatas.get(metadata.prototype) ||
      new Map<string, PropertyMetadata>();
    metadatas.set(metadata.propertyName, metadata);
    this._propertyMetadatas.set(metadata.prototype, metadatas);
  }

  addDefaultValueMetadata(metadata: DefaultValueMetadata): void {
    const metadatas = this._defaultValueMetadatas.get(metadata.prototype) ||
      new Map<string, DefaultValueMetadata>();
    metadatas.set(metadata.propertyName, metadata);
    this._defaultValueMetadatas.set(metadata.prototype, metadatas);
  }

  addTransformMetadata(metadata: TransformMetadata): void {
    const metadatas = this._transformMetadatas.get(metadata.prototype) ||
      new Map<string, TransformMetadata>();
    metadatas.set(metadata.propertyName, metadata);
    this._transformMetadatas.set(metadata.prototype, metadatas);
  }

  addTypeMetadata(metadata: TypeMetadata): void {
    const metadatas = this._typeMetadatas.get(metadata.prototype) ||
      new Map<string, TypeMetadata>();
    metadatas.set(metadata.propertyName, metadata);
    this._typeMetadatas.set(metadata.prototype, metadatas);
  }

  getPropertyList(prototype: Object): PropertyMetadata[] {
    const metadatas = this._propertyMetadatas.get(prototype);
    return metadatas ? Array.from(metadatas.values()) : [];
  }

  findDefaultValue(prototype: Object, propertyName: string): DefaultValueMetadata | void{
    const metadatas = this._defaultValueMetadatas.get(prototype) ||
      new Map<string, DefaultValueMetadata>();
    return metadatas.get(propertyName);
  }

  findTransform(prototype: Object, propertyName: string): TransformMetadata | void {
    const metadatas = this._transformMetadatas.get(prototype) ||
      new Map<string, TransformMetadata>();
    return metadatas.get(propertyName);
  }

  findType(prototype: Object, propertyName: string): TypeMetadata {
    const metadatas = this._typeMetadatas.get(prototype) ||
      new Map<string, TypeMetadata>();
    const metadata = metadatas.get(propertyName);
    return metadata ||
      {
        prototype,
        propertyName,
        reflectedType: Reflect.getMetadata('design:type', prototype, propertyName),
        type: undefined,
      };
  }
}
