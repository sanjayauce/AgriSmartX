# Role-Based User ID System and Enhanced Admin Messaging

## Overview

This update introduces a unique role-based ID system for users and enhances the admin messaging functionality with targeted user selection.

## New Features

### 1. Role-Based User IDs

Each user now gets a unique ID based on their role:
- **Farmer**: f1, f2, f3, ...
- **Resource Provider**: rp1, rp2, rp3, ...
- **Retailer**: r1, r2, r3, ...
- **Wholesaler**: w1, w2, w3, ...
- **Dealer**: d1, d2, d3, ...
- **Agriculture Expert**: ae1, ae2, ae3, ...
- **Government Agencies**: ga1, ga2, ga3, ...
- **NGOs**: ngo1, ngo2, ngo3, ...
- **Admin**: admin1, admin2, admin3, ...

### 2. Enhanced Admin Messaging

The admin can now:
- Select specific roles to send messages to
- View all users within selected roles
- Select specific users for targeted messaging
- Send messages to all users in a role or specific users only

## Database Changes

### User Model Updates
- Added `roleId` field (unique, required)
- Added `createdAt` field (default: Date.now)

### AdminMessage Model Updates
- Added `targetUsers` field (array of user IDs for targeted messaging)

## API Endpoints

### New Endpoints

#### GET /api/admin/users-by-role
Fetches all users for a specific role.

**Query Parameters:**
- `role` (required): The role to fetch users for

**Response:**
```json
{
  "users": [
    {
      "id": "user_id",
      "email": "user@example.com",
      "roleId": "f1",
      "role": "Farmer",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Updated Endpoints

#### POST /api/admin/send-message
Now supports targeted messaging.

**Request Body:**
```json
{
  "subject": "Message Subject",
  "message": "Message content",
  "roles": ["Farmer", "Retailer"],
  "targetUsers": ["user_id_1", "user_id_2"] // Optional: specific users
}
```

#### GET /api/admin/getMessages
Now supports user-specific message filtering.

**Query Parameters:**
- `role` (required): User's role
- `userId` (optional): User's ID for targeted message filtering

## Migration

To update existing users with role IDs, run:

```bash
cd NodeBackend
node migrate-users.js
```

This script will:
1. Connect to the MongoDB database
2. Find all existing users
3. Generate unique role IDs for each user
4. Update the database

## Frontend Changes

### Admin Messages Page
- Added role-based user selection
- Shows user count per role
- Allows selecting/deselecting all users for a role
- Displays user email, role ID, and registration date
- Supports targeted messaging

### User Message Pages
- Updated to pass user ID when fetching messages
- Users now see messages specifically sent to them or to their role

## Usage Examples

### Creating a New User
When a user signs up, they automatically get a unique role ID:
- First farmer: f1
- Second farmer: f2
- First resource provider: rp1
- etc.

### Sending Admin Messages
1. **To all users in a role**: Select role only, don't select specific users
2. **To specific users**: Select role and then check specific users
3. **To multiple roles**: Select multiple roles and optionally specific users from each

### Viewing Messages as User
Users will see:
- Messages sent to their role (if no specific users targeted)
- Messages specifically sent to them (if they were in targetUsers)

## Security Notes

- Role IDs are unique across the system
- Users can only see messages intended for their role or specifically for them
- Admin can see all users but can only send messages to selected roles/users 