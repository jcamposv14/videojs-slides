import videojs from 'video.js';
import document from 'global/document';
// Default options for the plugin.
const defaults = {};

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;

/**
 * Function to invoke when the player is ready.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player.
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
class VideoSlides {
  /**
  * VideoSlides Constructor.
  *
  * @classdesc A class that represents a slides.
  * @constructs VideoSlides
  * @param {Array} items Array Object Items has slide image and time to show the slide
  */
  constructor(items) {

    this.slides = document.createElement('ul');
    this.slidesContainer = document.createElement('div');
    this.slidesItems = items;
    this.oldTime = 0;
    this.appendSlider();
    this.appendModes();
  }
  /**
  * AppendSlider function to append Slide list into VideoJS.
  *
  * @return {void} doesn't return enething
  * @function appendSlider
  *
  */
  appendSlider() {
    // Get control bar element
    const controlBar = document.getElementsByClassName('vjs-control-bar')[0];
    // const slidesContainer = document.createElement('div');

    this.slidesContainer.appendChild(this.slides);
    // Add slide list className
    this.slides.className = 'video-slides';
    this.slidesContainer.className = 'video-slides-container';
    controlBar.parentNode.insertBefore(this.slidesContainer, controlBar);
    this.appendSliderItem();
  }
  /**
  * AppendMode function to append over modes to the  slides list into VideoJS.
  *
  * @return {void} doesn't return enething
  * @function appendModes
  *
  */
  appendModes() {
    const overDiv = document.createElement('div');
    const fullMode = document.createElement('a');
    const halfMode = document.createElement('a');
    const halfModeChild = document.createElement('span');
    const fullModeCopy = document.createTextNode('Full Mode');
    const halfModeCopy = document.createTextNode('Half Mode');

    fullMode.className = 'video_full_mode full-screen-icon';
    halfMode.className = 'video_half_mode half-screen-icon';
    overDiv.className = 'video-mode';
    fullMode.appendChild(fullModeCopy);
    halfMode.appendChild(halfModeChild);
    halfModeChild.appendChild(halfModeCopy);
    overDiv.appendChild(fullMode);
    overDiv.appendChild(halfMode);
    this.slidesContainer.appendChild(overDiv);
  }
  /**
  * AppendSliderItem function to append SlideItem  into Slide List.
  *
  * @return {void} doesn't return enething
  * @function appendSliderItem
  *
  */
  appendSliderItem() {
    for (let i = 0; i <= this.slidesItems.length - 1; i++) {
      // Create an image and li tag
      const img = document.createElement('img');
      const li = document.createElement('li');

      // Added src and Class name
      img.src = this.slidesItems[i].url;
      li.className = 'slide_' + this.slidesItems[i].time;
      // Append image into li
      li.appendChild(img);
      // Append li into ul list
      this.slides.appendChild(li);
    }
  }
  /**
  * slideShow function to show the current slide according to the time.
  *
  * @param {number} time the current video time
  * @return {void} doesn't return enething
  * @function slideShow
  *
  */
  slideShow(time) {
    const currentTime = Math.floor(time);

    for (let i = 0; i <= this.slidesItems.length - 1; i++) {
      if (currentTime === this.slidesItems[i].time && this.oldTime !== currentTime) {
        const firstItem = (i === 0) ? 0 : 1;
        const oldItem = 'slide_' + this.slidesItems[i - firstItem].time;
        const currentItem = 'slide_' + this.slidesItems[i].time;
        const beforeSlide = document.getElementsByClassName(oldItem)[0];
        const currentSlide = document.getElementsByClassName(currentItem)[0];

        beforeSlide.style.display = 'none';
        currentSlide.style.display = 'block';
        this.oldTime = currentTime;
        return false;
      }
    }
  }
 }
const onPlayerReady = (player, options) => {
  player.addClass('vjs-slides');
  const slides = new VideoSlides(options.slides);

  player.on('timeupdate', function() {
    slides.slideShow(this.currentTime());
  });
};

/**
 * A video.js plugin.
 *
 * @function slides
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const slides = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
registerPlugin('slides', slides);

// Include the version number.
slides.VERSION = '__VERSION__';

export default slides;
