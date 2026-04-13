/**
 * Horizontal Gallery Navigation
 * Handles mouse wheel, arrow buttons, keyboard navigation, and metadata display
 */

(function() {
  'use strict';
  
  const gallery = document.querySelector('.horizontal-gallery-container');
  const prevButton = document.querySelector('.gallery-arrow-prev');
  const nextButton = document.querySelector('.gallery-arrow-next');
  
  if (!gallery) return;
  
  // Get all gallery items (list items)
  const getGalleryItems = () => {
    return Array.from(gallery.querySelectorAll('li'));
  };
  
  /**
   * Find the currently centered item based on scroll position
   */
  const getCurrentCenteredIndex = () => {
    const items = getGalleryItems();
    const scrollCenter = gallery.scrollLeft + (gallery.clientWidth / 2);
    
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    items.forEach((item, index) => {
      const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
      const distance = Math.abs(scrollCenter - itemCenter);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    
    return closestIndex;
  };
  
  /**
   * Update centered class for metadata visibility
   */
  const updateCenteredItem = () => {
    const items = getGalleryItems();
    const centeredIndex = getCurrentCenteredIndex();
    
    items.forEach((item, index) => {
      if (index === centeredIndex) {
        item.classList.add('centered');
      } else {
        item.classList.remove('centered');
      }
    });
  };
  
  /**
   * Scroll to a specific item index with smooth animation
   */
  const scrollToItem = (index) => {
    const items = getGalleryItems();
    if (items[index]) {
      items[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };
  
  /**
   * Update arrow button visibility based on scroll position
   */
  const updateArrowVisibility = () => {
    const currentIndex = getCurrentCenteredIndex();
    const items = getGalleryItems();
    
    if (prevButton) {
      if (currentIndex === 0) {
        prevButton.classList.add('hidden');
        prevButton.style.opacity = '0';
        prevButton.style.pointerEvents = 'none';
      } else {
        prevButton.classList.remove('hidden');
        prevButton.style.opacity = '';
        prevButton.style.pointerEvents = '';
      }
    }
    
    if (nextButton) {
      if (currentIndex >= items.length - 1) {
        nextButton.classList.add('hidden');
      } else {
        nextButton.classList.remove('hidden');
      }
    }
  };
  
  /**
   * Handle arrow button clicks
   */
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      const currentIndex = getCurrentCenteredIndex();
      scrollToItem(currentIndex - 1);
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const currentIndex = getCurrentCenteredIndex();
      scrollToItem(currentIndex + 1);
    });
  }
  
  /**
   * Convert vertical mouse wheel to smooth horizontal scroll
   * Just like using the scrollbar
   */
  gallery.addEventListener('wheel', (e) => {
    // Prevent default vertical scroll
    e.preventDefault();
    
    // Convert vertical scroll to horizontal
    // Use deltaY for vertical mouse wheel, deltaX for trackpad horizontal swipe
    const scrollAmount = e.deltaY !== 0 ? e.deltaY : e.deltaX;
    
    // Apply smooth horizontal scroll (no snapping)
    gallery.scrollLeft += scrollAmount;
  }, { passive: false });
  
  /**
   * Keyboard navigation (arrow keys)
   */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const currentIndex = getCurrentCenteredIndex();
      scrollToItem(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const currentIndex = getCurrentCenteredIndex();
      scrollToItem(currentIndex + 1);
    }
  });
  
  /**
   * Update arrow visibility and centered item on scroll
   */
  let scrollTimeout;
  gallery.addEventListener('scroll', () => {
    // Debounce updates
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      updateArrowVisibility();
      updateCenteredItem();
    }, 100);
  });
  
  /**
   * Initial setup
   */
  updateArrowVisibility();
  updateCenteredItem();
  
  /**
   * Re-check on window resize
   */
  window.addEventListener('resize', () => {
    updateArrowVisibility();
    updateCenteredItem();
  });
  
})();
