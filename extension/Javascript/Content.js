const fullscreen_id_class = `--Windowed-long-id-that-does-not-conflict--`;
const fullscreen_parent = `${fullscreen_id_class}-parent`;
const body_class = `${fullscreen_id_class}-body`;
const max_z_index = '2147483647';

// Aliasses for different browsers (rest of aliasses are in the inserted script)
let fullscreenchange_aliasses = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"];

// Insert requestFullScreen mock
const code_to_insert_in_page = `{
  // Alliases for different browsers
  let requestFullscreen_aliasses = ["requestFullscreen", "mozRequestFullScreen", "webkitRequestFullscreen", "msRequestFullscreen"];
  let exitFullscreen_aliasses = ["exitFullscreen", "webkitExitFullscreen", "webkitCancelFullScreen", "mozCancelFullScreen", "msExitFullscreen"];
  let fullscreenelement_aliasses = ["fullscreenElement", "webkitFullscreenElement", "mozFullscreenElement", "mozFullScreenElement", "msFullscreenElement", "webkitCurrentFullScreenElement"];

  let overwrite = (object, property, value) => {
    Object.defineProperty(object, property, {
      value: value,
      configurable: true,
    });
  }

  const set_fullscreen_element = (element = null) => {
    overwrite(document, 'webkitIsFullScreen', element != null); // Old old old
    for (let fullscreenelement_alias of fullscreenelement_aliasses) {
      overwrite(document, fullscreenelement_alias, element);
    }
  }

  const exitFullscreen = function() {
    if (document.fullscreenElement != null) {
      // If the fullscreen element is a frame, tell it to exit fullscreen too
      if (typeof document.fullscreenElement.postMessage === 'function') {
        document.fullscreenElement.postMessage.sendMessage({ type: "exit_fullscreen_iframe" });
      }

      window.postMessage({ type: "exit_fullscreen" }, "*");
      set_fullscreen_element(null);
    }
  }

  const requestFullscreen = function() {
    // Because youtube actually checks for those sizes?!
    const window_width = Math.max(window.outerWidth, window.innerWidth);
    const window_height = Math.max(window.outerHeight, window.innerHeight);
    overwrite(window.screen, 'width', window_width);
    overwrite(window.screen, 'height', window_height);

    const element = this;
    element.classList.add('${fullscreen_id_class}');
    set_fullscreen_element(element);
    window.postMessage({ type: "enter_fullscreen" }, "*");
    if (window.parent) {
      window.parent.postMessage({ type: "enter_fullscreen_iframe" }, "*");
    }
  }

  window.onmessage = (message) => {
    const frame = [...document.querySelectorAll('iframe')].find(x => x.contentWindow === message.source);
    if (frame && message.data) {
      if (message.data.type === 'enter_fullscreen_iframe') {
        requestFullscreen.call(frame); // Call my requestFullscreen on the element
      }
      if (message.data.type === 'exit_fullscreen_iframe') {
        exitFullscreen.call(document); // Call my exitFullscreen on the document
      }
    }
  }

  requestFullscreen_aliasses.forEach(requestFullscreenAlias => {
    if (typeof Element.prototype[requestFullscreenAlias] === 'function') {
      Element.prototype[requestFullscreenAlias] = requestFullscreen;
    }
  });

  exitFullscreen_aliasses.forEach(exitFullscreenAlias => {
    if (typeof Document.prototype[exitFullscreenAlias] === 'function') {
      Document.prototype[exitFullscreenAlias] = exitFullscreen;
    }
  });
}`;

let elt = document.createElement("script");
elt.innerHTML = code_to_insert_in_page;
document.documentElement.appendChild(elt);

let has_style_created = false;
let create_style_rule = () => {
  if (has_style_created) {
    return;
  }
  has_style_created = true;

  let styleEl = document.createElement('style');
  document.head.appendChild(styleEl);
  let styleSheet = styleEl.sheet;

  styleSheet.insertRule(`
    .${body_class} .${fullscreen_id_class} {
      position: fixed !important;
      top: 0 !important;
      bottom: 0 !important;
      right: 0 !important;
      left: 0 !important;
      z-index: ${max_z_index} !important;
    }
  `)
  styleSheet.insertRule(`
    .${body_class} .${fullscreen_parent} {
      /* This thing is css black magic */
      all: initial;
      z-index: ${max_z_index} !important;

      /* Debugging */
      background-color: rgba(0,0,0,.1) !important;
    }
  `)
  styleSheet.insertRule(`
    /* Not sure if this is necessary, but putting it here just in case */
    .${body_class} .${fullscreen_parent}::before,
    .${body_class} .${fullscreen_parent}::after {
      display: none;
    }
  `)
  styleSheet.insertRule(`
    .${body_class} {
      /* Prevent scrolling */
      overflow: hidden !important;

      /* For debugging, leaving this just in here so I see when something goes wrong */
      background-color: rgb(113, 0, 180);
    }
  `)
}

const send_event = (element, type) => {
  const event = new Event(type, {
    bubbles: true,
    cancelBubble: false,
    cancelable: false,
  });
  if (element[`on${type}`]) {
    element[`on${type}`](event);
  }
  element.dispatchEvent(event);
}

const parent_elements = function*(element) {
  let el = element.parentElement;
  while (el) {
    yield el;
    el = el.parentELement;
  }
}

  for (let fullscreenchange of fullscreenchange_aliasses) {
    send_event(element, fullscreenchange);
  }
  send_event(window, 'resize');
}

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
      return;

  // Going INTO fullscreen
  if (event.data.type && (event.data.type == "enter_fullscreen")) {
    create_style_rule();
    const element = document.querySelector(`.${fullscreen_id_class}`);

    // Add fullscreen class to every parent of our fullscreen element
    let el = element.parentElement;
    while (el) {
      el.classList.add(fullscreen_parent);
      el = el.parentElement;
    }

    // Send events
    send_fullscreen_events(element);

    // Add no scroll to the body and let everything kick in
    document.body.classList.add(body_class);

    // Send popup command to extension
    chrome.runtime.sendMessage({ type: 'please_make_me_a_popup' });
  }

  // Going OUT fullscreen
  if (event.data.type && (event.data.type == "exit_fullscreen")) {
    // Remove no scroll from body (and remove all styles)
    document.body.classList.remove(body_class);

    // Remove fullscreen class... from everything
    for (let element of document.querySelectorAll(`.${fullscreen_parent}`)) {
      element.classList.remove(fullscreen_parent);
    }

    const fullscreen_element = document.querySelector(`.${fullscreen_id_class}`);
    fullscreen_element.classList.remove(fullscreen_id_class);

    chrome.runtime.sendMessage({ type: 'please_make_me_a_tab_again' });
    // Send events
    send_fullscreen_events(element);
  }
});
