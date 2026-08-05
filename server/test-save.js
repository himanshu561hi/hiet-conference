require('dotenv').config();
const mongoose = require('mongoose');
const registrationService = require('./services/registrationService');
const Team = require('./models/Team');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const team = await Team.findOne();
  if(!team) { console.log("No team"); return; }
  
  try {
    const res = await registrationService.saveDetails(team._id, team.leader, { title: 'Test Title 2' });
    console.log("Success", res);
  } catch(e) {
    console.error("Error saving:", e);
  }
  process.exit(0);
}
run();
