import { Rect2 } from "./types/math"

type CollisionLayerMask = number;
enum CollisionType { AABB }

class PhysicsServerItem {
  rect: Rect2 = new Rect2();
  radius: number = 0;

  collided: boolean = false;

  _collisionType: CollisionType;
  _layerMask: CollisionLayerMask;
  _collisionMask: CollisionLayerMask;
  _index: number;

  checkCollision(otherItem: PhysicsServerItem): boolean {
    switch (this._collisionType) {
      case CollisionType.AABB: {
        const left = this.rect.pos.x + this.rect.size.x > otherItem.rect.pos.x;
        const top = this.rect.pos.y + this.rect.size.y > otherItem.rect.pos.y
        const right = otherItem.rect.pos.x + otherItem.rect.size.x > this.rect.pos.x;
        const bottom = otherItem.rect.pos.y + otherItem.rect.size.y > this.rect.pos.y;
        return left && top && right && bottom;
      }
    }

    return false;
  }

  constructor(collisionType: CollisionType, layerMask: CollisionLayerMask, collisionMask: CollisionLayerMask, index: number) {
    this._collisionType = collisionType;
    this._layerMask = layerMask;
    this._collisionMask = collisionMask;
    this._index = index;
  };
}

class PhysicsLayer {
  items: PhysicsServerItem[] = [];
  layer: number;
  constructor(layer: number) {
    this.layer = layer;
  }
}

class PhysicsServer {
  layerCount: number;
  items: PhysicsServerItem[] = [];
  physicsLayers: PhysicsLayer[] = [];

  registerItem(layerMask: CollisionLayerMask = 1, collisionMask: CollisionLayerMask = 1, collisionType: CollisionType = CollisionType.AABB): PhysicsServerItem {
    let item = new PhysicsServerItem(collisionType, layerMask, collisionMask, this.items.length);
    item._layerMask = layerMask;
    item._collisionMask = collisionMask;

    // Add to global list
    this.items.push(item);
    // Add to layer list
    for (let layer of this.physicsLayers) {
      if ((1 << layer.layer) & layerMask) {
        layer.items.push(item);
      }
    }

    return item;
  }

  // Physics tick
  collideItems() {
    for (let item of this.items) {
      item.collided = false;
      for (let layer of this.physicsLayers) {
        if (!(item._collisionMask & (1 << layer.layer))) continue; // Skip this layer if not in the collision mask
        for (let otherItem of layer.items) {
          if (otherItem._index == item._index) continue; // Skip if this is the same item.
          const collided = item.checkCollision(otherItem);
          if (collided) {
            item.collided = true;
            break;
          }
        }
        if (item.collided) break;
      }
    }
  }

  constructor(layerCount: number = 4) {
    this.layerCount = layerCount;
    for (let i = 0; i < layerCount; ++i) {
      this.physicsLayers.push(new PhysicsLayer(i));
    }
  }
}

export { PhysicsServer, PhysicsServerItem }