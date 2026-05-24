# 🍽️ Foodie - Restaurant Menu Discovery & Ordering Platform

**Foodie** is a mobile-first React + Vite web application that enables customers to discover restaurant menus and place orders through an intelligent chatbot interface. Perfect for table service in restaurants, cafes, and bars with QR code integration.

## 🎯 Core Features

### For Customers
- **Intelligent Menu Chat**: Natural language search for menu items by category or dish name
- **Interactive Ordering**: Add items to cart with quantity management
- **Table-Based Ordering**: Scan QR code at table, view restaurant details, and place orders
- **Order Management**: View, modify, and manage orders with a sliding drawer interface
- **Mobile-Optimized UI**: Fully responsive design built for mobile-first experience

### For Restaurants
- **Restaurant Onboarding**: Guided setup to add restaurant details
- **Menu Management**: Manage categories and menu items with veggie indicators (Veg/Non-Veg)
- **QR Code Generator**: Create table-specific QR codes linking to the ordering interface
- **Dashboard**: Central admin interface for restaurant management

## 🏗️ Project Architecture

```
src/
├── pages/
│   ├── HomePage.jsx              # Admin dashboard home
│   ├── RestaurantOnboarding.jsx   # Restaurant registration flow
│   ├── RestaurantChatPage.jsx     # Main customer ordering interface ⭐
│   ├── CategoriesPage.jsx         # Category management
│   ├── AdminLayout.jsx            # Admin dashboard layout
│   ├── QRGenerator.jsx            # QR code creation for tables
│   └── RestaurantPage.jsx         # Restaurant detail view
├── components/
│   ├── ChatHeader.jsx             # Fixed header with restaurant info
│   ├── OrderDrawer.jsx            # Sliding order management panel
│   ├── Table.jsx                  # Data display component
│   ├── Sidebar.jsx                # Admin navigation
│   ├── Field.jsx                  # Form field component
│   ├── onboarding-restaurant/     # Stepper form components
│   ├── restaurant-detail/         # Menu display components
│   └── ui/Button.jsx              # Reusable button component
├── api/
│   ├── axiosInstance.js           # Axios configuration
│   ├── restaurantApi.js           # Restaurant endpoints
│   ├── menuItemApi.js             # Menu item endpoints
│   └── categoryApi.js             # Category endpoints
├── utils/
│   ├── orderStorage.js            # LocalStorage order persistence
│   └── restaurantChat.js          # NLP utilities for menu search
└── constants.js                   # App-wide constants
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repo-url>
cd foodie_fe

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build

# Preview production build
npm run preview
```

## 📱 Mobile-First Design

This project is optimized for mobile browsers with:

- **Fixed Layout**: Header fixed at top, input bar fixed at bottom
- **Scrollable Content**: Only the middle chat area scrolls
- **Responsive Viewport**: Adapts to dynamic mobile address bar height
- **No Horizontal Overflow**: Properly constrained widths prevent pinch-to-zoom
- **Touch-Optimized**: Large touch targets, smooth scrolling with `-webkit-overflow-scrolling`
- **Safe Area Handling**: Respects notches and safe areas on modern devices

## 🔑 Key Technologies

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client for APIs |
| **Formik + Yup** | Form management & validation |
| **Fuse.js** | Fuzzy search for menu items |
| **Lucide React** | Icon library |
| **React QR Code** | QR code generation |

## 💡 Core Workflows

### Customer Flow
1. Scan QR code at restaurant table
2. View restaurant name and table number in header
3. Chat with bot to find menu items (e.g., "Show me appetizers" or "I want pizza")
4. Browse categorized menu items with images, descriptions, and prices
5. Add items to order with quantity adjustment
6. View order summary in drawer
7. Submit order for restaurant preparation

### Admin Flow
1. Dashboard home with quick actions
2. Onboard new restaurant with details (name, contact, cuisine type)
3. Manage menu categories
4. Add menu items with images, prices, and veg/non-veg indicators
5. Generate table-specific QR codes

## 🎨 Features Breakdown

### Smart Menu Search
- Handles typos and variations (e.g., "chickn" → "chicken")
- Natural language intent detection (category vs. specific item)
- Fuzzy matching with Fuse.js for approximate searches
- Category matching with common word removal

### Persistent Order Management
- Orders stored per restaurant and table in localStorage
- Quantity increment/decrement with auto-cleanup
- Order summary visible in header badge
- Drawer sidebar for detailed order review

### Responsive Components
- **ChatHeader**: Fixed, shows restaurant name, table number, order count
- **OrderDrawer**: Sliding panel from side with order details and controls
- **Table.jsx**: Reusable table for admin views
- **Field.jsx**: Flexible form field with validation display

## 🔌 API Endpoints Used

```javascript
// Restaurants
GET  /api/restaurants/:id           // Get restaurant details with categories
POST /api/restaurants               // Create new restaurant

// Menu Items
GET  /api/menu-items/category/:id   // Get items by category
POST /api/menu-items/search         // Search items by text

// Categories
GET  /api/categories                // List all categories
POST /api/categories                // Create category
```

## ⚙️ Configuration

### Environment Variables
Create `.env` file (not included):
```
VITE_API_BASE_URL=http://localhost:3001/api
```

### Viewport Meta Tag
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
```

## 📊 CSS Architecture

- **Mobile-First Approach**: All styles default to mobile, scale up for desktop
- **No Max-Width Constraints**: Fills available screen real estate
- **Flexbox Layouts**: Primary layout method for responsiveness
- **Smooth Scrolling**: `-webkit-overflow-scrolling: touch` for momentum
- **Fixed Positioning**: For header/footer with absolute positioning for middle content

## 🐛 Troubleshooting

### Horizontal Scroll on Mobile
- Ensure all components use `maxWidth: 100%` and `boxSizing: border-box`
- Check that parent containers don't overflow viewport

### Keyboard Overlap
- Middle section has `bottom: calc(76px + env(safe-area-inset-bottom))`
- Input bar uses `position: fixed` to stay above keyboard

### Chat Not Scrolling
- Verify `middle` section has `overflow: hidden` and `chat` has `overflowY: auto`
- Check `minHeight: 0` on flex child

## 📝 Scripts

```bash
npm run dev       # Start dev server with HMR
npm run build     # Production build to dist/
npm run lint      # ESLint check
npm run preview   # Preview production build locally
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy from root directory
# vercel.json already configured
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📄 License

Proprietary - Foodie Platform

## 👥 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📞 Support

For issues or questions, contact the development team or open an issue in the repository.
