
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Header.svelte generated by Svelte v3.59.2 */

    const file$5 = "src\\components\\Header.svelte";

    function create_fragment$5(ctx) {
    	let header;
    	let img;
    	let img_src_value;
    	let t0;
    	let h1;
    	let t1;

    	const block = {
    		c: function create() {
    			header = element("header");
    			img = element("img");
    			t0 = space();
    			h1 = element("h1");
    			t1 = text(/*title*/ ctx[0]);
    			if (!src_url_equal(img.src, img_src_value = "icon_app.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Savings Planner Logo");
    			attr_dev(img, "class", "app-logo svelte-b0zm2n");
    			add_location(img, file$5, 5, 2, 95);
    			attr_dev(h1, "class", "app-title svelte-b0zm2n");
    			add_location(h1, file$5, 6, 2, 169);
    			attr_dev(header, "class", "app-header svelte-b0zm2n");
    			add_location(header, file$5, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, img);
    			append_dev(header, t0);
    			append_dev(header, h1);
    			append_dev(h1, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let { title = "Savings Planner" } = $$props;
    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({ title });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get title() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Downloads.svelte generated by Svelte v3.59.2 */

    const file$4 = "src\\components\\Downloads.svelte";

    function create_fragment$4(ctx) {
    	let section;
    	let div;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let p0;
    	let t2;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t3;
    	let p1;
    	let t5;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let t6;
    	let p2;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = space();
    			p0 = element("p");

    			p0.textContent = `${/*googlePlayRating*/ ctx[0] !== null
			? `Rating: ${/*googlePlayRating*/ ctx[0]}/5`
			: "Not available"}`;

    			t2 = space();
    			a1 = element("a");
    			img1 = element("img");
    			t3 = space();
    			p1 = element("p");

    			p1.textContent = `${/*appStoreRating*/ ctx[1] !== null
			? `Rating: ${/*appStoreRating*/ ctx[1]}/5`
			: "Not available"}`;

    			t5 = space();
    			a2 = element("a");
    			img2 = element("img");
    			t6 = space();
    			p2 = element("p");

    			p2.textContent = `${/*amazonStoreRating*/ ctx[2] !== null
			? `Rating: ${/*amazonStoreRating*/ ctx[2]}/5`
			: "Not available"}`;

    			if (!src_url_equal(img0.src, img0_src_value = "google-play-badge.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Google Play Store");
    			attr_dev(img0, "class", "svelte-11gf09f");
    			toggle_class(img0, "grayed-out", /*googlePlayRating*/ ctx[0] === null);
    			add_location(img0, file$4, 13, 6, 314);
    			add_location(p0, file$4, 18, 6, 460);
    			attr_dev(a0, "class", "store-link svelte-11gf09f");
    			attr_dev(a0, "href", "https://play.google.com/store/apps/details?id=com.fsa.planification_epargne");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$4, 8, 4, 158);
    			if (!src_url_equal(img1.src, img1_src_value = "app-store-badge.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Apple App Store");
    			attr_dev(img1, "class", "svelte-11gf09f");
    			toggle_class(img1, "grayed-out", /*appStoreRating*/ ctx[1] === null);
    			add_location(img1, file$4, 29, 6, 738);
    			add_location(p1, file$4, 34, 6, 878);
    			attr_dev(a1, "class", "store-link svelte-11gf09f");
    			attr_dev(a1, "href", "https://apps.apple.com/app/savings-planner/id1234567890");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$4, 24, 4, 602);
    			if (!src_url_equal(img2.src, img2_src_value = "amazon-store-badge.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Amazon Store");
    			attr_dev(img2, "class", "svelte-11gf09f");
    			toggle_class(img2, "grayed-out", /*amazonStoreRating*/ ctx[2] === null);
    			add_location(img2, file$4, 45, 6, 1169);
    			add_location(p2, file$4, 50, 6, 1312);
    			attr_dev(a2, "class", "store-link svelte-11gf09f");
    			attr_dev(a2, "href", "https://www.amazon.com/gp/mas/dl/android?p=com.fsa.planification_epargne");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$4, 40, 4, 1016);
    			attr_dev(div, "class", "store-links svelte-11gf09f");
    			add_location(div, file$4, 7, 2, 127);
    			add_location(section, file$4, 6, 0, 114);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			append_dev(div, a0);
    			append_dev(a0, img0);
    			append_dev(a0, t0);
    			append_dev(a0, p0);
    			append_dev(div, t2);
    			append_dev(div, a1);
    			append_dev(a1, img1);
    			append_dev(a1, t3);
    			append_dev(a1, p1);
    			append_dev(div, t5);
    			append_dev(div, a2);
    			append_dev(a2, img2);
    			append_dev(a2, t6);
    			append_dev(a2, p2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Downloads', slots, []);
    	let googlePlayRating = "?";
    	let appStoreRating = null;
    	let amazonStoreRating = 5;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Downloads> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		googlePlayRating,
    		appStoreRating,
    		amazonStoreRating
    	});

    	$$self.$inject_state = $$props => {
    		if ('googlePlayRating' in $$props) $$invalidate(0, googlePlayRating = $$props.googlePlayRating);
    		if ('appStoreRating' in $$props) $$invalidate(1, appStoreRating = $$props.appStoreRating);
    		if ('amazonStoreRating' in $$props) $$invalidate(2, amazonStoreRating = $$props.amazonStoreRating);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [googlePlayRating, appStoreRating, amazonStoreRating];
    }

    class Downloads extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Downloads",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\Legal.svelte generated by Svelte v3.59.2 */

    const file$3 = "src\\components\\Legal.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let section0;
    	let h20;
    	let t3;
    	let p0;
    	let t5;
    	let section1;
    	let h21;
    	let t7;
    	let p1;
    	let t9;
    	let section2;
    	let h22;
    	let t11;
    	let p2;
    	let t13;
    	let p3;
    	let t14;
    	let a;
    	let t15;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Legal Disclaimer";
    			t1 = space();
    			section0 = element("section");
    			h20 = element("h2");
    			h20.textContent = "General";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "The Savings Planner application (\"App\") is provided \"as is\" without any\r\n      warranties of any kind, express or implied. The App does not collect or\r\n      store any personal data directly. However, it uses third-party services\r\n      such as AdMob for advertising, which may collect and use personal data as\r\n      described in their privacy policies.";
    			t5 = space();
    			section1 = element("section");
    			h21 = element("h2");
    			h21.textContent = "Limitation of Liability";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "In no event shall Savings Planner or its developers be liable for any\r\n      damages, including but not limited to, direct, indirect, incidental,\r\n      special, consequential, or punitive damages, arising out of the use of or\r\n      inability to use the App, even if Savings Planner has been advised of the\r\n      possibility of such damages.";
    			t9 = space();
    			section2 = element("section");
    			h22 = element("h2");
    			h22.textContent = "Contact Information";
    			t11 = space();
    			p2 = element("p");
    			p2.textContent = "If you have any questions about these terms and conditions, please contact\r\n      us at:";
    			t13 = space();
    			p3 = element("p");
    			t14 = text("Email: ");
    			a = element("a");
    			t15 = text(/*contactEmail*/ ctx[0]);
    			attr_dev(h1, "class", "svelte-1wey1xi");
    			add_location(h1, file$3, 5, 2, 115);
    			attr_dev(h20, "class", "svelte-1wey1xi");
    			add_location(h20, file$3, 8, 4, 161);
    			attr_dev(p0, "class", "svelte-1wey1xi");
    			add_location(p0, file$3, 9, 4, 183);
    			add_location(section0, file$3, 7, 2, 146);
    			attr_dev(h21, "class", "svelte-1wey1xi");
    			add_location(h21, file$3, 19, 4, 593);
    			attr_dev(p1, "class", "svelte-1wey1xi");
    			add_location(p1, file$3, 20, 4, 631);
    			add_location(section1, file$3, 18, 2, 578);
    			attr_dev(h22, "class", "svelte-1wey1xi");
    			add_location(h22, file$3, 30, 4, 1030);
    			attr_dev(p2, "class", "svelte-1wey1xi");
    			add_location(p2, file$3, 31, 4, 1064);
    			attr_dev(a, "href", "mailto:" + /*contactEmail*/ ctx[0]);
    			attr_dev(a, "class", "svelte-1wey1xi");
    			add_location(a, file$3, 35, 14, 1189);
    			attr_dev(p3, "class", "svelte-1wey1xi");
    			add_location(p3, file$3, 35, 4, 1179);
    			add_location(section2, file$3, 29, 2, 1015);
    			attr_dev(div, "class", "legal-disclaimer svelte-1wey1xi");
    			add_location(div, file$3, 4, 0, 81);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, section0);
    			append_dev(section0, h20);
    			append_dev(section0, t3);
    			append_dev(section0, p0);
    			append_dev(div, t5);
    			append_dev(div, section1);
    			append_dev(section1, h21);
    			append_dev(section1, t7);
    			append_dev(section1, p1);
    			append_dev(div, t9);
    			append_dev(div, section2);
    			append_dev(section2, h22);
    			append_dev(section2, t11);
    			append_dev(section2, p2);
    			append_dev(section2, t13);
    			append_dev(section2, p3);
    			append_dev(p3, t14);
    			append_dev(p3, a);
    			append_dev(a, t15);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Legal', slots, []);
    	let contactEmail = "appflutter.development@gmail.com";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Legal> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ contactEmail });

    	$$self.$inject_state = $$props => {
    		if ('contactEmail' in $$props) $$invalidate(0, contactEmail = $$props.contactEmail);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [contactEmail];
    }

    class Legal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Legal",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\PrivacyPolicy.svelte generated by Svelte v3.59.2 */

    const file$2 = "src\\components\\PrivacyPolicy.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let section0;
    	let h20;
    	let t3;
    	let p0;
    	let t5;
    	let section1;
    	let h21;
    	let t7;
    	let p1;
    	let t9;
    	let section2;
    	let h22;
    	let t11;
    	let p2;
    	let t13;
    	let ul0;
    	let li0;
    	let t15;
    	let li1;
    	let t17;
    	let li2;
    	let t19;
    	let p3;
    	let t20;
    	let a0;
    	let t22;
    	let t23;
    	let section3;
    	let h23;
    	let t25;
    	let p4;
    	let t27;
    	let ul1;
    	let li3;
    	let t29;
    	let li4;
    	let t31;
    	let li5;
    	let t33;
    	let li6;
    	let t35;
    	let li7;
    	let t37;
    	let p5;
    	let t38;
    	let a1;
    	let t40;
    	let t41;
    	let section4;
    	let h24;
    	let t43;
    	let p6;
    	let t45;
    	let section5;
    	let h25;
    	let t47;
    	let p7;
    	let t49;
    	let section6;
    	let h26;
    	let t51;
    	let p8;
    	let t53;
    	let section7;
    	let h27;
    	let t55;
    	let p9;
    	let t57;
    	let p10;
    	let t58;
    	let a2;
    	let t59;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Privacy Policy";
    			t1 = space();
    			section0 = element("section");
    			h20 = element("h2");
    			h20.textContent = "Introduction";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Welcome to the Savings Planner application (the \"App\"). This Privacy\r\n      Policy is designed to inform you about how we collect, use, and protect\r\n      your information when you use our App.";
    			t5 = space();
    			section1 = element("section");
    			h21 = element("h2");
    			h21.textContent = "Information We Collect";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "The App itself does not collect any personal data. However, we use AdMob\r\n      by Google for personalized advertisements, which may collect and use your\r\n      data. Please refer to AdMob's privacy policy for more information on the\r\n      data they collect and how it is used.";
    			t9 = space();
    			section2 = element("section");
    			h22 = element("h2");
    			h22.textContent = "How AdMob Uses Your Data";
    			t11 = space();
    			p2 = element("p");
    			p2.textContent = "AdMob may collect and use data to show personalized ads. This includes,\r\n      but is not limited to:";
    			t13 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Device information (e.g., model, OS, unique identifiers)";
    			t15 = space();
    			li1 = element("li");
    			li1.textContent = "IP address";
    			t17 = space();
    			li2 = element("li");
    			li2.textContent = "Usage data and metrics";
    			t19 = space();
    			p3 = element("p");
    			t20 = text("For detailed information on AdMob’s data collection and processing\r\n      practices, please review the ");
    			a0 = element("a");
    			a0.textContent = "AdMob Privacy Policy";
    			t22 = text(".");
    			t23 = space();
    			section3 = element("section");
    			h23 = element("h2");
    			h23.textContent = "GDPR Compliance";
    			t25 = space();
    			p4 = element("p");
    			p4.textContent = "If you are located in the European Economic Area (EEA), you have certain\r\n      rights under the General Data Protection Regulation (GDPR). These rights\r\n      include:";
    			t27 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			li3.textContent = "The right to access the data AdMob has about you";
    			t29 = space();
    			li4 = element("li");
    			li4.textContent = "The right to rectify any incorrect data";
    			t31 = space();
    			li5 = element("li");
    			li5.textContent = "The right to erase your data";
    			t33 = space();
    			li6 = element("li");
    			li6.textContent = "The right to restrict or object to the processing of your data";
    			t35 = space();
    			li7 = element("li");
    			li7.textContent = "The right to data portability";
    			t37 = space();
    			p5 = element("p");
    			t38 = text("You can exercise these rights by contacting Google directly. For more\r\n      information on your rights under GDPR, please refer to the ");
    			a1 = element("a");
    			a1.textContent = "GDPR Information Portal";
    			t40 = text(".");
    			t41 = space();
    			section4 = element("section");
    			h24 = element("h2");
    			h24.textContent = "Consent to Personalized Ads";
    			t43 = space();
    			p6 = element("p");
    			p6.textContent = "When you use our App, you may be asked to provide consent for personalized\r\n      ads. You can manage your ad preferences or withdraw your consent at any\r\n      time through the settings on your device or by following the instructions\r\n      provided by AdMob.";
    			t45 = space();
    			section5 = element("section");
    			h25 = element("h2");
    			h25.textContent = "Data Security";
    			t47 = space();
    			p7 = element("p");
    			p7.textContent = "We are committed to ensuring that your information is secure. Although we\r\n      do not collect personal data directly, we ensure that our third-party\r\n      partners, such as AdMob, use reasonable measures to protect your data.";
    			t49 = space();
    			section6 = element("section");
    			h26 = element("h2");
    			h26.textContent = "Changes to This Privacy Policy";
    			t51 = space();
    			p8 = element("p");
    			p8.textContent = "We may update this Privacy Policy from time to time. Any changes will be\r\n      posted within the App and will take effect immediately upon posting.";
    			t53 = space();
    			section7 = element("section");
    			h27 = element("h2");
    			h27.textContent = "Contact Us";
    			t55 = space();
    			p9 = element("p");
    			p9.textContent = "If you have any questions or concerns about this Privacy Policy, please\r\n      contact us at:";
    			t57 = space();
    			p10 = element("p");
    			t58 = text("Email: ");
    			a2 = element("a");
    			t59 = text(/*contactEmail*/ ctx[0]);
    			attr_dev(h1, "class", "svelte-1edafen");
    			add_location(h1, file$2, 5, 2, 113);
    			attr_dev(h20, "class", "svelte-1edafen");
    			add_location(h20, file$2, 8, 4, 157);
    			attr_dev(p0, "class", "svelte-1edafen");
    			add_location(p0, file$2, 9, 4, 184);
    			add_location(section0, file$2, 7, 2, 142);
    			attr_dev(h21, "class", "svelte-1edafen");
    			add_location(h21, file$2, 17, 4, 433);
    			attr_dev(p1, "class", "svelte-1edafen");
    			add_location(p1, file$2, 18, 4, 470);
    			add_location(section1, file$2, 16, 2, 418);
    			attr_dev(h22, "class", "svelte-1edafen");
    			add_location(h22, file$2, 27, 4, 804);
    			attr_dev(p2, "class", "svelte-1edafen");
    			add_location(p2, file$2, 28, 4, 843);
    			add_location(li0, file$2, 33, 6, 983);
    			add_location(li1, file$2, 34, 6, 1056);
    			add_location(li2, file$2, 35, 6, 1083);
    			attr_dev(ul0, "class", "svelte-1edafen");
    			add_location(ul0, file$2, 32, 4, 971);
    			attr_dev(a0, "href", "https://policies.google.com/technologies/ads");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-1edafen");
    			add_location(a0, file$2, 39, 35, 1245);
    			attr_dev(p3, "class", "svelte-1edafen");
    			add_location(p3, file$2, 37, 4, 1131);
    			add_location(section2, file$2, 26, 2, 789);
    			attr_dev(h23, "class", "svelte-1edafen");
    			add_location(h23, file$2, 47, 4, 1412);
    			attr_dev(p4, "class", "svelte-1edafen");
    			add_location(p4, file$2, 48, 4, 1442);
    			add_location(li3, file$2, 54, 6, 1649);
    			add_location(li4, file$2, 55, 6, 1714);
    			add_location(li5, file$2, 56, 6, 1770);
    			add_location(li6, file$2, 57, 6, 1815);
    			add_location(li7, file$2, 58, 6, 1894);
    			attr_dev(ul1, "class", "svelte-1edafen");
    			add_location(ul1, file$2, 53, 4, 1637);
    			attr_dev(a1, "href", "https://gdpr-info.eu/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-1edafen");
    			add_location(a1, file$2, 62, 65, 2096);
    			attr_dev(p5, "class", "svelte-1edafen");
    			add_location(p5, file$2, 60, 4, 1949);
    			add_location(section3, file$2, 46, 2, 1397);
    			attr_dev(h24, "class", "svelte-1edafen");
    			add_location(h24, file$2, 70, 4, 2243);
    			attr_dev(p6, "class", "svelte-1edafen");
    			add_location(p6, file$2, 71, 4, 2285);
    			add_location(section4, file$2, 69, 2, 2228);
    			attr_dev(h25, "class", "svelte-1edafen");
    			add_location(h25, file$2, 80, 4, 2601);
    			attr_dev(p7, "class", "svelte-1edafen");
    			add_location(p7, file$2, 81, 4, 2629);
    			add_location(section5, file$2, 79, 2, 2586);
    			attr_dev(h26, "class", "svelte-1edafen");
    			add_location(h26, file$2, 89, 4, 2913);
    			attr_dev(p8, "class", "svelte-1edafen");
    			add_location(p8, file$2, 90, 4, 2958);
    			add_location(section6, file$2, 88, 2, 2898);
    			attr_dev(h27, "class", "svelte-1edafen");
    			add_location(h27, file$2, 97, 4, 3162);
    			attr_dev(p9, "class", "svelte-1edafen");
    			add_location(p9, file$2, 98, 4, 3187);
    			attr_dev(a2, "href", `mailto:${/*contactEmail*/ ctx[0]}`);
    			attr_dev(a2, "class", "svelte-1edafen");
    			add_location(a2, file$2, 102, 14, 3317);
    			attr_dev(p10, "class", "svelte-1edafen");
    			add_location(p10, file$2, 102, 4, 3307);
    			add_location(section7, file$2, 96, 2, 3147);
    			attr_dev(div, "class", "privacy-policy svelte-1edafen");
    			add_location(div, file$2, 4, 0, 81);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, section0);
    			append_dev(section0, h20);
    			append_dev(section0, t3);
    			append_dev(section0, p0);
    			append_dev(div, t5);
    			append_dev(div, section1);
    			append_dev(section1, h21);
    			append_dev(section1, t7);
    			append_dev(section1, p1);
    			append_dev(div, t9);
    			append_dev(div, section2);
    			append_dev(section2, h22);
    			append_dev(section2, t11);
    			append_dev(section2, p2);
    			append_dev(section2, t13);
    			append_dev(section2, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t15);
    			append_dev(ul0, li1);
    			append_dev(ul0, t17);
    			append_dev(ul0, li2);
    			append_dev(section2, t19);
    			append_dev(section2, p3);
    			append_dev(p3, t20);
    			append_dev(p3, a0);
    			append_dev(p3, t22);
    			append_dev(div, t23);
    			append_dev(div, section3);
    			append_dev(section3, h23);
    			append_dev(section3, t25);
    			append_dev(section3, p4);
    			append_dev(section3, t27);
    			append_dev(section3, ul1);
    			append_dev(ul1, li3);
    			append_dev(ul1, t29);
    			append_dev(ul1, li4);
    			append_dev(ul1, t31);
    			append_dev(ul1, li5);
    			append_dev(ul1, t33);
    			append_dev(ul1, li6);
    			append_dev(ul1, t35);
    			append_dev(ul1, li7);
    			append_dev(section3, t37);
    			append_dev(section3, p5);
    			append_dev(p5, t38);
    			append_dev(p5, a1);
    			append_dev(p5, t40);
    			append_dev(div, t41);
    			append_dev(div, section4);
    			append_dev(section4, h24);
    			append_dev(section4, t43);
    			append_dev(section4, p6);
    			append_dev(div, t45);
    			append_dev(div, section5);
    			append_dev(section5, h25);
    			append_dev(section5, t47);
    			append_dev(section5, p7);
    			append_dev(div, t49);
    			append_dev(div, section6);
    			append_dev(section6, h26);
    			append_dev(section6, t51);
    			append_dev(section6, p8);
    			append_dev(div, t53);
    			append_dev(div, section7);
    			append_dev(section7, h27);
    			append_dev(section7, t55);
    			append_dev(section7, p9);
    			append_dev(section7, t57);
    			append_dev(section7, p10);
    			append_dev(p10, t58);
    			append_dev(p10, a2);
    			append_dev(a2, t59);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PrivacyPolicy', slots, []);
    	let contactEmail = "savingsplanner.contact@gmail.com";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PrivacyPolicy> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ contactEmail });

    	$$self.$inject_state = $$props => {
    		if ('contactEmail' in $$props) $$invalidate(0, contactEmail = $$props.contactEmail);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [contactEmail];
    }

    class PrivacyPolicy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PrivacyPolicy",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\GdprNotice.svelte generated by Svelte v3.59.2 */

    const file$1 = "src\\components\\GdprNotice.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let section0;
    	let h20;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let a0;
    	let t6;
    	let t7;
    	let section1;
    	let h21;
    	let t9;
    	let p2;
    	let t11;
    	let section2;
    	let h22;
    	let t13;
    	let p3;
    	let t15;
    	let ul;
    	let li0;
    	let t17;
    	let li1;
    	let t19;
    	let li2;
    	let t21;
    	let li3;
    	let t23;
    	let li4;
    	let t25;
    	let li5;
    	let t27;
    	let p4;
    	let t29;
    	let section3;
    	let h23;
    	let t31;
    	let p5;
    	let t33;
    	let p6;
    	let a1;
    	let t34;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "GDPR Notice";
    			t1 = space();
    			section0 = element("section");
    			h20 = element("h2");
    			h20.textContent = "Data Controller";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Savings Planner does not collect or process personal data directly. The\r\n      data controller for the personalized ads shown in the App is AdMob by\r\n      Google. Please refer to AdMob’s privacy policy for information on their\r\n      data processing practices.";
    			t5 = space();
    			p1 = element("p");
    			a0 = element("a");
    			t6 = text("AdMob Privacy Policy");
    			t7 = space();
    			section1 = element("section");
    			h21 = element("h2");
    			h21.textContent = "Legal Basis for Processing";
    			t9 = space();
    			p2 = element("p");
    			p2.textContent = "The legal basis for processing your data for personalized ads is your\r\n      consent. You can withdraw your consent at any time by adjusting your ad\r\n      settings or contacting AdMob directly.";
    			t11 = space();
    			section2 = element("section");
    			h22 = element("h2");
    			h22.textContent = "Data Subject Rights";
    			t13 = space();
    			p3 = element("p");
    			p3.textContent = "Under GDPR, you have the following rights regarding your data:";
    			t15 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Right to access";
    			t17 = space();
    			li1 = element("li");
    			li1.textContent = "Right to rectification";
    			t19 = space();
    			li2 = element("li");
    			li2.textContent = "Right to erasure";
    			t21 = space();
    			li3 = element("li");
    			li3.textContent = "Right to restrict processing";
    			t23 = space();
    			li4 = element("li");
    			li4.textContent = "Right to data portability";
    			t25 = space();
    			li5 = element("li");
    			li5.textContent = "Right to object";
    			t27 = space();
    			p4 = element("p");
    			p4.textContent = "To exercise these rights, please contact AdMob as detailed in their\r\n      privacy policy.";
    			t29 = space();
    			section3 = element("section");
    			h23 = element("h2");
    			h23.textContent = "Complaints";
    			t31 = space();
    			p5 = element("p");
    			p5.textContent = "If you believe your data protection rights have been violated, you have\r\n      the right to lodge a complaint with a supervisory authority in your\r\n      country of residence.";
    			t33 = space();
    			p6 = element("p");
    			a1 = element("a");
    			t34 = text("GDPR Information Portal");
    			attr_dev(h1, "class", "svelte-1qv37xu");
    			add_location(h1, file$1, 6, 2, 174);
    			attr_dev(h20, "class", "svelte-1qv37xu");
    			add_location(h20, file$1, 9, 4, 215);
    			attr_dev(p0, "class", "svelte-1qv37xu");
    			add_location(p0, file$1, 10, 4, 245);
    			attr_dev(a0, "href", /*admobPrivacyPolicyUrl*/ ctx[0]);
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-1qv37xu");
    			add_location(a0, file$1, 17, 6, 544);
    			attr_dev(p1, "class", "svelte-1qv37xu");
    			add_location(p1, file$1, 16, 4, 533);
    			add_location(section0, file$1, 8, 2, 200);
    			attr_dev(h21, "class", "svelte-1qv37xu");
    			add_location(h21, file$1, 22, 4, 661);
    			attr_dev(p2, "class", "svelte-1qv37xu");
    			add_location(p2, file$1, 23, 4, 702);
    			add_location(section1, file$1, 21, 2, 646);
    			attr_dev(h22, "class", "svelte-1qv37xu");
    			add_location(h22, file$1, 31, 4, 952);
    			attr_dev(p3, "class", "svelte-1qv37xu");
    			add_location(p3, file$1, 32, 4, 986);
    			add_location(li0, file$1, 34, 6, 1073);
    			add_location(li1, file$1, 35, 6, 1105);
    			add_location(li2, file$1, 36, 6, 1144);
    			add_location(li3, file$1, 37, 6, 1177);
    			add_location(li4, file$1, 38, 6, 1222);
    			add_location(li5, file$1, 39, 6, 1264);
    			attr_dev(ul, "class", "svelte-1qv37xu");
    			add_location(ul, file$1, 33, 4, 1061);
    			attr_dev(p4, "class", "svelte-1qv37xu");
    			add_location(p4, file$1, 41, 4, 1305);
    			add_location(section2, file$1, 30, 2, 937);
    			attr_dev(h23, "class", "svelte-1qv37xu");
    			add_location(h23, file$1, 48, 4, 1451);
    			attr_dev(p5, "class", "svelte-1qv37xu");
    			add_location(p5, file$1, 49, 4, 1476);
    			attr_dev(a1, "href", /*gdprInfoPortalUrl*/ ctx[1]);
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-1qv37xu");
    			add_location(a1, file$1, 55, 6, 1689);
    			attr_dev(p6, "class", "svelte-1qv37xu");
    			add_location(p6, file$1, 54, 4, 1678);
    			add_location(section3, file$1, 47, 2, 1436);
    			attr_dev(div, "class", "gdpr-notice svelte-1qv37xu");
    			add_location(div, file$1, 5, 0, 145);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, section0);
    			append_dev(section0, h20);
    			append_dev(section0, t3);
    			append_dev(section0, p0);
    			append_dev(section0, t5);
    			append_dev(section0, p1);
    			append_dev(p1, a0);
    			append_dev(a0, t6);
    			append_dev(div, t7);
    			append_dev(div, section1);
    			append_dev(section1, h21);
    			append_dev(section1, t9);
    			append_dev(section1, p2);
    			append_dev(div, t11);
    			append_dev(div, section2);
    			append_dev(section2, h22);
    			append_dev(section2, t13);
    			append_dev(section2, p3);
    			append_dev(section2, t15);
    			append_dev(section2, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t17);
    			append_dev(ul, li1);
    			append_dev(ul, t19);
    			append_dev(ul, li2);
    			append_dev(ul, t21);
    			append_dev(ul, li3);
    			append_dev(ul, t23);
    			append_dev(ul, li4);
    			append_dev(ul, t25);
    			append_dev(ul, li5);
    			append_dev(section2, t27);
    			append_dev(section2, p4);
    			append_dev(div, t29);
    			append_dev(div, section3);
    			append_dev(section3, h23);
    			append_dev(section3, t31);
    			append_dev(section3, p5);
    			append_dev(section3, t33);
    			append_dev(section3, p6);
    			append_dev(p6, a1);
    			append_dev(a1, t34);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GdprNotice', slots, []);
    	let admobPrivacyPolicyUrl = "https://policies.google.com/privacy";
    	let gdprInfoPortalUrl = "https://gdpr-info.eu/";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GdprNotice> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ admobPrivacyPolicyUrl, gdprInfoPortalUrl });

    	$$self.$inject_state = $$props => {
    		if ('admobPrivacyPolicyUrl' in $$props) $$invalidate(0, admobPrivacyPolicyUrl = $$props.admobPrivacyPolicyUrl);
    		if ('gdprInfoPortalUrl' in $$props) $$invalidate(1, gdprInfoPortalUrl = $$props.gdprInfoPortalUrl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [admobPrivacyPolicyUrl, gdprInfoPortalUrl];
    }

    class GdprNotice extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GdprNotice",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main;
    	let section;
    	let h2;
    	let t2;
    	let div0;
    	let h30;
    	let t4;
    	let div1;
    	let p0;
    	let t6;
    	let p1;
    	let t8;
    	let div2;
    	let p2;
    	let t10;
    	let p3;
    	let t12;
    	let p4;
    	let t14;
    	let p5;
    	let t16;
    	let p6;
    	let t18;
    	let div3;
    	let h31;
    	let t20;
    	let ul;
    	let li0;
    	let t22;
    	let li1;
    	let t24;
    	let li2;
    	let t26;
    	let li3;
    	let t28;
    	let li4;
    	let t30;
    	let downloads;
    	let t31;
    	let privacypolicy;
    	let t32;
    	let gdprnotice;
    	let t33;
    	let legal;
    	let current;
    	header = new Header({ $$inline: true });
    	downloads = new Downloads({ $$inline: true });
    	privacypolicy = new PrivacyPolicy({ $$inline: true });
    	gdprnotice = new GdprNotice({ $$inline: true });
    	legal = new Legal({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			section = element("section");
    			h2 = element("h2");
    			h2.textContent = "Savings Planner";
    			t2 = space();
    			div0 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Manage and optimize your wealth with our mobile investment planning app.";
    			t4 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Discover our mobile investment planning application, an essential tool\n        for managing and optimizing your wealth. With this application, you can\n        define different investment accounts, each with its initial amount and\n        performance. You have the ability to plan the distribution of your\n        monthly savings across these accounts, allowing you to diversify your\n        investments and minimize risks.";
    			t6 = space();
    			p1 = element("p");
    			p1.textContent = "But that’s not all, our application also offers a multi-year projection\n        feature. This allows you to evaluate your future wealth and make\n        informed decisions. Start planning your financial future today with our\n        investment planning application.";
    			t8 = space();
    			div2 = element("div");
    			p2 = element("p");
    			p2.textContent = "Introducing our mobile investment planning application, an essential\n        tool for anyone looking to manage and optimize their wealth in an\n        efficient and intuitive manner. This application has been designed with\n        the user in mind, offering a user-friendly interface that is easy to\n        navigate.";
    			t10 = space();
    			p3 = element("p");
    			p3.textContent = "With this application, you can define different investment accounts,\n        each with its initial amount and performance. This gives you a clear\n        overview of your investments and allows you to track their progress over\n        time. You can also add new accounts at any time, offering you the\n        flexibility needed to adapt your portfolio to your changing financial\n        goals.";
    			t12 = space();
    			p4 = element("p");
    			p4.textContent = "One of the key features of our application is the ability to plan the\n        distribution of your monthly savings across these accounts. This means\n        you can decide how much you want to invest in each account each month,\n        allowing you to diversify your investments and minimize risks. This\n        feature is particularly useful for those looking to balance their\n        portfolio and avoid putting all their eggs in one basket.";
    			t14 = space();
    			p5 = element("p");
    			p5.textContent = "But that’s not all, our application also offers a multi-year projection\n        feature. This allows you to evaluate your future wealth based on your\n        current investments and your monthly savings plan. You can see how your\n        wealth could evolve over time, giving you a clear idea of what you can\n        expect in the future. This feature can be a valuable tool for long-term\n        planning and can help you make informed decisions on how to manage your\n        money.";
    			t16 = space();
    			p6 = element("p");
    			p6.textContent = "Start planning your financial future today with our investment planning\n        application. Download it now and take control of your financial future.";
    			t18 = space();
    			div3 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Features";
    			t20 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Definition of different investment accounts with initial amount and\n          performance.";
    			t22 = space();
    			li1 = element("li");
    			li1.textContent = "Planning of the distribution of monthly savings across different\n          accounts.";
    			t24 = space();
    			li2 = element("li");
    			li2.textContent = "Diversification of investments to minimize risks.";
    			t26 = space();
    			li3 = element("li");
    			li3.textContent = "Multi-year projection feature to evaluate future wealth.";
    			t28 = space();
    			li4 = element("li");
    			li4.textContent = "User-friendly and easy-to-navigate interface.";
    			t30 = space();
    			create_component(downloads.$$.fragment);
    			t31 = space();
    			create_component(privacypolicy.$$.fragment);
    			t32 = space();
    			create_component(gdprnotice.$$.fragment);
    			t33 = space();
    			create_component(legal.$$.fragment);
    			attr_dev(h2, "class", "svelte-1r1kfku");
    			add_location(h2, file, 12, 4, 381);
    			attr_dev(h30, "class", "svelte-1r1kfku");
    			add_location(h30, file, 14, 6, 448);
    			attr_dev(div0, "class", "short-description svelte-1r1kfku");
    			add_location(div0, file, 13, 4, 410);
    			attr_dev(p0, "class", "svelte-1r1kfku");
    			add_location(p0, file, 19, 6, 602);
    			attr_dev(p1, "class", "svelte-1r1kfku");
    			add_location(p1, file, 27, 6, 1054);
    			attr_dev(div1, "class", "detailed-description svelte-1r1kfku");
    			add_location(div1, file, 18, 4, 561);
    			attr_dev(p2, "class", "svelte-1r1kfku");
    			add_location(p2, file, 35, 6, 1399);
    			attr_dev(p3, "class", "svelte-1r1kfku");
    			add_location(p3, file, 42, 6, 1746);
    			attr_dev(p4, "class", "svelte-1r1kfku");
    			add_location(p4, file, 50, 6, 2169);
    			attr_dev(p5, "class", "svelte-1r1kfku");
    			add_location(p5, file, 58, 6, 2642);
    			attr_dev(p6, "class", "svelte-1r1kfku");
    			add_location(p6, file, 67, 6, 3155);
    			attr_dev(div2, "class", "detailed-description svelte-1r1kfku");
    			add_location(div2, file, 34, 4, 1358);
    			attr_dev(h31, "class", "svelte-1r1kfku");
    			add_location(h31, file, 73, 6, 3374);
    			attr_dev(li0, "class", "svelte-1r1kfku");
    			add_location(li0, file, 75, 8, 3411);
    			attr_dev(li1, "class", "svelte-1r1kfku");
    			add_location(li1, file, 79, 8, 3539);
    			attr_dev(li2, "class", "svelte-1r1kfku");
    			add_location(li2, file, 83, 8, 3661);
    			attr_dev(li3, "class", "svelte-1r1kfku");
    			add_location(li3, file, 84, 8, 3728);
    			attr_dev(li4, "class", "svelte-1r1kfku");
    			add_location(li4, file, 85, 8, 3802);
    			attr_dev(ul, "class", "svelte-1r1kfku");
    			add_location(ul, file, 74, 6, 3398);
    			attr_dev(div3, "class", "features svelte-1r1kfku");
    			add_location(div3, file, 72, 4, 3345);
    			attr_dev(section, "class", "about svelte-1r1kfku");
    			add_location(section, file, 11, 2, 353);
    			add_location(main, file, 10, 0, 344);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, section);
    			append_dev(section, h2);
    			append_dev(section, t2);
    			append_dev(section, div0);
    			append_dev(div0, h30);
    			append_dev(section, t4);
    			append_dev(section, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t6);
    			append_dev(div1, p1);
    			append_dev(section, t8);
    			append_dev(section, div2);
    			append_dev(div2, p2);
    			append_dev(div2, t10);
    			append_dev(div2, p3);
    			append_dev(div2, t12);
    			append_dev(div2, p4);
    			append_dev(div2, t14);
    			append_dev(div2, p5);
    			append_dev(div2, t16);
    			append_dev(div2, p6);
    			append_dev(section, t18);
    			append_dev(section, div3);
    			append_dev(div3, h31);
    			append_dev(div3, t20);
    			append_dev(div3, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t22);
    			append_dev(ul, li1);
    			append_dev(ul, t24);
    			append_dev(ul, li2);
    			append_dev(ul, t26);
    			append_dev(ul, li3);
    			append_dev(ul, t28);
    			append_dev(ul, li4);
    			append_dev(main, t30);
    			mount_component(downloads, main, null);
    			append_dev(main, t31);
    			mount_component(privacypolicy, main, null);
    			append_dev(main, t32);
    			mount_component(gdprnotice, main, null);
    			append_dev(main, t33);
    			mount_component(legal, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(downloads.$$.fragment, local);
    			transition_in(privacypolicy.$$.fragment, local);
    			transition_in(gdprnotice.$$.fragment, local);
    			transition_in(legal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(downloads.$$.fragment, local);
    			transition_out(privacypolicy.$$.fragment, local);
    			transition_out(gdprnotice.$$.fragment, local);
    			transition_out(legal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(downloads);
    			destroy_component(privacypolicy);
    			destroy_component(gdprnotice);
    			destroy_component(legal);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Downloads,
    		Legal,
    		PrivacyPolicy,
    		GdprNotice
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
