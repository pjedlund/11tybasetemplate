---
title: Bottle Slider Wiggle Effect
tags: ['code', 'design']
date: 2345-08-26
image: slider.jpg
---

<div class="extend">
  <video poster="bottleslider-still.jpg" preload="" autoplay="autoplay" loop="loop" width="960" height="360">
    <source src="bottleslider.webm" type="video/webm" />
    <source src="bottleslider.mp4" type="video/mp4" />
  </video>
</div>

<p class="lead">I built this product slider as part of a wine shop I was working on in 2015, and since it's also featured in a case study here on my site, I had a couple of people asking me how the animation was done.</p>

Well, it's really quite simple &ndash; so here's a quick rundown on how to make the bottles dance. You can see the actual live thing in action on [one of the product pages here](http://www.weingut-huber.at/product/gruener-veltliner-alte-setzen-erste-lage-2015/). Grab some Grüner Veltliner while you're at it.

## The Slider

Markup is pretty straightforward, just your standard slider structure. A parent `div` and an `ul` with some list items. The real production version obviously has a little bit more going on, what with that fancy ratings popover and all. But for now, this should do the job:

```html
<div class="slider">
	<ul class="slider__content">
		<li class="slider__item">
			<a href="link/to/product">
				<img src="image_of_bottle.jpg" alt="" />
			</a>
		</li>

		<li class="slider__item">...</li>
		<li class="slider__item">...</li>
	</ul>
</div>
```

To make this into a slider widget, you will need some CSS and a bit of Javascript. I used a jQuery plugin called [Flexslider](https://github.com/woocommerce/FlexSlider) for this one, and I like it a lot. But almost any other slider would work too. The only important part for this effect is a callback function that gets triggered **before** each sliding transition.

Flexslider does exactly that with its `before` method. You pass it the `$slider` variable (the parent element), and then apply a class to it that later controls the animation state. After the animation has finished, we need to remove that class again. My wiggle lasts about a second, so I put in a `setTimeout` for that duration (plus a little more for good measure).

```js
$slider.flexslider({
	//animation: 'slide',
	//selector: '.slider__item',
	//animationLoop: false,
	//slideshow: false,
	before: function ($slider) {
		$slider.addClass('slider--shaking')
		window.setTimeout(function () {
			$slider.removeClass('slider--shaking')
		}, 1200)
	}
})
```

## The Animation

Next up is the actual CSS keyframe animation that makes the bottles swing from side to side. Mine looks like this:

```css
@keyframes wiggle {
	25% {
		transform: rotate3d(0, 0, 1, 6deg);
	}
	50% {
		transform: rotate3d(0, 0, 1, -4deg);
	}
	75% {
		transform: rotate3d(0, 0, 1, 2deg);
	}
	100% {
		transform: rotate3d(0, 0, 1, 0deg);
	}
}
```

We tilt the items first right, then left, then right again, losing momentum in each turn to simulate the inertia a real bottle would have.
The `rotate3d` is to force graphic acceleration, which makes for smoother animation performance. Also, be sure to include vendor prefixes for the transform - or, if you're lazy like me, let [Autoprefixr](https://www.npmjs.com/package/gulp-autoprefixer) do that for you.

The last step is to apply the keyframe animation to your slider every time it gets triggered.
Two things are important here:

1. define the `transform-origin` for each object. This will be the fixed point that anchors the animation, it corresponds to the center of gravity in the real world. For my bottles, that would be center bottom.

2. 💡**PRO TIP:** to make it seem more realistic, apply a little delay to every other bottle, so they dont all wiggle in unison. A small offset in timing does the trick.

```css
.slider--shaking .slider__item {
	//disable hover effects while transitioning
	pointer-events: none;

	//set up the wiggle animation
	animation-name: wiggle;
	animation-duration: 1s;
	animation-fill-mode: both;

	//set the 'fixed point' of the animation
	transform-origin: bottom center;
}

.slider--shaking .slider__item:nth-child(2n) {
	//slightly offset every other item
	animation-delay: 0.1s;
}
```

Aaand you're done! Not much to it, but makes for a nice touch and a cool thing to show off. 🍾
