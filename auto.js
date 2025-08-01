// Version: 82c3eae
(function(global) {
  const classModuleMap = {
    'fjs-hello': 'helloWorld',
    'fjs-show-modal':'modal',
    'fjs-modal':'modal',
    'fjs-hide-modal':'modal',
    'fjs-auth-needed':'login',
    'fjs-auth-login':'login',
    'fjs-loader':'loading',
    'fjs-settings':'settings',
  };

  function scanModules() {
    const needed = new Set();
    for (const cls in classModuleMap) {
      if (document.querySelector(`.${cls}`)) {
        needed.add(classModuleMap[cls]);
      }
    }
    return [...needed];
  }

  function loadModule(name, callback) {
    const script = document.createElement('script');
    script.src = `https://cdn.jsdelivr.net/gh/hornell/fjs-lib@latest/${name}.js`;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function loadNeededModules(modules, callback) {
    let remaining = modules.length;
    if (remaining === 0) return callback?.();
    modules.forEach(name => {
      loadModule(name, () => {
        if (--remaining === 0) callback?.();
      });
    });
  }

  function autoInit() {
    const modules = scanModules();
    loadNeededModules(modules, () =>{document.dispatchEvent(new Event("fjs:ready"));});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  global.fjs = global.fjs || {};
  global.fjs.Auto = { scanModules, loadNeededModules };
})(window);
