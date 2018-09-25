import { paths } from "../paths";
import { Pose } from "../pose";

export default class LeftOculusTouch {
  constructor(gamepad) {
    // wake the gamepad api up. otherwise it does not report touch controllers.
    // in chrome it still won't unless you enter vr. phooey on that.
    navigator.getVRDisplays();
    this.gamepad = gamepad;
    this.buttonMap = [
      { name: "thumbStick", buttonId: 0 },
      { name: "trigger", buttonId: 1 },
      { name: "grip", buttonId: 2 },
      { name: "x", buttonId: 3 },
      { name: "y", buttonId: 4 }
    ];
    this.axisMap = [{ name: "joystickHorizontal", axisId: 0 }, { name: "joystickVertical", axisId: 1 }];

    this.pose = new Pose();
    this.rayObjectRotation = new THREE.Quaternion();
  }

  write(frame) {
    if (this.gamepad.connected) {
      this.gamepad.buttons.forEach((button, i) => {
        const buttonPath = paths.device.gamepad(this.gamepad.index).button(i);
        frame[buttonPath.pressed] = !!button.pressed;
        frame[buttonPath.touched] = !!button.touched;
        frame[buttonPath.value] = !!button.value;
      });
      this.gamepad.axes.forEach((axis, i) => {
        frame[paths.device.gamepad(this.gamepad.index).axis(i)] = axis;
      });

      this.buttonMap.forEach(button => {
        const outpath = paths.device.leftOculusTouch.button(button.name);
        frame[outpath.pressed] = !!frame[paths.device.gamepad(this.gamepad.index).button(button.buttonId).pressed];
        frame[outpath.touched] = !!frame[paths.device.gamepad(this.gamepad.index).button(button.buttonId).touched];
        frame[outpath.value] = !!frame[paths.device.gamepad(this.gamepad.index).button(button.buttonId).value];
      });
      this.axisMap.forEach(axis => {
        frame[paths.device.leftOculusTouch.axis(axis.name)] =
          frame[paths.device.gamepad(this.gamepad.index).axis(axis.axisId)];
      });

      const rayObject = document.querySelector("[super-hands]#player-left-controller").object3D;
      rayObject.updateMatrixWorld();
      this.rayObjectRotation.setFromRotationMatrix(rayObject.matrixWorld);
      this.pose.position.setFromMatrixPosition(rayObject.matrixWorld);
      this.pose.direction.set(0, 0, -1).applyQuaternion(this.rayObjectRotation);
      this.pose.fromOriginAndDirection(this.pose.position, this.pose.direction);
      frame[paths.device.leftOculusTouch.pose] = this.pose;
    }
  }
}
