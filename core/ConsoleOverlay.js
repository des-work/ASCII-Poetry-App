/**
 * ConsoleOverlay
 * Mirrors console output into a floating on-page panel so logs are visible
 * without opening DevTools. Toggle with Ctrl+~ (or Ctrl+`).
 */
(function () {
    const MAX_BUFFER = 500;
    const STORE_KEY_OPEN = 'consoleOverlay:isOpen';

    let original = {
        log: console.log.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console)
    };

    const state = {
        isOpen: false,
        filter: 'all', // all|info|warn|error
        buffer: []
    };

    // DOM
    let overlay, list, filterAllBtn, filterInfoBtn, filterWarnBtn, filterErrorBtn, clearBtn, closeBtn;

    function now() {
        const d = new Date();
        return [
            d.getHours().toString().padStart(2, '0'),
            d.getMinutes().toString().padStart(2, '0'),
            d.getSeconds().toString().padStart(2, '0')
        ].join(':');
    }

    function createOverlay() {
        overlay = document.createElement('div');
        overlay.id = 'console-overlay';
        overlay.style.cssText = [
            'position:fixed',
            'right:10px',
            'bottom:10px',
            'width:40vw',
            'max-width:720px',
            'height:35vh',
            'min-height:180px',
            'background:rgba(10,10,18,0.92)',
            'color:#e6e6f0',
            'font-family: "JetBrains Mono", monospace',
            'font-size:12px',
            'border:1px solid rgba(102,126,234,0.35)',
            'border-radius:10px',
            'box-shadow:0 12px 32px rgba(0,0,0,0.45)',
            'z-index:999999',
            'display:none',
            'backdrop-filter: blur(6px)'
        ].join(';');

        const toolbar = document.createElement('div');
        toolbar.style.cssText = [
            'display:flex',
            'align-items:center',
            'gap:8px',
            'padding:8px 10px',
            'border-bottom:1px solid rgba(102,126,234,0.2)'
        ].join(';');

        const title = document.createElement('div');
        title.textContent = 'Console Overlay';
        title.style.cssText = 'font-weight:600;opacity:0.9';
        toolbar.appendChild(title);

        const spacer = document.createElement('div');
        spacer.style.cssText = 'flex:1';
        toolbar.appendChild(spacer);

        filterAllBtn = makeBtn('All');
        filterInfoBtn = makeBtn('Info');
        filterWarnBtn = makeBtn('Warn');
        filterErrorBtn = makeBtn('Error');
        clearBtn = makeBtn('Clear');
        closeBtn = makeBtn('✕');

        filterAllBtn.onclick = () => setFilter('all');
        filterInfoBtn.onclick = () => setFilter('info');
        filterWarnBtn.onclick = () => setFilter('warn');
        filterErrorBtn.onclick = () => setFilter('error');
        clearBtn.onclick = () => { state.buffer = []; render(); };
        closeBtn.onclick = () => toggle(false);

        [filterAllBtn, filterInfoBtn, filterWarnBtn, filterErrorBtn, clearBtn, closeBtn]
            .forEach(b => toolbar.appendChild(b));

        list = document.createElement('div');
        list.style.cssText = [
            'height:calc(100% - 44px)',
            'overflow:auto',
            'padding:8px 10px',
            'white-space:pre-wrap'
        ].join(';');

        overlay.appendChild(toolbar);
        overlay.appendChild(list);
        document.body.appendChild(overlay);

        // Floating toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '🐞';
        toggleBtn.title = 'Toggle Console Overlay (Ctrl+~)';
        toggleBtn.style.cssText = [
            'position:fixed',
            'right:10px',
            'bottom:10px',
            'width:38px',
            'height:38px',
            'border-radius:10px',
            'border:1px solid rgba(102,126,234,0.35)',
            'background:linear-gradient(135deg, rgba(18,18,26,0.95) 0%, rgba(26,26,40,0.95) 100%)',
            'color:#e6e6f0',
            'cursor:pointer',
            'z-index:999998'
        ].join(';');
        toggleBtn.onclick = () => toggle();
        document.body.appendChild(toggleBtn);
    }

    function makeBtn(text) {
        const b = document.createElement('button');
        b.textContent = text;
        b.style.cssText = [
            'padding:4px 8px',
            'border-radius:6px',
            'border:1px solid rgba(102,126,234,0.35)',
            'background:rgba(22,22,34,0.9)',
            'color:#e6e6f0',
            'cursor:pointer'
        ].join(';');
        return b;
    }

    function setFilter(level) {
        state.filter = level;
        render();
    }

    function toggle(force) {
        state.isOpen = typeof force === 'boolean' ? force : !state.isOpen;
        try { localStorage.setItem(STORE_KEY_OPEN, String(state.isOpen)); } catch (_) {}
        overlay.style.display = state.isOpen ? 'block' : 'none';
        if (state.isOpen) {
            render();
        }
    }

    function lineToHtml(item) {
        const color = item.level === 'error' ? '#ff6b6b' : item.level === 'warn' ? '#ffd43b' : '#a0b4ff';
        return `<div style="margin:2px 0;line-height:1.35"><span style="opacity:.65">[${item.time}]</span> <span style="color:${color}">[${item.level.toUpperCase()}]</span> ${item.text}</div>`;
    }

    function render() {
        const filtered = state.buffer.filter(it => state.filter === 'all' || it.level === state.filter);
        list.innerHTML = filtered.map(lineToHtml).join('');
        list.scrollTop = list.scrollHeight;
    }

    function push(level, args) {
        let text;
        try {
            text = args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ');
        } catch (_) {
            text = args.map(a => String(a)).join(' ');
        }
        state.buffer.push({ level, text, time: now() });
        if (state.buffer.length > MAX_BUFFER) {
            state.buffer.splice(0, state.buffer.length - MAX_BUFFER);
        }
        if (state.isOpen) render();
    }

    // Patch console
    console.log = function (...args) {
        original.log(...args);
        push('info', args);
    };
    console.info = function (...args) {
        original.info(...args);
        push('info', args);
    };
    console.warn = function (...args) {
        original.warn(...args);
        push('warn', args);
    };
    console.error = function (...args) {
        original.error(...args);
        push('error', args);
    };

    // Global errors
    window.addEventListener('error', (e) => {
        push('error', [e.message || 'Uncaught error', e.filename + ':' + e.lineno]);
    });
    window.addEventListener('unhandledrejection', (e) => {
        push('error', ['Unhandled promise rejection', e.reason && (e.reason.message || String(e.reason))]);
    });

    // Keyboard toggle: Ctrl+~ or Ctrl+`
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === '`' || e.code === 'Backquote')) {
            e.preventDefault();
            toggle();
        }
    });

    // Initialize once DOM is ready
    function init() {
        if (overlay) return;
        try {
            createOverlay();
            const saved = localStorage.getItem(STORE_KEY_OPEN);
            const wantOpen = (saved === 'true') || /[?&]debug=1/.test(location.search);
            if (wantOpen) toggle(true);
            console.info('🧰 ConsoleOverlay ready. Toggle with Ctrl+~.');
        } catch (err) {
            original.error('ConsoleOverlay failed to initialize', err);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API
    window.consoleOverlay = {
        show: () => toggle(true),
        hide: () => toggle(false),
        toggle: () => toggle(),
        setFilter
    };
})();


