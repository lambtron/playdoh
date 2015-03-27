
# OOCSS + Sass = The best way to CSS

[Object-oriented CSS](http://oocss.org/) is awesome. But littering your markup with non-semantic classes is _not_ awesome. Those classes sprinkled all over your HTML _are_ going to change, and that's not gonna be fun. But if you combine OOCSS and [Sass](http://sass-lang.com/) you get the best of both worlds: modular CSS without bloated, hard-to-maintain HTML.


## OOCSS leads to hard-to-maintain HTML.

First off, quick disclaimer, a bunch of you probably freaked out the second you read "non-semantic". Here's the thing, I don't actually care about them _being_ non-semantic. I care about what that means for upkeep. Non-semantic classes aren't _needed_ to describe a component, which means they _will_ change.

The only way to make modules in plain CSS is to define non-semantic classes. ([For now.](http://www.xanthir.com/blog/b49w0)) Then you apply those classes to all of your HTML elements. That's the OOCSS way of approaching modules. But it comes with big problems:

1. I don't want to have to trawl through HTML every time I flip-flop on styling decisions. I work at [a startup](https://segment.io)—things change all the time.

1. I don't even have access to some of the DOM elements I would need to add classes to! If you're using [Javascript components to render elements on your page](/rendering-views-in-backbonejs-isnt-always-simple), then you can't add classes to elements inside the component. (Unless you do some janky, unspeakable things.)

Besides the unmaintainable HTML, everything else about OOCSS is spot on. Abstracting repetition into modules is the only way to keep CSS maintainable on large projects. So how do we get the benefits without the drawbacks?


## OOSass to the rescue!

Combining OOCSS and Sass gives you super powers. The `@extend` directive in Sass lets you inherit styles from another selector without duplicating everything like a `@mixin`. Which is sweet, but even `@extend` calls can cause code bloat if you nest them or use them with nested selectors.

Luckily [Sass 3.2](http://chriseppstein.github.com/blog/2012/08/23/sass-3-2-is-released/) added a feature called [placeholders](http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#placeholders). Placeholders are selectors that output nothing unless they are extended. Here's what a placeholder looks like:

```css
%separator
    border-top: 1px solid black

hr
    @extend %separator

.separator
    @extend %separator
```

That would generate the following CSS:

```css
hr,
.separator {
    border-top: 1px solid black;
}
```

Placeholders **don't have the code bloat** problems that mixins or regular `@extend` calls have. That makes placeholders perfect for creating non-semantic CSS modules. I call these modules **"patterns"**. They are little bits of style that you can mix and match throughout your stylesheets.


## I'll show you a real use case.

Take the golden child of OOCSS as an example: the `.media` module. You probably want to apply the `.media` module to a bunch of your components: `.status`, `.profile`, etc.

Thing is, you don't want to have to repeat `.media` all over your HTML. Especially because you're already going to be repeating `.status` and `.profile`. That's where using placeholders makes things awesomely DRY. Here's our `%media` pattern:

```css
%media
    overflow: hidden
    &:first-child
        float: left
    &:last-child
        overflow: hidden
```

Now instead of having to repeat `.media` on all of your elements, you just extend the `%media` pattern anywhere you want to use it:

```css
.status
    @extend %media
    // Status-specific styles here...

.profile
    @extend %media
    // Profile-specific styles here...
```

This means that in your HTML you only need to add the semantic classes: `.status` and `.profile`—the ones you don't mind typing because without them all you have is an `<article>` element. 

You also get flexibility. If you decide to change the way statuses look so that the `.media` module no longer applies, just remove that `@extend` call and your done! No combing through your HTML to remove `.media` classes.

Sharp eyes might have noticed that I used a slightly modified version of the `.media` module. That goes back to not having access to the DOM when using Javascript components...


## OOSass makes styling Javascript components easy.

The biggest problem I have with OOCSS is it assumes you have complete control over the DOM and can add classes to it. That's not always true! When you're rendering Javascript components (or using someone else's), you can only touch the top-most element of the component.

If you attach a `DropdownView` to your `.user-dropdown` element, you could add a `.media` class to `.user-dropdown`. But there's no way to add classes to the dropdown's `.button` or any of its `.menu-item`'s because you have no control over the DOM inside that component. 

With Sass placeholders, that's not a problem:

```css
.dropdown
    // Normal styles for every dropdown...

.user-dropdown
    // Extra styles for user-specific dropdowns...
    .menu-item
        @extend %media
```

You'd have to do uncouth things to get that to work with pure CSS classes: reaching into components and destroying their encapsulation, or using some sort of horrific string-based className API. But with Sass patterns you can easily augment DOM elements that you have no direct control of.


## Okay, okay, get to the examples!

I love reading through other people's CSS patterns, so I figured I'd share some of my own. Here are some of the patterns I use all over [Segment](https://segment.io):

### Lip
This is an Apple-style separator, creating a lip above the content underneath it. (Notice I also have `%reversed-lip` for handling a lip in the opposite direction.)

```css
%lip
    clear: both
    display: block
    height: 5px
    background: url('/public/images/patterns/lip/lip.png') no-repeat
    background-size: 100% 100%

%reversed-lip
    @extend %lip
    background-image: url('/public/images/patterns/lip/reversed-lip.png')
```


### Valley
This just adds two **lips** to the top and bottom of an element to make it feel like it is recessed into the area around it.

```css
%valley
    position: relative
    overflow: hidden

    &::before,
    &::after
        content: ''
        position: absolute
        left: 0
        right: 0
    &::before
        @extend %lip
        top: 0
    &::after
        @extend %reversed-lip
        bottom: 0
```


### Plane
A very simple, rounded-corner box. These are the backbone for all of the colored planes on Segment

```css
%plane
    box-shadow: 0 2px 5px rgba($black, .1)
    border-radius: $border-radius-medium

%white-plane
    @extend %plane
    background-color: $white

%off-white-plane
    @extend %plane
    background-color: $off-white

...
```


### Seam
You know those borders people make by putting a black line and a white line together and making them translucent? I call that a **seam**.

```css
%seam
    clear: both
    display: block
    height: 0px
    border-top: 1px solid rgba($black, .12)
    border-bottom: 1px solid rgba($white, .15)
```


### Well
Similar to a **valley**, this is just a depression in the page, for things like `<code>` samples. (It's actually really similar to the code samples on this blog.)

```css
%well
    box-shadow: inset 0 1px 5px rgba($black, .14)
    border-radius: $border-radius-medium

%off-white-well
    @extend %well
    background-color: $off-white

%light-gray-well
    @extend %well
    background-color: $light-gray

...
```


## Now it's your turn.

Hopefully that gives you a good idea what **patterns** can be and how to use them in your CSS components. They're everywhere. 

They should [only do one thing](http://csswizardry.com/2012/04/the-single-responsibility-principle-applied-to-css/), and they should do it well. Harry Roberts [mentions](http://www.youtube.com/watch?v=R-BX4N8egEc&hd=1) that you should keep their names vague and non-semantic. That forces you to make them abstract so that you can use them all over the place. And you can always build patterns on top of each other, like I've done in the **valley** example.

If you have similar patterns of your own, I'd love to see 'em!