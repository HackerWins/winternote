const CHECK_CLICK_PATTERN = 'click';
const CHECK_MOUSE_PATTERN = 'mouse(down|up|move|over|out|enter|leave)';
const CHECK_POINTER_PATTERN = 'pointer(start|move|end)';
const CHECK_TOUCH_PATTERN = 'touch(start|move|end)';
const CHECK_KEY_PATTERN = 'key(down|up|press)';
const CHECK_DRAGDROP_PATTERN = 'drag|drop|drag(start|over|enter|leave|exit|end)';
const CHECK_CONTEXT_PATTERN = 'contextmenu';
const CHECK_INPUT_PATTERN = 'change|input';
const CHECK_CLIPBOARD_PATTERN = 'paste';
const CHECK_BEHAVIOR_PATTERN = 'resize|scroll';

const CHECK_PATTERN_LIST = [
  CHECK_CLICK_PATTERN,
  CHECK_MOUSE_PATTERN,
  CHECK_POINTER_PATTERN,
  CHECK_TOUCH_PATTERN,
  CHECK_KEY_PATTERN,
  CHECK_DRAGDROP_PATTERN,
  CHECK_CONTEXT_PATTERN,
  CHECK_INPUT_PATTERN,
  CHECK_CLIPBOARD_PATTERN,
  CHECK_BEHAVIOR_PATTERN
].join('|');

export const DOM_EVENT_CHECK_PATTERN = new RegExp(`^(${CHECK_PATTERN_LIST})`, "ig");
