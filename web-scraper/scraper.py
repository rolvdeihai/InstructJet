# web-scraper/scraper.py – General Web Search (no hardcoded prompts)
import urllib.parse
import asyncio
import logging
from typing import Dict, AsyncGenerator, Optional, Set
import asyncio
from typing import Dict, AsyncGenerator, Optional, Callable, Awaitable, Any
from enum import Enum

from config.browser_config import PlaywrightManager
from parsel import Selector
import os
# from dotenv import load_dotenv
# load_dotenv()

logger = logging.getLogger(__name__)

class CaptchaType(str, Enum):
    TEXT = "text"
    CHECKBOX = "checkbox"
    IMAGE_GRID = "image_grid"
    UNKNOWN = "unknown"
    
async def detect_captcha(page) -> Optional[tuple[CaptchaType, Any]]:
    """Detect CAPTCHA on the page and return (type, element_selector_or_frame)."""
    # Wait a bit for dynamic content
    await page.wait_for_timeout(1000)
    
    # Check for reCAPTCHA iframe (most common)
    # Log all iframes
    iframes = await page.query_selector_all("iframe")
    logger.info(f"📄 Found {len(iframes)} iframes on page")
    for i, iframe in enumerate(iframes):
        src = await iframe.get_attribute("src")
        logger.info(f"   Iframe {i}: src={src[:100] if src else 'None'}")
    
    # Check for reCAPTCHA iframe
    recaptcha_iframe = await page.query_selector("iframe[src*='recaptcha']")
    if recaptcha_iframe:
        is_visible = await recaptcha_iframe.is_visible()
        logger.info(f"🔍 reCAPTCHA iframe found, visible={is_visible}")
        if is_visible:
            return CaptchaType.CHECKBOX, recaptcha_iframe
    else:
        logger.info("❌ No reCAPTCHA iframe found")
    
    # hCaptcha
    hcaptcha_iframe = await page.query_selector("iframe[src*='hcaptcha']")
    if hcaptcha_iframe and await hcaptcha_iframe.is_visible():
        return CaptchaType.CHECKBOX, hcaptcha_iframe
    
    # Text CAPTCHAs (classic)
    if await page.is_visible(".captcha"):
        return CaptchaType.TEXT, ".captcha"
    if await page.is_visible("#captcha"):
        return CaptchaType.TEXT, "#captcha"
    if await page.is_visible("img[alt*='captcha']") and await page.is_visible("input[name*='captcha']"):
        return CaptchaType.TEXT, "img[alt*='captcha']"
    
    return None

async def solve_captcha_interactive(
    page,
    captcha_type: CaptchaType,
    element_selector: str,
    get_user_solution: Callable[[bytes, CaptchaType], Awaitable[Dict[str, Any]]]
) -> bool:
    """Take screenshot, ask user for solution, apply it."""
    # Locate the CAPTCHA element or its container
    if captcha_type == CaptchaType.CHECKBOX:
        # For checkbox, we need the iframe or the checkbox itself
        frame = await page.query_selector(element_selector)
        if not frame:
            return False
        # Take screenshot of the checkbox area
        screenshot = await frame.screenshot()
        solution = await get_user_solution(screenshot, captcha_type)
        if solution.get("type") == "click":
            # Click at relative coordinates inside the element
            await frame.click(position={"x": solution["x"], "y": solution["y"]})
            # Wait a moment for the checkbox to register
            await page.wait_for_timeout(1000)
            # Look for a submit button on the page (common for demo pages)
            submit_button = await page.query_selector("button[type='submit'], input[type='submit']")
            if submit_button:
                await submit_button.click()
        return True
    elif captcha_type == CaptchaType.TEXT:
        # Find the CAPTCHA image
        img = await page.query_selector(element_selector)
        if not img:
            return False
        screenshot = await img.screenshot()
        solution = await get_user_solution(screenshot, captcha_type)
        if solution.get("type") == "text":
            # Find the input field (common names)
            input_sel = "input[name*='captcha'], input[id*='captcha'], .captcha-input"
            await page.fill(input_sel, solution["text"])
            # Find submit button
            submit_sel = "button[type='submit'], input[type='submit'], .captcha-submit"
            if await page.is_visible(submit_sel):
                await page.click(submit_sel)
            else:
                # Press Enter
                await page.keyboard.press("Enter")
        return True
    return False

