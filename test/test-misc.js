describe('loud', function() {
    var data = {
        /* abstract roles */
        '<div role="command">Content</div>': ['Content'],
        '<div role="composite">Content</div>': ['Content'],
        '<div role="input">Content</div>': ['Content'],
        '<div role="landmark">Content</div>': ['Content'],
        '<div role="range">Content</div>': ['Content'],
        '<div role="roletype">Content</div>': ['Content'],
        '<div role="section">Content</div>': ['Content'],
        '<div role="sectionhead">Content</div>': ['Content'],
        '<div role="select">Content</div>': ['Content'],
        '<div role="structure">Content</div>': ['Content'],
        '<div role="widget">Content</div>': ['Content'],
        '<div role="window">Content</div>': ['Content'],

        '<div role="command button">Content</div>': ['Content', 'button'],
        '<div role="button command">Content</div>': ['Content', 'button'],
        '<div role="button textbox">Content</div>': ['Content', 'button'],
        '<div role="  button  ">Content</div>': ['Content', 'button'],
        '<div role="">Content</div>': ['Content'],

        /* spaces */
        '<ul> <li> Content </li> </ul>': ['list', 'Content', 'listitem', 'list end'],

        '<div>Content</div>': ['Content']
    };

    describe('handles', function() {
        afterEach(function() {
            this.elem.remove();
            this.elem = null;
        });

        Object.keys(data).forEach(function(key) {
            it(key, function() {
                this.elem = document.createElement('div');
                this.elem.innerHTML = key;
                document.body.appendChild(this.elem);
                expect(loud.say(this.elem)).toEqual(data[key]);
            });
        });

        describe('arrays', function() {
            afterEach(function() {
                this.elem2.remove();
                this.elem2 = null;
            });

            it('as usual', function() {
                this.elem = document.createElement('button');
                this.elem.innerHTML = 'Join';
                document.body.appendChild(this.elem);

                this.elem2 = document.createElement('input');
                this.elem2.setAttribute('type', 'checkbox');
                this.elem2.setAttribute('title', 'Agree');
                document.body.appendChild(this.elem2);

                expect(loud.say([this.elem, this.elem2])).toEqual([
                    'Join', 'button',
                    'Agree', 'checkbox', 'not checked'
                ]);
            });
        });

        it('handles text', function() {
            this.elem = document.createTextNode('Text');
            document.body.appendChild(this.elem);
            expect(loud.say(this.elem)).toEqual(['Text']);
        });

        it('handles comments', function() {
            this.elem = document.createComment('comment');
            document.body.appendChild(this.elem);
            expect(loud.say(this.elem)).toEqual([]);
        });
    });

    it('provides VERSION as String', function() {
        expect(typeof loud.VERSION).toEqual('string');
    });

    it('handles undefined', function() {
        expect(loud.say()).toEqual([]);
    });
});
