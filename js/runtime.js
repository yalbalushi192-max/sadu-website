/* Sadu site runtime: a very small template engine.
   The page markup lives in <template id="page">. It may contain:
     {{ path }}                      a value from the page script's renderVals()
     <sc-if value="{{ path }}">      show the content only when the value is true
     <sc-for list="{{ path }}" as="x">  repeat the content for each item
     onclick="{{ path }}"            call a function from renderVals() on click
   Calling setState() in the page script draws the page again. */
(function () {
  'use strict';

  function lookup(scope, path) {
    var parts = path.trim().split('.');
    var value = scope;
    if (parts[0] === 'true') return true;
    if (parts[0] === 'false') return false;
    for (var i = 0; i < parts.length; i++) {
      if (value == null) return undefined;
      value = value[parts[i]];
    }
    return value;
  }

  var WHOLE = /^\s*\{\{([^}]+)\}\}\s*$/;
  var ANY = /\{\{([^}]+)\}\}/g;

  function fillText(text, scope) {
    return text.replace(ANY, function (_, path) {
      var v = lookup(scope, path);
      return v == null ? '' : String(v);
    });
  }

  function unwrap(el) {
    var parent = el.parentNode;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  }

  function process(node, scope) {
    var child = node.firstChild;
    while (child) {
      var next = child.nextSibling;
      if (child.nodeType === 3) {
        if (child.nodeValue.indexOf('{{') !== -1) child.nodeValue = fillText(child.nodeValue, scope);
      } else if (child.nodeType === 8) {
        node.removeChild(child);
      } else if (child.nodeType === 1) {
        var tag = child.tagName.toLowerCase();
        if (tag === 'sc-if') {
          var m = WHOLE.exec(child.getAttribute('value') || '');
          if (m && lookup(scope, m[1])) {
            process(child, scope);
            unwrap(child);
          } else {
            node.removeChild(child);
          }
        } else if (tag === 'sc-for') {
          var lm = WHOLE.exec(child.getAttribute('list') || '');
          var list = (lm && lookup(scope, lm[1])) || [];
          var name = child.getAttribute('as') || 'item';
          for (var i = 0; i < list.length; i++) {
            var copy = child.cloneNode(true);
            var inner = Object.create(scope);
            inner[name] = list[i];
            inner.$index = i;
            process(copy, inner);
            while (copy.firstChild) node.insertBefore(copy.firstChild, child);
          }
          node.removeChild(child);
        } else {
          fillElement(child, scope);
          process(child, scope);
        }
      }
      child = next;
    }
  }

  function fillElement(el, scope) {
    var attrs = Array.prototype.slice.call(el.attributes);
    for (var i = 0; i < attrs.length; i++) {
      var a = attrs[i];
      if (a.value.indexOf('{{') === -1) continue;
      var whole = WHOLE.exec(a.value);
      if (a.name.indexOf('on') === 0 && whole) {
        var fn = lookup(scope, whole[1]);
        el.removeAttribute(a.name);
        if (typeof fn === 'function') el.addEventListener(a.name.slice(2), fn);
      } else {
        el.setAttribute(a.name, fillText(a.value, scope));
      }
    }
  }

  function DCLogic(props) {
    this.props = props || {};
    this.state = {};
  }
  DCLogic.prototype.setState = function (update) {
    for (var k in update) this.state[k] = update[k];
    if (this._render) this._render();
  };
  window.DCLogic = DCLogic;

  window.startPage = function (Component, props) {
    var template = document.getElementById('page');
    var root = document.getElementById('app');
    var page = new Component(props || {});

    page._render = function () {
      // keep what the visitor typed and where the focus is
      var typed = {};
      var inputs = root.querySelectorAll('input[id]');
      for (var i = 0; i < inputs.length; i++) typed[inputs[i].id] = inputs[i].value;
      var active = document.activeElement;
      var focusKey = active && root.contains(active) ? focusPath(active, root) : null;

      var fresh = template.content.cloneNode(true);
      process(fresh, page.renderVals());
      root.replaceChildren(fresh);

      for (var id in typed) {
        var el = document.getElementById(id);
        if (el) el.value = typed[id];
      }
      if (focusKey) {
        var target = followPath(focusKey, root);
        if (target && target.focus) target.focus({ preventScroll: true });
      }
    };
    page._render();
    return page;
  };

  function focusPath(el, root) {
    var path = [];
    while (el && el !== root) {
      path.unshift(Array.prototype.indexOf.call(el.parentNode.children, el));
      el = el.parentNode;
    }
    return path;
  }
  function followPath(path, root) {
    var el = root;
    for (var i = 0; i < path.length && el; i++) el = el.children[path[i]];
    return el;
  }
})();
