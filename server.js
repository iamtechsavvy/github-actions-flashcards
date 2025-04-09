const express = require('express');
const cors = require('cors');
const { generateJiraContent } = require('./src/config/openai');

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Mock data
let issues = [
  {
    id: 'PROJ-1',
    key: 'PROJ-1',
    fields: {
      summary: 'Implement user authentication',
      description: 'Add user authentication using JWT',
      priority: { name: 'High' },
      status: { name: 'To Do' },
      storyPoints: 5
    }
  }
];

// Generate JIRA content using OpenAI
app.post('/api/generate-content', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const generatedContent = await generateJiraContent(prompt);
    res.json({ content: generatedContent });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Get all issues
app.get('/api/jira/issues', (req, res) => {
  res.json(issues);
});

// Get specific issue
app.get('/api/jira/issues/:issueId', (req, res) => {
  const issue = issues.find(i => i.id === req.params.issueId);
  if (issue) {
    res.json(issue);
  } else {
    res.status(404).json({ error: 'Issue not found' });
  }
});

// Search issues
app.get('/api/jira/search', (req, res) => {
  const query = req.query.jql?.toLowerCase() || '';
  const filteredIssues = issues.filter(issue => 
    issue.fields.summary.toLowerCase().includes(query) ||
    issue.fields.description.toLowerCase().includes(query)
  );
  res.json(filteredIssues);
});

// Create new issue
app.post('/api/jira/issues', (req, res) => {
  const newIssue = {
    id: `PROJ-${issues.length + 1}`,
    key: `PROJ-${issues.length + 1}`,
    fields: {
      ...req.body,
      status: { name: 'To Do' }
    }
  };
  issues.push(newIssue);
  res.status(201).json(newIssue);
});

// Get project details
app.get('/api/jira/project', (req, res) => {
  res.json({
    id: 'PROJ',
    key: 'PROJ',
    name: 'Sample Project',
    description: 'A sample project for demonstration'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`Mock Jira server running on port ${port}`);
  console.log('Available endpoints:');
  console.log('GET /api/jira/issues - List all issues');
  console.log('GET /api/jira/issues/:issueId - Get specific issue');
  console.log('GET /api/jira/search?jql=query - Search issues');
  console.log('POST /api/jira/issues - Create new issue');
  console.log('GET /api/jira/project - Get project details');
  console.log('POST /api/generate-content - Generate content using OpenAI');
}); 