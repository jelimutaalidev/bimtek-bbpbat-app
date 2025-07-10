const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database for seeding');
  }
});

const seedData = async () => {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    db.run(
      'INSERT OR IGNORE INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)',
      ['admin@conference.com', adminPassword, 'System Administrator', 'admin'],
      function(err) {
        if (err) {
          console.error('Error creating admin user:', err.message);
        } else {
          console.log('Admin user created successfully');
        }
      }
    );

    // Create sample announcements
    const announcements = [
      {
        title: 'Welcome to the Conference Management System',
        content: 'We are excited to have you join our conference. Please complete your registration and upload any required documents.',
        priority: 'high'
      },
      {
        title: 'Registration Deadline Reminder',
        content: 'Please remember that the registration deadline is approaching. Make sure to submit all required information.',
        priority: 'normal'
      }
    ];

    announcements.forEach((announcement, index) => {
      db.run(
        'INSERT OR IGNORE INTO announcements (title, content, priority, created_by) VALUES (?, ?, ?, ?)',
        [announcement.title, announcement.content, announcement.priority, 1],
        function(err) {
          if (err) {
            console.error(`Error creating announcement ${index + 1}:`, err.message);
          } else {
            console.log(`Announcement ${index + 1} created successfully`);
          }
        }
      );
    });

    setTimeout(() => {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database seeding completed and connection closed');
        }
        process.exit(0);
      });
    }, 1000);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();