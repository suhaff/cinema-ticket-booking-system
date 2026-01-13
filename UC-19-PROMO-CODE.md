# UC-19: Apply Promo Code Implementation

## Overview

This feature allows users to apply discount promo codes during the booking process, reducing the total price based on percentage or fixed amount discounts.

## Database Setup

Run the SQL script to create test promo codes:

```bash
mysql -u root -p cinema < backend/test-promo-codes.sql
```

Or manually connect to MySQL and run the script:

```sql
mysql -u root -p
use cinema;
source backend/test-promo-codes.sql;
```

## Test Promo Codes

### Valid Codes

- **SAVE10** - 10% off (expires in 3 months, 100 uses max)
- **WELCOME20** - 20% off (expires in 6 months, 50 uses max)
- **MOVIE5** - €5 off fixed (expires in 2 months, 200 uses max)
- **CINEMA3** - €3 off fixed (expires in 1 month, 500 uses max)

### Invalid Codes (for testing)

- **EXPIRED** - Expired promo code (should fail validation)
- **INACTIVE** - Inactive promo code (should fail validation)

## Backend Implementation

### New Components

1. **PromoCode Entity** (`backend/src/main/java/com/cinema/backend/models/PromoCode.java`)

   - Fields: code, discountType, discountValue, expiryDate, usageLimit, usedCount, active
   - Methods: `isValid()` - validates active status, expiry, usage limits
   - Methods: `incrementUsage()` - tracks usage count

2. **PromoCodeRepository** (`backend/src/main/java/com/cinema/backend/repositories/PromoCodeRepository.java`)

   - `findByCode(String code)` - Find promo by code
   - `findByCodeAndActiveTrue(String code)` - Find active promos only

3. **PromoCodeController** (`backend/src/main/java/com/cinema/backend/controllers/PromoCodeController.java`)
   - `POST /api/v1/promo-code/validate` - Validate promo code and return discount details
   - `GET /api/v1/promo-code/{code}` - Get promo code details
   - `POST /api/v1/promo-code` - Create new promo code (admin only)

### Modified Components

**OrderController** (`backend/src/main/java/com/cinema/backend/controllers/OrderController.java`)

- Updated `newOrder()` to accept promo code via userName field (temporary solution)
- Validates promo code before applying discount
- Calculates discount based on type (PERCENTAGE or FIXED_AMOUNT)
- Passes discount to `calculatePriceBreakdown()`
- Increments promo usage count after successful order creation

## Frontend Implementation

### New Components

**ValidatePromoCode API** (`frontend/src/API/ValidatePromoCode.js`)

- Calls `POST /api/v1/promo-code/validate` endpoint
- Returns validation result with discount details

### Modified Components

**SeatPlan Component** (`frontend/src/components/SeatPlan.js`)

- Added promo code input field
- Apply/Remove button for promo codes
- Success/error message display
- Updated price breakdown to show discount line
- Passes promo code to backend via userName field

## Price Calculation Flow

### Without Promo Code

```
Subtotal: €10 × 2 seats = €20.00
Booking Fee (10%): €2.00
Tax (10%): €2.20
Total: €24.20
```

### With SAVE10 (10% off)

```
Subtotal: €20.00
Booking Fee (10%): €2.00
Tax (10%): €2.20
Discount (SAVE10): -€2.00
Total: €22.20
```

### With MOVIE5 (€5 off)

```
Subtotal: €20.00
Booking Fee (10%): €2.00
Tax (10%): €2.20
Discount (MOVIE5): -€5.00
Total: €19.20
```

## API Endpoints

### Validate Promo Code

```http
POST /api/v1/promo-code/validate
Content-Type: application/json

{
  "code": "SAVE10"
}
```

**Success Response (200)**

```json
{
  "code": "SAVE10",
  "discountType": "PERCENTAGE",
  "discountValue": 10.0,
  "description": "10% off your booking"
}
```

**Error Response (400)**

```json
{
  "message": "Promo code has expired"
}
```

## Testing Steps

1. **Start Backend**

   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Insert Test Promo Codes**

   ```bash
   mysql -u root -p cinema < test-promo-codes.sql
   ```

3. **Start Frontend**

   ```bash
   cd frontend
   npm start
   ```

4. **Test Valid Promo Code**

   - Navigate to movie details
   - Select seats
   - Enter "SAVE10" in promo code field
   - Click "Apply"
   - Verify discount is applied in price breakdown
   - Complete booking and verify discount in confirmation

5. **Test Invalid Promo Code**

   - Try "EXPIRED" - should show "Promo code has expired"
   - Try "INACTIVE" - should show "Invalid promo code"
   - Try "INVALID123" - should show "Invalid promo code"

6. **Test Usage Limit**
   - Create a promo with usage_limit = 1
   - Apply and complete booking
   - Try using same code again - should show "Promo code usage limit reached"

## Validation Rules

A promo code is valid if ALL of the following are true:

- ✅ Code exists in database
- ✅ `active = true`
- ✅ `expiry_date > current_date`
- ✅ `used_count < usage_limit`

## Known Limitations

1. **Temporary Implementation**: Promo code is passed via userName field with "PROMO:" prefix
   - Future improvement: Add dedicated promoCode field to Order entity
2. **Usage Tracking**: Usage count increments after order creation, not payment

   - Unpaid orders still increment the counter
   - Future improvement: Only increment on successful payment

3. **No User-Specific Codes**: Current implementation allows any user to use any code
   - Future improvement: Add user eligibility checks (e.g., new customers only)

## Future Enhancements

- [ ] Add dedicated promoCode field to Order/OrderDTO
- [ ] Increment usage only on successful payment
- [ ] User-specific promo codes (one-time use per user)
- [ ] Minimum order value requirements
- [ ] Admin panel to manage promo codes
- [ ] Promo code analytics (usage statistics, revenue impact)
- [ ] Multiple promo codes per order
- [ ] Category-specific promo codes (specific movies/genres)
