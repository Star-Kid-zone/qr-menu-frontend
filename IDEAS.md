# 💡 Feature Ideas & Roadmap (30 High-Impact Proposals)

> **Design & Architecture Philosophy:**
> - **Zero invasive permissions** (No GPS location prompts, Bluetooth, or WiFi sniffing required from guests).
> - **Zero spoofing/spam vulnerability** (Guarded against external misuse and abuse).
> - **Zero friction** (Instant browser load, clean modern POS/hospitality utility).

---

## 🥗 1. Guest Menu Experience & Usability (Frictionless)

### 1. Dietary & Allergen 1-Tap Filter Pills
- **Description:** Guests can tap filter pills (`Vegetarian 🌱`, `Vegan 🌿`, `Gluten-Free 🌾`, `Halal 🌙`, `Nut-Free 🥜`, `Dairy-Free 🥛`) to instantly filter the menu.
- **Use Case:** Customers with specific food allergies or dietary lifestyles can browse safely without asking the waiter about every dish.
- **Implementation:** Array of allergen/dietary tags in the menu item schema + client-side filter array in the guest menu view.

### 2. Interactive Spiciness Indicator
- **Description:** Visual chili rating system (`🌶️ Mild`, `🌶️🌶️ Medium`, `🌶️🌶️🌶️ Hot`, `🌶️🌶️🌶️🌶️ Fiery`).
- **Use Case:** Prevents guest dissatisfaction from dishes being too spicy or not spicy enough.
- **Implementation:** Number field `spiceLevel: 0 | 1 | 2 | 3 | 4` in menu item model.

### 3. "Chef's Recommendation" & "Signature Dish" Badges
- **Description:** Highlight ribbons for high-margin or flagship dishes (e.g. `✦ Chef's Pick`, `👑 Signature`).
- **Use Case:** Guides indecisive diners directly to the restaurant's best food, increasing order volume of top-margin items.
- **Implementation:** Boolean flag `isSignature` / `isChefSpecial` in menu item schema.

### 4. Calorie & Nutritional Macro Tags
- **Description:** Optional calorie count (`e.g. 450 kcal`) and protein/carb/fat tags (`Protein: 28g`).
- **Use Case:** Essential for health-focused cafes, salad bars, gym-adjacent eateries, and diet-conscious customers.
- **Implementation:** Optional object field `nutrition: { calories?: number, protein?: string, carbs?: string }`.

### 5. Portion & Size Variants with Dynamic Price Display
- **Description:** Size/portion switch (`Half / Full`, `Regular / Large`, `250g / 500g`, `Single / Double Shot`) that updates the displayed price instantly.
- **Use Case:** Eliminates the need to create duplicate menu items for different portion sizes.
- **Implementation:** Array of variant objects `variants: [{ name: "Half", price: 8 }, { name: "Full", price: 14 }]`.

### 6. High-Res Dish Photo Modal / Lightbox
- **Description:** Tapping any food photo opens a crisp, full-screen lightbox preview.
- **Use Case:** Guests can inspect the exact plating, ingredients, and presentation before placing their order.
- **Implementation:** Client-side lightbox modal with Next.js image optimization.

---

## 💳 2. Bill Calculation, Splitting & Payments

### 7. Client-Side "Bill Estimator / Total Calculator"
- **Description:** A personal floating tray where guests can tap `+` on dishes to tally their expected total with subtotal, tax/VAT, and service charge.
- **Use Case:** Diners know their exact bill before the waiter arrives, eliminating bill surprises.
- **Implementation:** Pure client-side React state stored in memory or `sessionStorage` (zero backend order state required).

### 8. 1-Tap "Split the Bill" Calculator
- **Description:** Inside the bill estimator, diners enter the party size (e.g. 4 people) to immediately see the per-person amount.
- **Use Case:** Solves the awkward math at group dinners, team lunches, and family parties.
- **Implementation:** Simple math formula `(totalAmount / splitCount).toFixed(2)` inside the calculator modal.

### 9. Preset Tip / Gratuity Selector
- **Description:** Quick tip chips (`5%`, `10%`, `15%`, `Custom`) displayed on the payment step or payment link redirect.
- **Use Case:** Significantly boosts tips and gratuities collected for the restaurant staff.
- **Implementation:** Dynamic calculation passed to payment URL or QR payment description.

