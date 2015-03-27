
# Break Apart Your Backbone.js Render Methods

After my article on [rendering views in Backbone](/rendering-views-in-backbonejs-isnt-always-simple), Jeremy Ashkenas [pointed out](http://news.ycombinator.org/item?id=4325631) that my examples were doing extra, expensive work by re-rendering _everything_ on every call to `render`. He's absolutely right, but they were just examples. In practice I rarely use single render methods for that exact reason.

Instead of writing _gigantic_ render functions that do everything under the sun (and then more, admit it!) you should break your render methods into small chunks. That way you only ever re-render what you need.

This is another one of those patterns that Backbone tutorials don't get complicated-enough to address, but you'll quickly run into problems—or just have a nasty codebase—if you don't adopt it in larger projects.

Say you have a `StatusView`. And each status has a relative timespan (eg. "Posted 34 seconds ago"). And now you you want to be real slick and update that timestamp so its never stale. You definitely don't want to re-render the entire status (avatar and all!) just to refresh the timestamp. That's when having small render helpers comes in real handy.


## I'll show you what I mean...

I'm going to use our `TextfieldView` from [Segment](https://segment.io) as an example. But first, here's what a crappy render method might look like for our `TextfieldView`:

```js
render : function () {
   // Input
   if (this.$input) this.$input.remove();
   this.$input = $(this.inputTemplate({
      value       : this.get('value') || '',
      type        : this.get('type'),
      placeholder : this.get('placeholder'),
      tabindex    : this.getState('disabled') ? -1 : this.get('tabindex')
   }));
   this.$el.append(this.$input);

   // Label
   if (this.$label) this.$label.remove();
   if (this.has('label')) { 
      this.$label = $(this.labelTemplate({
         label : this.get('label')
      }));
      this.$el.prepend(this.$label);
   }

   // Classes
   if (this.has('classes')) this.$el.addClass(this.get('classes').join(' '));

   // States
   for (var i = 0, state; state = this.states[i]; i++) {
      this.$el.state(state, this.state[state]);
   }

   this.trigger('render', this);
   return this;
}
```

That render method is **huge**! It handles appending the input element, prepending an optional label element, adding optional classes, and rendering UI state. Writing this kind of `render` method is going to give you tons of problems:

* **Readability.** Writing that just for this blog post was already annoying enough, now imagine having to maintain that method. I'd need to re-read everything three times just to remember all of the decisions are being made in the code.

* **Performance.** What happens when `label` changes? What about when `disable()` is called? You'll want to re-render you `TextfieldView`. But since you only have a single, giant method, you're re-rending the input element, its attribute, the label, etc. That's adding a _completely_ unecessary performance hit to your app. And not even the kind of performance hit that means cleaner code!

* **Inheritance.** We also have a `TextareaView` (pretty self-explanatory). Ideally it would easily reuse the code for rendering labels, optional classes and UI state. But if it's all mashed up in a single render method we'd probably just copy-paste that code into `TextareaView`.

So how do we solve these problems? Let's look at...


## A real-world example.

Here are the render methods (note: plural!) for `TextfieldView` pulled straight from our [Segment](https://segment.io) source. Instead of having a single, gigantic render method that handles rendering the input, its label, states and classes, I've split `render` into several small helper methods:

```js
renderInput : function () {
   if (this.$input) this.$input.remove();
   
   this.$input = $(this.inputTemplate({
      value       : this.get('value') || '',
      type        : this.get('type'),
      placeholder : this.get('placeholder'),
      tabindex    : this.getState('disabled') ? -1 : this.get('tabindex')
   }));
   this.$el.append(this.$input);
   return this;
},

renderLabel : function () {
   if (this.$label) this.$label.remove();
   if (!this.has('label')) return this;

   this.$label = $(this.labelTemplate({
      label : this.get('label')
   }));
   this.$el.prepend(this.$label);
   return this;
},
```

See how each of those helpers `return this`? That's to make rendering all at once _real_ chainable. Here's what the textfield's main `render` method—the one that calls all the helpers—looks like:

```js
render : function () {
   this
      .renderInput()
      .renderLabel()
      .renderClasses()
      .renderStates();
   return this.trigger('render', this);
}
```


## Now you can pick and choose.

When settings change for the `TextfieldView`, it can re-render individual pieces efficiently. To set up that functionality, after the view is rendered it will start listening for changes to its settings and call the appropriate render helper to update those changes in the DOM.

```js
onRenderedStateChange : function (self, rendered) {
   var method = rendered ? 'on' : 'off';
   this[method]('change:placeholder change:type change:tabindex change:state:disabled', this.renderInput);
   this[method]('change:label', this.renderLabel);
   this[method]('change:classes', this.renderClasses);
   this[method]('change:states', this.renderStates);
},
```

The ternary for `method` means that as soon as our view isn't rendered anymore (when the rendered state changes to `false`) the events will be unbound. The one thing this pattern depends on is having a `rendered` state that generates events when changed. On Segment, we maintain UI state like `rendered` on all of our views, so this is easy to do.


## And now you can inherit those helpers.

Wondering where the heck that `renderStates` call came from? That method isn't defined in our `TextfieldView`. It's inherited from further up the prototype chain in our `BaseView`.

That's the other huge benefit to breaking up your render method: it's awesome for inheritance. Whenever I find myself copy-pasting rendering code, I stop, create a parent view and have all of the children inherit the render helpers they need.

Don't be afraid of bringing things up a level even if they aren't used everywhere. `renderLabel` is actually defined in `BaseView` as well, even though only `TextfiedView` and `TextareaView` use it. That's fine! No other view needs to care and if I want my `DropdownView` to have a label later... no new code!


## There are always drawbacks.

You might have noticed that all of the examples use a combination of templating and appending elements to the DOM despite [me advocating against append](/rendering-views-in-backbonejs-isnt-always-simple). That's a trade-off you have to weigh when splitting up `render`.

To get around that, you could have a single `render` that uses a template, and then have small `update` helpers to update individual parts of the DOM when settings change. But then you'd be duplicating your rendering logic and you'd have to keep both paths in sync. Good for performance maybe, but I don't want to have to sync that code right now.

At that point though, you get even closer to model binding, so why not use it? I haven't looked into model binding enough yet. The model binding plugin I'd use would need to be very flexible because when my textfield's disabled state changes, its `tabindex` needs to be synced, and when label is set to `null` an exisiting label element needs to be removed. And then there's performance to consider too. My current solution leaves me in complete control of performance, so any plugin needs to handle it well enough for me not to notice.

While researching for this post, I did come across [Rivets.js](http://rivetsjs.com/) which looks really promising. So I'll probably experiment with that soon, and if it works out nicely I'll write another article about it.

In the end, it all depends on the situation, but I've found that having multiple, small render helpers has made my Backbone views much more manageable.