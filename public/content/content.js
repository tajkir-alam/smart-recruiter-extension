// Function to click the contact info link
const clickContactInfo = () => {
  const contactInfo = document.querySelector(
    "#top-card-text-details-contact-info"
  );

  if (contactInfo) {
    contactInfo.click(); // Simulate a click
    console.log("Contact Info link clicked!");
  } else {
    console.warn("Contact Info link not found. Retrying...");
  }
};

// Use a MutationObserver to handle dynamic content loading
const observer = new MutationObserver(() => {
  const contactInfo = document.querySelector(
    "#top-card-text-details-contact-info"
  );

  if (contactInfo) {
    clickContactInfo();
    observer.disconnect(); // Stop observing after the element is clicked
  }
});

// Start observing changes in the document body
observer.observe(document.body, { childList: true, subtree: true });

// Fallback: Retry clicking after a short delay
setTimeout(() => clickContactInfo(), 3000);