### 10. Secondary Currency Display (Dual-Currency Mode)
- **Description:** Shows prices in both local currency and a secondary tourist currency (e.g. `THB 350 (~ $9.50 USD)`).
- **Use Case:** High-value utility for tourist destinations, airports, and hotels with international travelers.
- **Implementation:** Admin-configured secondary currency + fixed exchange rate multiplier.

### 11. Direct UPI / Bank Transfer Deep Linking
- **Description:** For regions supporting UPI / instant bank links (India, Southeast Asia, Europe), tapping the link triggers the native banking app directly.
- **Use Case:** Reduces payment drop-offs by skipping manual QR scanning or copying bank numbers.
- **Implementation:** Standardized URI schemes (`upi://pay?...` or bank deep link schemes).

---

## 📦 3. Admin Catalog & Menu Onboarding Efficiency

### 12. Bulk Menu Import via Excel / CSV
- **Description:** Drag-and-drop `.xlsx` or `.csv` spreadsheet import with automatic column mapping (`Name, Category, Price, Description, Type`).
- **Use Case:** Cuts down restaurant onboarding time from 2 hours to 10 seconds.
- **Implementation:** Client-side parsing via `xlsx` library with schema validation before submitting to API.

### 13. 1-Click Menu Item Cloning
- **Description:** Duplicate any existing menu item to quickly build variations without retyping details.
- **Use Case:** Creating multiple pizza toppings, burger variations, or beverage flavors quickly.
- **Implementation:** Admin action button copying existing item data into a new creation payload.

### 14. Drag-and-Drop Category Reordering
- **Description:** Intuitive drag handles in the admin panel to order categories (e.g. `Starters` -> `Mains` -> `Desserts` -> `Drinks`).
- **Use Case:** Restaurants frequently change seasonal menu flow or prioritize high-margin sections at the top.
- **Implementation:** `order` integer on category records + `@dnd-kit` or lightweight drag-and-drop list.

### 15. Smart Bulk Price Adjuster
- **Description:** Adjust all prices across a category or the whole store by a percentage (e.g. *"+5% across all Beverages"*).
- **Use Case:** Handling inflation, ingredient cost changes, or seasonal price updates across 100+ items in seconds.
- **Implementation:** Admin modal calculating updated prices with preview before batch database update.

### 16. Temporary "Sold Out for Today" Toggle
- **Description:** A 1-tap quick toggle on menu cards to mark dishes as sold out for the day without deleting or editing the record.
- **Use Case:** Floor staff can instantly hide finished daily specials in 2 seconds during peak service.
- **Implementation:** Boolean `isSoldOut` or `availability: false` with dedicated quick-action switch.

---

## 🖨️ 4. Physical Print & Offline Marketing Assets

### 17. Print-Ready Table Tent (A6 / A5) PDF Exporter
- **Description:** Generates vector-quality, ready-to-print table tent PDFs with the restaurant's logo, branding color, QR code, and slogan.
- **Use Case:** Owners can download and send the file directly to any local printer or print on office paper immediately.
- **Implementation:** Client-side PDF generation using `jsPDF` or SVG canvas rendering.

### 18. Branded Sticker Sheet Exporter
- **Description:** Generates a printable grid of square/circular QR stickers for packaging, cup sleeves, and takeaway boxes.
- **Use Case:** Extends digital menu and review reach to delivery and takeaway customers.
- **Implementation:** Multi-cell grid layout PDF exporter.

### 19. Custom QR Center Logo Embedder
- **Description:** Automatically embeds the restaurant's logo right in the center of the generated QR code.
- **Use Case:** Makes the physical QR look custom, branded, and trustworthy compared to generic black-and-white codes.
- **Implementation:** QR code generator with Error Correction Level H (30% recovery) + centered canvas draw.

### 20. Brand-Colorized QR Codes
- **Description:** Customizes the QR code dark modules and eye frames to match the workspace's primary theme color.
- **Use Case:** High visual consistency with the restaurant's physical brand design.
- **Implementation:** Parameterized foreground color in QR generator canvas/SVG.

### 21. Wi-Fi QR Code Block on Landing Page
- **Description:** Admin inputs guest Wi-Fi SSID and Password; landing page displays a standard Wi-Fi QR code (`WIFI:S:...;T:...;P:...;;`).
- **Use Case:** Guests scan once to join the restaurant Wi-Fi without typing complicated passwords.
- **Implementation:** Standard Wi-Fi URI format rendered in an expandable card.

