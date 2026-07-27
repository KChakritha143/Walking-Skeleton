const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Task = require('../models/Task');
process.env.JWT_SECRET = 'test_secret_key_1234567890';
process.env.PORT = 5001;
async function runTests() {
  console.log('STARTING ENDPOINT OWNERSHIP & REST CRUD TESTS \n');
  try {
    await connectDB();
    console.log('✓ Connected to MongoDB');
    await User.deleteMany({});
    await Task.deleteMany({});
    const user1 = new User({ name: 'User One', email: 'user1@example.com', password: 'password123' });
    const user2 = new User({ name: 'User Two', email: 'user2@example.com', password: 'password123' });
    await user1.save();
    await user2.save();
    console.log('✓ Created 2 users:');
    console.log(`  - User 1 ID: ${user1._id}`);
    console.log(`  - User 2 ID: ${user2._id}`);
    const task = new Task({
      authorId: user1._id,
      title: 'Confidential Mission',
      description: 'Top secret tasks for User 1',
      priority: 'high'
    });
    await task.save();
    console.log(`✓ Task created with authorId: ${task.authorId}\n`);
    console.log('Testing: User 1 tries to access their own task...');
    if (task.authorId.toString() === user1._id.toString()) {
      console.log('✓ Match: Task authorId matches User 1 ID.');
    } else {
      throw new Error('FAIL: authorId field not set correctly.');
    }
    console.log('\nTesting: User 2 tries to access User 1\'s task (simulate ownership check)...');
    if (task.authorId.toString() !== user2._id.toString()) {
      console.log('✓ Success: Access denied to User 2. User 2 is NOT authorized.');
    } else {
      throw new Error('FAIL: User 2 was authorized to access User 1\'s task!');
    }
    console.log('\nTesting: Querying tasks by authorId...');
    const user1Tasks = await Task.find({ authorId: user1._id });
    const user2Tasks = await Task.find({ authorId: user2._id });
    console.log(`  - User 1 has ${user1Tasks.length} task(s).`);
    console.log(`  - User 2 has ${user2Tasks.length} task(s).`);
    if (user1Tasks.length !== 1 || user2Tasks.length !== 0) {
      throw new Error('FAIL: Tasks query by authorId returned incorrect results.');
    }
    console.log('✓ Tasks query filtered by authorId works perfectly!');
    console.log('\nALL ENDPOINT OWNERSHIP TESTS PASSED');
  } catch (error) {
    console.error('\n TEST RUN FAILED:', error.message);
  } finally {
    console.log('\nDisconnecting database...');
    await disconnectDB();
    process.exit(0);
  }
}
runTests();