const inGameActions = {
  // Define action sets here.
  // An action set separates "driving" controls from "menu" controls.
  // Only one action set is active at a time.
  default: {
    move: { label: "Move" },
    snap_rotate_left: { label: "Snap Rotate Left" },
    snap_rotate_right: { label: "Snap Rotate Right" },
    action_mute: { label: "Mute" },
    action_teleport_down: { label: "Teleport Aim" },
    action_teleport_up: { label: "Teleport" },
    action_share_screen: { label: "Share Screen" }
  },
  hud: {
    action_ui_select_down: { label: "Select UI item" },
    action_ui_select_up: { label: "Select UI item" }
  }
};

const config = {
  behaviours: {
    default: {
      "oculus-touch-controls": {
        joystick: "joystick_dpad4"
      },
      "vive-controls": {
        trackpad: "trackpad_dpad4",
        trackpad_scrolling: "trackpad_scrolling"
      },
      "windows-motion-controls": {
        joystick: "joystick_dpad4",
        axisMoveWithDeadzone: "msft_mr_axis_with_deadzone"
      },
      "daydream-controls": {
        trackpad: "trackpad_dpad4",
        axisMoveWithDeadzone: "msft_mr_axis_with_deadzone"
      },
      "gearvr-controls": {
        trackpad: "trackpad_dpad4",
        trackpad_scrolling: "trackpad_scrolling"
      },
      "oculus-go-controls": {
        trackpad: "trackpad_dpad4",
        trackpad_scrolling: "trackpad_scrolling"
      }
    }
  },
  mappings: {
    default: {
      "vive-controls": {
        "trackpad.pressedmove": { left: "move" },
        trackpad_dpad4_pressed_west_down: { left: "tertiary_action_west", right: "snap_rotate_left" },
        trackpad_dpad4_pressed_east_down: { left: "tertiary_action_east", right: "snap_rotate_right" },
        trackpad_dpad4_pressed_center_down: { left: "action_primary_down", right: "action_primary_down" },
        trackpad_dpad4_pressed_north_down: { left: "tertiary_action_north", right: "tertiary_action_north" },
        trackpad_dpad4_pressed_south_down: { left: "tertiary_action_south", right: "tertiary_action_south" },
        trackpadup: { left: "action_primary_up", right: "action_primary_up" },
        menudown: "thumb_down",
        menuup: "thumb_up",
        gripdown: ["primary_action_grab", "middle_ring_pinky_down"],
        gripup: ["primary_action_release", "middle_ring_pinky_up"],
        trackpadtouchstart: "thumb_down",
        trackpadtouchend: "thumb_up",
        triggerdown: ["secondary_action_grab", "index_down"],
        triggerup: ["secondary_action_release", "index_up"],
        scroll: { right: "scroll_move" }
      },
      "oculus-touch-controls": {
        joystick_dpad4_west: { right: "snap_rotate_left" },
        joystick_dpad4_east: { right: "snap_rotate_right" },
        joystick_dpad4_north: { right: "tertiary_action_north" },
        joystick_dpad4_south: { right: "tertiary_action_south" },
        joystick_dpad4_center: { left: "action_primary_up", right: "action_primary_up" },
        gripdown: ["primary_action_grab", "middle_ring_pinky_down"],
        gripup: ["primary_action_release", "middle_ring_pinky_up"],
        abuttontouchstart: ["thumb_down", "tertiary_action_west"],
        abuttontouchend: "thumb_up",
        bbuttontouchstart: ["thumb_down", "tertiary_action_east"],
        bbuttontouchend: "thumb_up",
        xbuttontouchstart: ["thumb_down", "tertiary_action_west"],
        xbuttontouchend: "thumb_up",
        ybuttontouchstart: ["thumb_down", "tertiary_action_east"],
        ybuttontouchend: "thumb_up",
        surfacetouchstart: ["thumb_down", "tertiary_action_north"],
        surfacetouchend: "thumb_up",
        thumbsticktouchstart: "thumb_down",
        thumbsticktouchend: "thumb_up",
        triggerdown: ["secondary_action_grab", "index_down"],
        triggerup: ["secondary_action_release", "index_up"],
        "axismove.reverseY": { left: "move", right: "scroll_move" },
        abuttondown: "action_primary_down",
        abuttonup: "action_primary_up"
      },
      "windows-motion-controls": {
        joystick_dpad4_west: {
          right: "snap_rotate_left"
        },
        joystick_dpad4_east: {
          right: "snap_rotate_right"
        },
        "trackpad.pressedmove": { left: "move" },
        joystick_dpad4_pressed_west_down: { left: "tertiary_action_west", right: "snap_rotate_left" },
        joystick_dpad4_pressed_east_down: { left: "tertiary_action_east", right: "snap_rotate_right" },
        trackpad_dpad4_pressed_north_down: { left: "tertiary_action_north", right: "tertiary_action_north" },
        trackpad_dpad4_pressed_south_down: { left: "tertiary_action_south", right: "tertiary_action_south" },
        trackpaddown: { right: "action_primary_down" },
        trackpadup: { left: "action_primary_up", right: "action_primary_up" },
        menudown: "thumb_down",
        menuup: "thumb_up",
        gripdown: ["primary_action_grab", "middle_ring_pinky_down"],
        gripup: ["primary_action_release", "middle_ring_pinky_up"],
        trackpadtouchstart: "thumb_down",
        trackpadtouchend: "thumb_up",
        triggerdown: ["secondary_action_grab", "index_down"],
        triggerup: ["secondary_action_release", "index_up"],
        axisMoveWithDeadzone: { left: "move", right: "scroll_move" }
      },
      "daydream-controls": {
        trackpad_dpad4_pressed_west_down: "snap_rotate_left",
        trackpad_dpad4_pressed_east_down: "snap_rotate_right",
        trackpad_dpad4_pressed_center_down: ["action_primary_down"],
        trackpad_dpad4_pressed_north_down: ["action_primary_down"],
        trackpad_dpad4_pressed_south_down: ["action_primary_down"],
        trackpadup: ["action_primary_up"],
        axisMoveWithDeadzone: "scroll_move"
      },
      "gearvr-controls": {
        trackpad_dpad4_pressed_west_down: "snap_rotate_left",
        trackpad_dpad4_pressed_east_down: "snap_rotate_right",
        trackpad_dpad4_pressed_center_down: ["action_primary_down"],
        trackpad_dpad4_pressed_north_down: ["action_primary_down"],
        trackpad_dpad4_pressed_south_down: ["action_primary_down"],
        trackpadup: ["action_primary_up"],
        triggerdown: ["action_secondary_down"],
        triggerup: ["action_secondary_up"],
        scroll: "scroll_move"
      },
      "oculus-go-controls": {
        trackpad_dpad4_pressed_west_down: "snap_rotate_left",
        trackpad_dpad4_pressed_east_down: "snap_rotate_right",
        trackpad_dpad4_pressed_center_down: ["action_primary_down"],
        trackpad_dpad4_pressed_north_down: ["action_primary_down"],
        trackpad_dpad4_pressed_south_down: ["action_primary_down"],
        trackpadup: ["action_primary_up"],
        triggerdown: ["action_secondary_down"],
        triggerup: ["action_secondary_up"],
        scroll: "scroll_move"
      }
    }
  }
};

export { inGameActions, config };
