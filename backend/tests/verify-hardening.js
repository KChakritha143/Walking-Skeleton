const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Task = require('../models/Task');
const { validate, registerSchema, createTaskSchema, verifySessionSchema } = require('../middleware/validate');

process.env.JWT_SECRET = 'test_secret_key_1234567890';
process.env.PORT = 5002;

async function runTests() {
  console.log('=== STARTING SECURITY HARDENING & VALIDATION TESTS ===\n');

  try {
    await connectDB();
    console.log('✓ Connected to MongoDB');

    await User.deleteMany({});
    await Task.deleteMany({});

    console.log('\nTesting: Register Validation Schema...');
    const invalidRegReq = {
      body: {
        name: '',
        email: 'invalid-email',
        password: '123'
      }
    };
    
    let responseStatus = null;
    let responseJson = null;
    
    const mockRes = {
      status: function(code) {
        responseStatus = code;
        return this;
      },
      json: function(data) {
        responseJson = data;
        return this;
      }
    };

    const registerValidator = validate(registerSchema);
    registerValidator(invalidRegReq, mockRes, (err) => {
      if (err) throw err;
    });

    if (responseStatus !== 400) {
      throw new Error(`FAIL: Expected registration to fail with 400, got ${responseStatus}`);
    }
    console.log('✓ Success: Registration validation failed with 400 Bad Request');
    console.log('  Validation errors returned:', JSON.stringify(responseJson.errors));

    console.log('\nTesting: Task Creation Validation Schema...');
    const invalidTaskReq = {
      body: {
        title: '', 
        priority: 'critical' 
      }
    };

    responseStatus = null;
    responseJson = null;

    const taskValidator = validate(createTaskSchema);
    taskValidator(invalidTaskReq, mockRes, (err) => {
      if (err) throw err;
    });

    if (responseStatus !== 400) {
      throw new Error(`FAIL: Expected task creation to fail with 400, got ${responseStatus}`);
    }
    console.log('✓ Success: Task validation failed with 400 Bad Request');
    console.log('  Validation errors returned:', JSON.stringify(responseJson.errors));

    console.log('\nTesting: MongoDB Subtask Checklist Saving...');
    const user = new User({
      name: 'Tester',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();

    const task = new Task({
      authorId: user._id,
      title: 'Harden Backend API',
      description: 'Implement Zod schemas and rate limits',
      priority: 'high',
      subtasks: [
        { text: 'Write validation middleware', completed: true },
        { text: 'Add rate limiting configurations', completed: false }
      ]
    });

    await task.save();
    console.log('✓ Success: Saved Task with subtask array to MongoDB!');
    
    const fetchedTask = await Task.findById(task._id);
    if (!fetchedTask.subtasks || fetchedTask.subtasks.length !== 2) {
      throw new Error('FAIL: Subtasks array was not stored correctly.');
    }
    if (fetchedTask.subtasks[0].text !== 'Write validation middleware' || fetchedTask.subtasks[0].completed !== true) {
      throw new Error('FAIL: Subtask attributes did not match saved state.');
    }
    console.log('✓ Verified subtask array retrieval and completed state!');

    console.log('\nTesting: AI suggestion endpoint helper...');
    const aiRoute = require('../routes/ai');
    
    const mockAiReq = {
      user: { id: user._id },
      body: {
        title: 'Complete security audit',
        description: 'Sweep logs and verify rate limit parameters'
      }
    };

    responseStatus = null;
    responseJson = null;

    const suggestHandler = aiRoute.stack.find(layer => layer.route && layer.route.path === '/suggest').route.stack.slice(-1)[0].handle;
    await suggestHandler(mockAiReq, mockRes, (err) => {
      if (err) throw err;
    });
    if (!responseJson || !responseJson.suggestions || responseJson.suggestions.length === 0) {
      throw new Error('FAIL: AI suggest handler did not return any suggestions');
    }
    console.log(`✓ Success: AI suggestions fallback returned ${responseJson.suggestions.length} items:`);
    responseJson.suggestions.forEach(s => console.log(`  - [ ] ${s.text}`));
    console.log('\nALL HARDENING TESTS PASSED SUCCESSFULLY');
  } catch (error) {
    console.error('\n TEST RUN FAILED:', error.stack || error);
  } finally {
    console.log('\nDisconnecting database...');
    await disconnectDB();
    process.exit(0);
  }
}

runTests();
