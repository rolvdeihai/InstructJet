# web-scraper/config/browser_config.py

from playwright.async_api import async_playwright
from playwright_stealth import stealth_async
import random

class PlaywrightManager:
    def __init__(self, headless: bool = True):
        self.headless = headless
        self.playwright = None
        self.browser = None
        self.context = None          # will be reused
        self.page = None

    async def start_browser(self, stealth_on: bool, user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"):
        """Initialize Playwright, launch browser once, and create a reusable context."""
        self.playwright = await async_playwright().start()

        # Enhanced launch arguments – still headless, but harder to detect
        launch_args = [
            '--disable-dev-shm-usage',
            '--disable-blink-features=AutomationControlled',
            '--disable-features=IsolateOrigins,site-per-process',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1920,1080',
            '--start-maximized',
            '--lang=en-US,en;q=0.9',
            '--enable-webgl',
            '--ignore-gpu-blocklist',
            # ----- added stealth args -----
            '--use-gl=desktop',
            '--disable-software-rasterizer',
            '--enable-accelerated-2d-canvas',
            '--disable-features=UseChromeOSDirectVideoDecoder',
        ]

        self.browser = await self.playwright.chromium.launch(
            headless=self.headless,
            args=launch_args
        )

        # HTTP headers – realistic
        extra_headers = {
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Upgrade-Insecure-Requests": "1",
        }

        # Create ONE context that will be reused for all pages
        self.context = await self.browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent=user_agent,
            java_script_enabled=True,
            ignore_https_errors=True,
            bypass_csp=True,
            locale='en-US',
            extra_http_headers=extra_headers,
            device_scale_factor=1,
            has_touch=False,
        )

        self.page = await self.context.new_page()

        if stealth_on:
            await stealth_async(self.page)
            # Enhanced init script (hardware + WebGL)
            await self.page.add_init_script("""
                // Override webdriver
                Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

                // Fake plugins length
                Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3,4,5] });

                // Fake languages
                Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });

                // Fake chrome object
                if (typeof window.chrome === 'undefined') {
                    window.chrome = { runtime: {} };
                }

                // Override permissions query
                const originalQuery = window.navigator.permissions.query;
                window.navigator.permissions.query = (parameters) => (
                    parameters.name === 'notifications' ?
                        Promise.resolve({ state: Notification.permission }) :
                        originalQuery(parameters)
                );

                // ----- NEW: Hardware concurrency & device memory -----
                Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
                Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });

                // ----- NEW: WebGL vendor/renderer spoofing -----
                const getParameter = WebGLRenderingContext.prototype.getParameter;
                WebGLRenderingContext.prototype.getParameter = function(parameter) {
                    if (parameter === 37445) return 'Intel Inc.';        // UNMASKED_VENDOR_WEBGL
                    if (parameter === 37446) return 'Intel Iris OpenGL Engine'; // UNMASKED_RENDERER_WEBGL
                    return getParameter(parameter);
                };
            """)

        return self.page

    async def new_page(self, stealth_on: bool = False, user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"):
        """
        Create a NEW page from the existing browser context.
        IMPORTANT: Reuses the same context – no new context creation.
        """
        if not self.context:
            raise RuntimeError("Browser not started. Call start_browser() first.")

        # Optionally update user agent for this page only (context has its own UA)
        page = await self.context.new_page()
        if user_agent:
            await page.set_extra_http_headers({
                "User-Agent": user_agent,
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Upgrade-Insecure-Requests": "1",
            })

        if stealth_on:
            await stealth_async(page)
            await page.add_init_script("""
                Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3,4,5] });
                Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
                if (typeof window.chrome === 'undefined') { window.chrome = { runtime: {} }; }
                const originalQuery = window.navigator.permissions.query;
                window.navigator.permissions.query = (parameters) => (
                    parameters.name === 'notifications' ?
                        Promise.resolve({ state: Notification.permission }) :
                        originalQuery(parameters)
                );
                Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
                Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });
                const getParameter = WebGLRenderingContext.prototype.getParameter;
                WebGLRenderingContext.prototype.getParameter = function(parameter) {
                    if (parameter === 37445) return 'Intel Inc.';
                    if (parameter === 37446) return 'Intel Iris OpenGL Engine';
                    return getParameter(parameter);
                };
            """)
        return page

    async def stop_browser(self):
        """Close everything."""
        if self.page:
            await self.page.close()
            self.page = None
        if self.context:
            await self.context.close()
            self.context = None
        if self.browser:
            await self.browser.close()
            self.browser = None
        if self.playwright:
            await self.playwright.stop()
            self.playwright = None