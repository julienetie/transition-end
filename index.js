const transitionEndPartial = () => {
  let once = true;
  let defaultTransition;
  let transitionEvent;
  return (element, callback, transition) => {
    console.log('transitionEnd')
    const isElement = element instanceof Element;
    if (!isElement) {
      console.error(`transitionEnd: ${element} is not an element`);
    }

    if (once) {
      console.log('once')
      once = false;
      defaultTransition = window.getComputedStyle(element).getPropertyValue('transition')
      transitionEvent = new TransitionEvent('transitionend', {
        view: window,
        bubbles: true,
        cancelable: true
      });
    }
    
    return new Promise((resolve, reject) => {
      const transitionResolver = () => {
        console.log('transitionResolver');
        element.removeEventListener('transitionend', transitionResolver, false);
        const endOfTransition = () => {
          element.removeEventListener('transitionend', endOfTransition, false);
          resolve(element);
        };
        element.addEventListener('transitionend', endOfTransition, false);
        callback(element);
      }
      element.addEventListener('transitionend', transitionResolver, false);
      if (transition) {
        element.style.transition = transition;
      } else {
        element.style.transition = defaultTransition;
      }
      element.dispatchEvent(transitionEvent);
    });
  }
}
export default transitionEndPartial();
