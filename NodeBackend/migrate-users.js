const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/agrihelp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const rolePrefixes = {
  'Farmer': 'f',
  'Resource Provider': 'rp',
  'Retailer': 'r',
  'Wholesaler': 'w',
  'Dealer': 'd',
  'Agriculture Expert': 'ae',
  'Government Agencies': 'ga',
  'NGOs': 'ngo',
  'Admin': 'admin'
};

const generateRoleId = async (role, existingUsers) => {
  const prefix = rolePrefixes[role] || 'u';
  
  // Find the highest existing number for this role
  const roleUsers = existingUsers.filter(user => user.role === role);
  
  if (roleUsers.length === 0) {
    return `${prefix}1`;
  }
  
  const roleIds = roleUsers
    .map(user => user.roleId)
    .filter(id => id && id.startsWith(prefix))
    .map(id => parseInt(id.replace(prefix, '')) || 0);

  const maxNumber = roleIds.length > 0 ? Math.max(...roleIds) : 0;
  return `${prefix}${maxNumber + 1}`;
};

const migrateUsers = async () => {
  try {
    console.log('Starting user migration...');
    
    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);
    
    if (users.length === 0) {
      console.log('No users found in the database');
      process.exit(0);
    }

    // Group users by role for logging
    const usersByRole = {};
    users.forEach(user => {
      if (!usersByRole[user.role]) {
        usersByRole[user.role] = [];
      }
      usersByRole[user.role].push(user);
    });

    console.log('\nUsers by role:');
    Object.entries(usersByRole).forEach(([role, users]) => {
      console.log(`${role}: ${users.length} users`);
    });
    
    // Update each user with a roleId
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of users) {
      try {
        if (!user.roleId) {
          const roleId = await generateRoleId(user.role, users);
          user.roleId = roleId;
          await user.save();
          console.log(`✅ Updated user ${user.email} with roleId: ${roleId}`);
          updated++;
        } else {
          console.log(`⏭️  Skipped user ${user.email} - already has roleId: ${user.roleId}`);
          skipped++;
        }
      } catch (error) {
        console.error(`❌ Error updating user ${user.email}:`, error.message);
        errors++;
      }
    }
    
    console.log('\nMigration Summary:');
    console.log(`Total users: ${users.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}`);
    
    if (errors > 0) {
      console.log('\n⚠️  Migration completed with errors');
      process.exit(1);
    } else {
      console.log('\n✅ Migration completed successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Handle connection errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

migrateUsers(); 