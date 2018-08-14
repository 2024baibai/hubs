/**
 * Positions an entity relative to a given target when the given event is fired.
 * @component offset-relative-to
 */
AFRAME.registerComponent("offset-relative-to", {
  schema: {
    target: {
      type: "selector"
    },
    offset: {
      type: "vec3"
    },
    on: {
      type: "string"
    },
    selfDestruct: {
      default: false
    }
  },
  init() {
    this.updateOffset = this.updateOffset.bind(this);
    if (this.data.on) {
      this.el.sceneEl.addEventListener(this.data.on, this.updateOffset);
    } else {
      this.updateOffset();
    }
  },

  updateOffset: (function() {
    const offsetVector = new THREE.Vector3();
    return function() {
      const obj = this.el.object3D;
      const target = this.data.target.object3D;
      offsetVector.copy(this.data.offset);
      target.localToWorld(offsetVector);
      if (obj.parent) {
        obj.parent.worldToLocal(offsetVector);
      }
      obj.position.copy(offsetVector);
      this.el.body && this.el.body.position.copy(obj.position);
      target.getWorldQuaternion(obj.quaternion);
      this.el.body && this.el.body.quaternion.copy(obj.quaternion);
      if (this.data.selfDestruct) {
        if (this.data.on) {
          this.el.sceneEl.removeEventListener(this.data.on, this.updateOffset);
        }
        this.el.removeAttribute("offset-relative-to");
      }
    };
  })()
});
