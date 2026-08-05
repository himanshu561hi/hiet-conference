const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const EDITORIAL_MEMBERS = [
  {
    fullName: 'Dr. Ananya Sharma',
    email: 'editor1@hietgroup.org',
    mobile: '9876543210',
    password: 'Editor1@2026',
    role: 'editorial',
    isVerified: true
  },
  {
    fullName: 'Prof. Rajesh Verma',
    email: 'editor2@hietgroup.org',
    mobile: '9876543211',
    password: 'Editor2@2026',
    role: 'editorial',
    isVerified: true
  },
  {
    fullName: 'Dr. Kavita Gupta',
    email: 'editor3@hietgroup.org',
    mobile: '9876543212',
    password: 'Editor3@2026',
    role: 'editorial',
    isVerified: true
  },
  {
    fullName: 'Dr. Pankaj Singh',
    email: 'editor4@hietgroup.org',
    mobile: '9876543213',
    password: 'Editor4@2026',
    role: 'editorial',
    isVerified: true
  },
  {
    fullName: 'Prof. Meenakshi Kumar',
    email: 'editor5@hietgroup.org',
    mobile: '9876543214',
    password: 'Editor5@2026',
    role: 'editorial',
    isVerified: true
  },
  {
    fullName: 'Dr. Sunita Roy',
    email: 'editor6@hietgroup.org',
    mobile: '9876543215',
    password: 'Editor6@2026',
    role: 'editorial',
    isVerified: true
  }
];

async function seedEditorial() {
  try {
    for (const member of EDITORIAL_MEMBERS) {
      let existing = await User.findOne({ email: member.email });
      if (!existing) {
        await User.create(member);
        console.log(`[Editorial Seed] Created member: ${member.email}`);
      } else {
        existing.role = 'editorial';
        existing.fullName = member.fullName;
        existing.isVerified = true;
        await existing.save();
        console.log(`[Editorial Seed] Updated member: ${member.email}`);
      }
    }
  } catch (err) {
    console.error('[Editorial Seed Error]:', err);
  }
}

if (require.main === module) {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexus2026';
  mongoose.connect(mongoURI).then(async () => {
    console.log('Connected to DB for seeding editorial members...');
    await seedEditorial();
    console.log('Editorial seeding completed.');
    process.exit(0);
  }).catch(err => {
    console.error('Database connection failed for seeding:', err);
    process.exit(1);
  });
}

module.exports = seedEditorial;
