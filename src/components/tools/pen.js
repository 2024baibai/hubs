import { paths } from "../../systems/actions/paths";
import { sets } from "../../systems/actions/sets";
/**
 * Pen tool
 * A tool that allows drawing on networked-drawing components.
 * @namespace drawing
 * @component pen
 */

function almostEquals(epsilon, u, v) {
  return Math.abs(u.x - v.x) < epsilon && Math.abs(u.y - v.y) < epsilon && Math.abs(u.z - v.z) < epsilon;
}

AFRAME.registerComponent("pen", {
  schema: {
    drawFrequency: { default: 5 }, //frequency of polling for drawing points
    minDistanceBetweenPoints: { default: 0.01 }, //minimum distance to register new drawing point
    camera: { type: "selector" },
    drawingManager: { type: "string" },
    color: { type: "color", default: "#FF0033" },
    availableColors: {
      default: [
        "#FF0033",
        "#FFFF00",
        "#0099FF",
        "#00FF33",
        "#9900FF",
        "#FF6600",
        "#8D5524",
        "#C68642",
        "#E0AC69",
        "#F1C27D",
        "#FFDBAC",
        "#FFFFFF",
        "#222222",
        "#111111",
        "#000000"
      ]
    },
    radius: { default: 0.01 }, //drawing geometry radius
    minRadius: { default: 0.005 },
    maxRadius: { default: 0.2 }
  },

  init() {
    this._stateAdded = this._stateAdded.bind(this);
    this._stateRemoved = this._stateRemoved.bind(this);

    this.timeSinceLastDraw = 0;

    this.lastPosition = new THREE.Vector3();
    this.lastPosition.copy(this.el.object3D.position);

    this.direction = new THREE.Vector3(1, 0, 0);

    this.currentDrawing = null;

    this.normal = new THREE.Vector3();

    this.worldPosition = new THREE.Vector3();

    this.colorIndex = 0;

    this.grabbed = false;
  },

  play() {
    this.drawingManager = document.querySelector(this.data.drawingManager).components["drawing-manager"];
    this.drawingManager.createDrawing();

    this.el.parentNode.addEventListener("stateadded", this._stateAdded);
    this.el.parentNode.addEventListener("stateremoved", this._stateRemoved);

    const actions = AFRAME.scenes[0].systems.actions;

    this.el.parentNode.addEventListener("grab-start", () => {
      actions.activate(sets.cursorHoldingPen);
    });
    this.el.parentNode.addEventListener("grab-end", () => {
      actions.deactivate(sets.cursorHoldingPen);
    });
  },

  pause() {
    this.el.parentNode.removeEventListener("stateadded", this._stateAdded);
    this.el.parentNode.removeEventListener("stateremoved", this._stateRemoved);
  },

  update(prevData) {
    if (prevData.color != this.data.color) {
      this.el.setAttribute("color", this.data.color);
    }
    if (prevData.radius != this.data.radius) {
      this.el.setAttribute("radius", this.data.radius);
    }
  },

  tick(t, dt) {
    const grabbable = this.el.parentNode.components.grabbable;
    if (
      grabbable.grabbers.length &&
      grabbable.grabbers[0] ===
        document.querySelector("[cursor-controller]").components["cursor-controller"].data.cursor
    ) {
      const actions = AFRAME.scenes[0].systems.actions;
      if (actions.poll(paths.app.cursorStartDrawing)) {
        this._startDraw();
      }
      if (actions.poll(paths.app.cursorStopDrawing)) {
        this._endDraw();
      }
      const penScaleMod = actions.poll(paths.app.cursorScalePenTip);
      if (penScaleMod) {
        this._changeRadius(actions.poll(paths.app.cursorScalePenTip));
      }
      if (actions.poll(paths.app.cursorPenNextColor)) {
        this._changeColor(1);
      }
      if (actions.poll(paths.app.cursorPenPrevColor)) {
        this._changeColor(-1);
      }
    }

    this.el.object3D.getWorldPosition(this.worldPosition);

    if (!almostEquals(0.005, this.worldPosition, this.lastPosition)) {
      this.direction.subVectors(this.worldPosition, this.lastPosition).normalize();
      this.lastPosition.copy(this.worldPosition);
    }

    if (this.currentDrawing) {
      const time = this.timeSinceLastDraw + dt;
      if (
        time >= this.data.drawFrequency &&
        this.currentDrawing.getLastPoint().distanceTo(this.worldPosition) >= this.data.minDistanceBetweenPoints
      ) {
        this._getNormal(this.normal, this.worldPosition, this.direction);
        this.currentDrawing.draw(this.worldPosition, this.direction, this.normal, this.data.color, this.data.radius);
      }

      this.timeSinceLastDraw = time % this.data.drawFrequency;
    }
  },

  //helper function to get normal of direction of drawing cross direction to camera
  _getNormal: (() => {
    const directionToCamera = new THREE.Vector3();
    return function(normal, position, direction) {
      directionToCamera.subVectors(position, this.data.camera.object3D.position).normalize();
      normal.crossVectors(direction, directionToCamera);
    };
  })(),

  _startDraw() {
    this.currentDrawing = this.drawingManager.getDrawing(this);
    if (this.currentDrawing) {
      this.el.object3D.getWorldPosition(this.worldPosition);
      this._getNormal(this.normal, this.worldPosition, this.direction);

      this.currentDrawing.startDraw(this.worldPosition, this.direction, this.normal, this.data.color, this.data.radius);
    }
  },

  _endDraw() {
    if (this.currentDrawing) {
      this.timeSinceLastDraw = 0;
      this.el.object3D.getWorldPosition(this.worldPosition);
      this._getNormal(this.normal, this.worldPosition, this.direction);
      this.currentDrawing.endDraw(this.worldPosition, this.direction, this.normal);
      this.drawingManager.returnDrawing(this);
      this.currentDrawing = null;
    }
  },

  _changeColor(mod) {
    this.colorIndex = (this.colorIndex + mod + this.data.availableColors.length) % this.data.availableColors.length;
    this.data.color = this.data.availableColors[this.colorIndex];
    this.el.setAttribute("color", this.data.color);
  },

  _changeRadius(mod) {
    this.data.radius = Math.max(this.data.minRadius, Math.min(this.data.radius + mod, this.data.maxRadius));
    this.el.setAttribute("radius", this.data.radius);
  },

  _stateAdded(evt) {
    switch (evt.detail) {
      case "activated":
        this._startDraw();
        break;
      case "colorNext":
        this._changeColor(1);
        break;
      case "colorPrev":
        this._changeColor(-1);
        break;
      case "radiusUp":
        this._changeRadius(this.data.minRadius);
        break;
      case "radiusDown":
        this._changeRadius(-this.data.minRadius);
        break;
      case "grabbed":
        this.grabbed = true;
        break;
      default:
        break;
    }
  },

  _stateRemoved(evt) {
    switch (evt.detail) {
      case "activated":
        this._endDraw();
        break;
      case "grabbed":
        this.grabbed = false;
        this._endDraw();
        break;
      default:
        break;
    }
  }
});