async def general_web_search(
    query: str,
    max_results: int = 30,
    stop_flag: Optional[Dict[str, bool]] = None,
    on_captcha: Optional[Callable[[bytes, CaptchaType], Awaitable[Dict[str, Any]]]] = None
) -> AsyncGenerator[Dict[str, str], None]:
    """
    Perform a plain Google web search and yield results.

    Args:
        query: User's search string (e.g., "best pizza in New York").
        max_results: Maximum number of results to return.
        stop_flag: Optional shared dict with a "stop" key to abort early.

    Yields:
        Dict with keys: title, url, snippet, rank (1-indexed).
    """
    if not query:
        return

    encoded_query = urllib.parse.quote(query)
    # google_url = f"https://www.google.com/search?q={encoded_query}&hl=en&gl=us"
    # logger.info(f"Searching Google: {google_url}")
    
    # --- TEST: Force reCAPTCHA demo page ---
    google_url = "https://www.google.com/recaptcha/api2/demo"
    logger.info(f"TEST MODE: Going to reCAPTCHA demo page: {google_url}")

    playwright_manager = PlaywrightManager(headless=False)
    seen_urls: Set[str] = set()
    results_yielded = 0

    try:
        page = await playwright_manager.start_browser(stealth_on=True)
        await page.goto(google_url, wait_until="domcontentloaded", timeout=60000)
        await page.wait_for_timeout(3000)  # let dynamic content settle
        
        if os.environ.get("TEST_CAPTCHA") == "1":
            logger.info("TEST: Generating fake CAPTCHA")
            # Take a screenshot of the entire page as fake CAPTCHA image
            fake_img = await page.screenshot()
            if on_captcha:
                solution = await on_captcha(fake_img, CaptchaType.TEXT)
                logger.info(f"Fake CAPTCHA solved: {solution}")
            return  # Exit early

        # Wait for search results container
        try:
            await page.wait_for_selector("div#search", timeout=10000)
        except:
            logger.warning("Selector 'div#search' not found – page structure may have changed")

        html = await page.content()
        selector = Selector(html)
        
        captcha_retries = 0
        while captcha_retries < 3:
            captcha_info = await detect_captcha(page)
            if not captcha_info:
                break
            captcha_type, selector = captcha_info
            if on_captcha:
                solved = await solve_captcha_interactive(page, captcha_type, selector, on_captcha)
                if solved:
                    await page.wait_for_timeout(3000)  # wait for reload
                    captcha_retries += 1
                    continue
            else:
                logger.warning("CAPTCHA detected but no solver provided")
                return

        # Extract result blocks – common Google selectors
        result_blocks = selector.css("div.g")
        if not result_blocks:
            # Fallback selectors
            result_blocks = selector.xpath("//div[.//h3][.//a]")
            logger.info(f"Found {len(result_blocks)} via fallback XPath")

        if not result_blocks:
            logger.warning("No search result containers found")
            return

        rank = 0
        for result in result_blocks:
            if stop_flag and stop_flag.get("stop"):
                break
            if results_yielded >= max_results:
                break

            title_elem = result.css("h3")
            if not title_elem:
                continue
            title = title_elem.css("::text").get()
            if not title:
                continue

            # Extract URL from the first <a> that looks like a real link
            url = None
            for a in result.css("a"):
                href = a.attrib.get("href")
                if href and href.startswith("/url?q="):
                    url = urllib.parse.unquote(href.split("/url?q=")[1].split("&")[0])
                    break
                elif href and href.startswith("http") and not href.startswith("https://www.google."):
                    url = href
                    break

            if not url or url in seen_urls:
                continue
            seen_urls.add(url)

            # Extract snippet / description
            snippet = ""
            snippet_candidates = result.css(".VwiC3b, .IsZvec, .st, .MUxGbd, .yDYNvb, .lEBKkf")
            if snippet_candidates:
                snippet = " ".join(snippet_candidates.css("::text").getall()).strip()
            else:
                # Fallback: collect all text except the title
                all_text = result.css("::text").getall()
                if all_text:
                    # remove title from text if present
                    filtered = [t.strip() for t in all_text if t.strip() and t.strip() != title]
                    snippet = " ".join(filtered)

            rank += 1
            results_yielded += 1

            yield {
                "title": title,
                "url": url,
                "snippet": snippet[:500],  # limit length
                "rank": rank
            }

        logger.info(f"Search completed: {results_yielded} results")

    except Exception as e:
        logger.error(f"Error during web search: {e}", exc_info=True)
        # Optionally take a screenshot for debugging
        # if 'page' in locals():
        #     await page.screenshot(path="error.png")
        raise
    finally:
        await playwright_manager.stop_browser()


# -------------------------------------------------------------------
# Legacy function kept for backward compatibility (not used by new API)
# -------------------------------------------------------------------
async def scrape_lead_by_industry(*args, **kwargs):
    """Deprecated: kept for existing code that may still import it."""
    logger.warning("scrape_lead_by_industry is deprecated. Use general_web_search instead.")
    # If you still need the old logic, you can re-implement it here,
    # but for a clean general search API it's not required.
    raise NotImplementedError("This function is no longer supported. Use general_web_search.")