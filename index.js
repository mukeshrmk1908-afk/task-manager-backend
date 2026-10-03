const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files directory
app.use(express.static(path.join(__dirname, 'public')));

// Path to tasks directory
const filesDir = path.join(__dirname, 'files');

// Ensure 'files' folder exists
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
}

// 1. Home route - Read files directory and render index page
app.get('/', (req, res) => {
    fs.readdir(filesDir, (err, files) => {
        if (err) {
            console.error('Error reading files directory:', err);
            return res.status(500).send('Unable to read files directory');
        }
        // Exclude system files or .gitkeep
        const taskFiles = files.filter(file => !file.startsWith('.gitkeep') && !file.startsWith('.DS_Store'));
        res.render('index', { files: taskFiles });
    });
});

// 2. Create Task route - Save details into a .txt file named after the title
app.post('/create', (req, res) => {
    const rawTitle = req.body.title ? req.body.title.trim() : '';
    // Format filename matching the pattern: removes spaces and appends .txt
    const filename = `${rawTitle.split(' ').join('')}.txt`;
    const details = req.body.details || '';
    const filePath = path.join(filesDir, filename);

    fs.writeFile(filePath, details, 'utf-8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Error creating task file');
        }
        res.redirect('/');
    });
});

// 3. Read Task route - View file contents ("read more")
app.get('/file/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(filesDir, filename);

    fs.readFile(filePath, 'utf-8', (err, filedata) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(404).send('Task file not found');
        }
        res.render('show', { filename: filename, filedata: filedata });
    });
});

// 4. Edit/Rename Task route (GET) - Render edit page
app.get('/edit/:filename', (req, res) => {
    const filename = req.params.filename;
    res.render('edit', { filename: filename });
});

// 5. Edit/Rename Task route (POST) - Rename file
app.post('/edit', (req, res) => {
    const previousFilename = req.body.previous;
    let newFilename = req.body.new ? req.body.new.trim() : '';

    if (!newFilename.endsWith('.txt')) {
        newFilename = `${newFilename.split(' ').join('')}.txt`;
    }

    const previousPath = path.join(filesDir, previousFilename);
    const newPath = path.join(filesDir, newFilename);

    fs.rename(previousPath, newPath, (err) => {
        if (err) {
            console.error('Error renaming file:', err);
            return res.status(500).send('Error renaming file');
        }
        res.redirect('/');
    });
});

// 6. Delete Task route - Remove file
app.post('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(filesDir, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).send('Error deleting task file');
        }
        res.redirect('/');
    });
});

// 7. REST API Endpoints (optional JSON API for testing / external clients)
app.get('/api/tasks', (req, res) => {
    fs.readdir(filesDir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Failed to read tasks' });
        const taskFiles = files.filter(f => !f.startsWith('.gitkeep') && !f.startsWith('.DS_Store'));
        res.json({ success: true, count: taskFiles.length, tasks: taskFiles });
    });
});

app.get('/api/tasks/:filename', (req, res) => {
    const filePath = path.join(filesDir, req.params.filename);
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) return res.status(404).json({ error: 'Task not found' });
        res.json({ success: true, filename: req.params.filename, content: data });
    });
});

app.post('/api/tasks', (req, res) => {
    const rawTitle = req.body.title ? req.body.title.trim() : '';
    const filename = `${rawTitle.split(' ').join('')}.txt`;
    const details = req.body.details || '';
    const filePath = path.join(filesDir, filename);

    fs.writeFile(filePath, details, 'utf-8', (err) => {
        if (err) return res.status(500).json({ error: 'Failed to create task' });
        res.status(201).json({ success: true, filename, details });
    });
});

app.delete('/api/tasks/:filename', (req, res) => {
    const filePath = path.join(filesDir, req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete task' });
        res.json({ success: true, message: 'Task deleted successfully' });
    });
});

// Start Server on Port 9000 (as shown in browser address bar: localhost:9000)
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
