/**
 * Horizontal Gallery Navigation
 * Handles mouse wheel, arrow buttons, and keyboard navigation
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
   * Update metadata opacity based on distance from center
   */
  const updateMetadataOpacity = () => {
    const items = getGalleryItems();
    const galleryCenter = gallery.scrollLeft + (gallery.clientWidth / 2);
    
    items.forEach((item) => {
      const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
      const distance = Math.abs(galleryCenter - itemCenter);
      
      // Calculate opacity: 1 at center, fades to 0 at ~400px away
      const maxDistance = 400;
      const opacity = Math.max(0, 1 - (distance / maxDistance));
      
      // Apply opacity to metadata
      const metadata = item.querySelector('.painting-metadata');
      if (metadata) {
        metadata.style.opacity = opacity;
      }
      
      // Keep centered class for other purposes
      if (opacity > 0.8) {
        item.classList.add('centered');
      } else {
        item.classList.remove('centered');
      }
    });
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
   * Update arrow visibility and metadata opacity on scroll
   */
  gallery.addEventListener('scroll', () => {
    // Update metadata immediately for smooth fade
    updateMetadataOpacity();
    
    // Debounce arrow visibility updates
    clearTimeout(gallery._scrollTimeout);
    gallery._scrollTimeout = setTimeout(updateArrowVisibility, 100);
  });
  
  /**
   * Initial setup
   */
  updateArrowVisibility();
  updateMetadataOpacity();
  
  /**
   * Center the first item on page load
   */
  const items = getGalleryItems();
  if (items[0]) {
    items[0].scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'center'
    });
    // Update metadata after centering
    setTimeout(() => {
      updateMetadataOpacity();
      updateArrowVisibility();
    }, 100);
  }
  
  /**
   * Re-check on window resize
   */
  window.addEventListener('resize', () => {
    updateArrowVisibility();
    updateMetadataOpacity();
  });
  
})();
