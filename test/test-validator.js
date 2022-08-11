/* globals loud */
'use strict';

describe('loud validator', () => {
    beforeEach(function() {
        this.warn = loud.warn;
        this.forceValidMarkup = loud.FORCE_VALID_MARKUP;
        this.callback = jasmine.createSpy();
    });

    afterEach(function() {
        loud.warn = this.warn;
        loud.FORCE_VALID_MARKUP = this.forceValidMarkup;
        document.body.removeChild(this.elem);
        this.elem = null;
    });

    it('warns about not owning elements', function() {
        this.elem = document.createElement('div');
        this.elem.innerHTML = '<div role="list">Content</div>';
        document.body.appendChild(this.elem);
        loud.warn = this.callback;
        expect(loud.say(this.elem)).toEqual(['Content']);
        expect(this.callback.calls.count()).toEqual(1);
        expect(this.callback.calls.first().args).toEqual([
            'Element with role "list" does not own elements with valid roles'
        ]);
    });

    it('warns about not owned elements', function() {
        this.elem = document.createElement('div');
        this.elem.innerHTML = '<div role="listitem">Content</div>';
        document.body.appendChild(this.elem);
        loud.warn = this.callback;
        expect(loud.say(this.elem)).toEqual(['Content']);
        expect(this.callback.calls.count()).toEqual(1);
        expect(this.callback.calls.first().args).toEqual([
            'Element with role "listitem" is not owned by elements with valid roles'
        ]);
    });

    it('throws an error instead of warning', function() {
        let elem = this.elem = document.createElement('div');
        this.elem.innerHTML = '<div role="list">Content</div>';
        document.body.appendChild(this.elem);
        loud.warn = loud.error;
        expect(() => {
            loud.say(elem);
        }).toThrowError(loud.ValidationError, 'Element with role "list" does not own elements with valid roles');
    });

    it('allows invalid markup for not owning elements', function() {
        this.elem = document.createElement('div');
        this.elem.innerHTML = '<div role="list">Content</div>';
        document.body.appendChild(this.elem);
        loud.FORCE_VALID_MARKUP = false;
        loud.warn = this.callback;
        expect(loud.say(this.elem)).toEqual(['list', 'Content', 'list end']);
        expect(this.callback.calls.count()).toEqual(1);
        expect(this.callback.calls.first().args).toEqual([
            'Element with role "list" does not own elements with valid roles'
        ]);
    });

    it('allows invalid markup for not owned elements', function() {
        this.elem = document.createElement('div');
        this.elem.innerHTML = '<div role="listitem">Content</div>';
        document.body.appendChild(this.elem);
        loud.FORCE_VALID_MARKUP = false;
        loud.warn = this.callback;
        expect(loud.say(this.elem)).toEqual(['Content', 'listitem']);
        expect(this.callback.calls.count()).toEqual(1);
        expect(this.callback.calls.first().args).toEqual([
            'Element with role "listitem" is not owned by elements with valid roles'
        ]);
    });
});
