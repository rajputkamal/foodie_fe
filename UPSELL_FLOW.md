UPSell Flow (client-side upsell engine)

Goal
- Provide a consistent upsell experience across restaurants using only API-provided categories and menu items.
- Keep upsell decisioning on the client; server only provides categories and menu items for each restaurant.

Assumptions
- API returns for each restaurant:
  - categories: list of category objects { _id, name }
  - menu items: list of item objects { _id, name, price, categoryId, description, vegType, image }
- Client will fetch categories and menu items upfront or on-demand per restaurant.
- Upsell recommendations are computed client-side using `getUpsellRecommendations(item, restaurantId, restaurantCategories)` which receives the menu data and returns a list of recommended items.

Preface (semantic matching recommendation)

If you want stronger semantics (understanding "show me some tea" vs "show me beverages"), consider:
- Using a small intent classifier (rule-based or ML) to detect beverage vs specific drink intent.
- Using embedding-based similarity (OpenAI/RAG or sentence-transformers) for natural-language category matching across synonyms and longer queries.
- A lightweight alternative to Fuse is FlexSearch (faster, flexible), but for semantic intent embeddings are best.

High-level flow
1. Load restaurant data
   - Fetch `categories` and `menuItems` from API for the current `restaurantId`.
   - Store these in client state: `restaurantCategories`, `menuItems`.

2. User adds an item to cart (`addToOrder(item, options)`) from anywhere in the UI
   - Update `orders` state (cart) to increment qty or add entry.
   - Show brief snackbar confirming add.
   - Unless caller passes `options.suppressUpsell === true`, run upsell engine:
     - Deduplicate using a local `upsellShownFor` set to avoid repeating upsell for same item.
     - Call `getUpsellRecommendations(item, restaurantId, restaurantCategories)` which returns list of recommended `menuItem` objects.
     - If recommendations exist, insert a bot message of type `upsell` with `triggerItem` and `recommendations`.

3. Show Upsell Dialog
   - When latest message is an `upsell` message, set `activeUpsellId` to the `triggerItem` id.
   - `UpsellDialog` receives `open`, `upsellFor`, `items` (recommendations), `orders`, `onAdd`, `onDismiss`.
   - `UpsellDialog` filters out recommendations already present in `orders` (by `_id`/`id`/`name`) and also hides items the user has just added in the dialog.
   - If no visible recommendations remain, dialog is not shown.

4. User selects a recommended item from the dialog
   - `UpsellDialog` calls `onAdd(item)`.
   - Parent handler `handleAddFromUpsell` should call `addToOrder(item, { suppressUpsell: true })` so that adding an upsell item does not trigger a new upsell flow.
   - Replace upsell message with a confirmation bot message and close the dialog.

5. Edge cases and notes
   - Duplicate prevention: `upsellShownFor` prevents repeating upsells for the same trigger item during a session.
   - If menu data changes frequently, revalidate recommendation ids against fetched `menuItems`.
   - For multi-restaurant support, keep `upsellShownFor` scoped to `restaurantId` if desired (e.g., `upsellShownFor[restaurantId]`).
   - All upsell UX decisions (when to show, which items to recommend) live client-side; server just provides canonical menu data.

Implementation checklist
- [x] Fetch and store `categories` and `menuItems` for the restaurant.
- [x] Keep `orders` state in parent and pass to `UpsellDialog` as `orders`.
- [x] `addToOrder(item, { suppressUpsell })` option implemented to avoid cascades.
- [x] `UpsellDialog` hides items already in cart and newly-added items.
- [ ] Consider server-side endpoint for precomputed recommendations if client-side gets too heavy (future improvement).

Security and performance
- Avoid fetching full menu for huge restaurants on initial load; load categories first then request items per category as user navigates.
- Debounce calls to `getUpsellRecommendations` if it's expensive.

"Why client-side?"
- Low-latency UX; client can compute simple co-occurrence rules or lightweight heuristics.
- Simpler iteration during product discovery.

If you want, I can:
- Move `getUpsellRecommendations` into a small worker for heavy computation.
- Add server-side caching for recommendations per restaurant.