---

## 🚀 5. Social Sharing, SEO & Marketing

### 22. Automated Schema.org / JSON-LD Restaurant Menu Markup
- **Description:** Injects structured `Menu`, `MenuItem`, and `Restaurant` JSON-LD metadata into public pages.
- **Use Case:** Allows Google Search to crawl dishes and display prices directly in Google Search results and Google Maps.
- **Implementation:** `<script type="application/ld+json">` tag dynamically built from workspace & menu database.

### 23. Dynamic OpenGraph / Social Share Cards
- **Description:** Dynamically generates preview images when sharing store links on WhatsApp, Instagram, or Facebook.
- **Use Case:** Professional presentation when customers or influencers share the restaurant's link on social media.
- **Implementation:** Next.js `@vercel/og` or dynamic OpenGraph meta tag generator.

### 24. "Share This Dish" Native Web Share
- **Description:** A share icon on each dish card triggering `navigator.share({ title, url: "/{slug}#dish-id" })`.
- **Use Case:** Customers can easily recommend specific dishes to friends and family in WhatsApp chats.
- **Implementation:** Native browser Web Share API with clipboard fallback.

### 25. Social & Delivery Aggregator Bar
- **Description:** Configurable button bar linking to **Instagram, TikTok, Google Maps, UberEats, DoorDash, Swiggy, TripAdvisor**.
- **Use Case:** Unifies all digital footprints in one place for guests browsing the public landing page.
- **Implementation:** Dynamic link list configured in the admin workspace profile.

### 26. 1-Tap Google Maps Directions Button
- **Description:** Universal button opening `https://maps.google.com/?q={encodedAddress}` in Google Maps / Apple Maps.
- **Use Case:** Allows new guests browsing online to navigate to the store in 1 click.
- **Implementation:** Dynamic URL string constructor based on the store's physical address.

---

## ⚙️ 6. Operations, Speed & Multi-Tenancy

### 27. Zero-Signal Offline Caching (PWA Service Worker)
- **Description:** Service Worker caches menu data and dish photos upon first load.
- **Use Case:** If a diner is seated in a basement or area with poor reception, the menu remains fast, fluid, and browseable.
- **Implementation:** Workbox or lightweight Service Worker caching `GET` requests for menu data and images.

### 28. Live Business Hours & "Open Now / Closed" Status
- **Description:** Admin sets weekly opening hours; the guest header displays an active pill: **"Open Now · Closes 11 PM"** or **"Opening Tomorrow at 10 AM"**.
- **Use Case:** Sets accurate guest expectations and prevents customers from visiting during closed hours.
- **Implementation:** Time-check utility comparing client/store timezone against the opening schedule matrix.

### 29. Time-Sensitive Announcement Pop-up / Marquee
- **Description:** Toggleable banner for urgent announcements (e.g. *"Closed for Private Event Tonight"*, *"Weekend Live Music 8 PM"*).
- **Use Case:** Instantly informs all visiting diners about special events, holidays, or emergency closures.
- **Implementation:** Modal dialog or top marquee tied to workspace announcement state.

### 30. Low-Bandwidth "Data Saver / Text Only" Mode
- **Description:** A toggle on the public menu that collapses photos into a clean, text-only compact list.
- **Use Case:** Lifesaver for international tourists on expensive data roaming or customers with weak 3G signals.
- **Implementation:** Simple state toggle hiding image elements and expanding typography.

---

## 📊 Summary Prioritization Matrix

| Feature | Category | Implementation Effort | Value Impact |
| :--- | :--- | :--- | :--- |
| **Dietary & Allergen Filtering** | Menu Experience | Low | High |
| **Spiciness Level & Signature Badges** | Menu Experience | Low | Medium-High |
| **Bill Estimator & Split Calculator** | Bill & Pay | Low | High |
| **Excel / CSV Bulk Menu Import** | Admin Efficiency | Medium | Critical |
| **1-Tap "Sold Out Today" Switch** | Operations | Low | High |
| **Print-Ready Table Tent PDF Generator** | Print Assets | Medium | High |
| **Branded QR Center Logo & Color** | Print Assets | Low-Medium | High |
| **Schema.org Menu JSON-LD (SEO)** | Marketing & SEO | Low | High |
| **Offline PWA Service Worker** | Reliability | Low-Medium | High |
| **Live Business Hours Status** | Operations | Low | Medium-High |
