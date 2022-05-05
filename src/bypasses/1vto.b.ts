import { hrefBypass } from '../fastforward';

// No auto test for this bypass
// Manual test link: http://1v.to/t/VjFaV2IxVXdNVWhVYTFacFRURndUbFJYTVRObFZtdDNXa1ZrYkdKV1NrbFdiR2hYVjJzeGNXSkVRbFZTUlRWaFdrZDRTMU5XU2xWUmJXeFhWa1ZhVmxaR1ZtdFhiRUpTVUZRd1BRPT0rUA==
hrefBypass(/1v\.to\/t\/.*/, () => window.location.pathname = window.location.pathname.split('/t/').join('/saliendo/'));
