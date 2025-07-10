const bcrypt = require('bcryptjs');
const { runQuery, getRow } = require('../config/database');

async function seedData() {
  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminExists = await getRow('SELECT id FROM users WHERE username = ?', ['admin_bbpbat']);
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'AdminBBPBAT2025!', 10);
      
      await runQuery(`
        INSERT INTO users (username, email, password_hash, user_type, is_active, profile_complete, documents_complete)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        'admin_bbpbat',
        'admin@bbpbat.go.id',
        hashedPassword,
        'admin',
        1,
        1,
        1
      ]);
      console.log('✅ Admin user created');
    }

    // Create placement units
    const placementUnits = [
      { name: 'BIOFLOK NILA', description: 'Unit budidaya ikan nila sistem bioflok', student_quota: 10, general_quota: 5 },
      { name: 'PEMBENIHAN KOMET', description: 'Unit pembenihan ikan komet', student_quota: 8, general_quota: 4 },
      { name: 'PEMBENIHAN GURAME', description: 'Unit pembenihan ikan gurame', student_quota: 6, general_quota: 3 },
      { name: 'PEMBENIHAN NILA SULTANA', description: 'Unit pembenihan nila sultana', student_quota: 12, general_quota: 6 },
      { name: 'PEMBENIHAN BAUNG', description: 'Unit pembenihan ikan baung', student_quota: 8, general_quota: 4 },
      { name: 'PEMBENIHAN LELE SANGKURIANG', description: 'Unit pembenihan lele sangkuriang', student_quota: 15, general_quota: 8 },
      { name: 'PEMBENIHAN PATIN', description: 'Unit pembenihan ikan patin', student_quota: 10, general_quota: 5 },
      { name: 'PEMBENIHAN MAS MANTAP', description: 'Unit pembenihan ikan mas mantap', student_quota: 8, general_quota: 4 },
      { name: 'PEMBENIHAN NILEM', description: 'Unit pembenihan ikan nilem', student_quota: 6, general_quota: 3 },
      { name: 'Ikan Wader', description: 'Unit budidaya ikan wader', student_quota: 10, general_quota: 5 },
      { name: 'PEMBENIHAN KOI', description: 'Unit pembenihan ikan koi', student_quota: 12, general_quota: 6 },
      { name: 'PEMBENIHAN MANFISH', description: 'Unit pembenihan ikan manfish', student_quota: 8, general_quota: 4 },
      { name: 'IKAN KOKI', description: 'Unit budidaya ikan koki', student_quota: 6, general_quota: 3 },
      { name: 'PAKAN MANDIRI (BUATAN)', description: 'Unit produksi pakan mandiri', student_quota: 20, general_quota: 10 },
      { name: 'CACING SUTERA', description: 'Unit budidaya cacing sutera', student_quota: 10, general_quota: 5 },
      { name: 'MOINA', description: 'Unit budidaya moina', student_quota: 8, general_quota: 4 },
      { name: 'UDANG GALAH (PELABUHAN RATU)', description: 'Unit budidaya udang galah', student_quota: 6, general_quota: 3 },
      { name: 'LAB KESEHATAN IKAN', description: 'Laboratorium kesehatan ikan', student_quota: 12, general_quota: 6 },
      { name: 'LAB NUTRISI DAN RESIDU', description: 'Laboratorium nutrisi dan residu', student_quota: 10, general_quota: 5 },
      { name: 'LAB KUALITAS AIR', description: 'Laboratorium kualitas air', student_quota: 8, general_quota: 4 },
      { name: 'Pelayanan Publik', description: 'Unit pelayanan publik', student_quota: 15, general_quota: 8 },
      { name: 'Perpustakaan', description: 'Unit perpustakaan', student_quota: 10, general_quota: 5 },
      { name: 'Uji Terap Teknik dan Kerjasama', description: 'Unit uji terap teknik dan kerjasama', student_quota: 8, general_quota: 4 },
      { name: 'Arsip', description: 'Unit arsip', student_quota: 12, general_quota: 6 },
      { name: 'Kepegawaian', description: 'Unit kepegawaian', student_quota: 6, general_quota: 3 },
      { name: 'Koperasi', description: 'Unit koperasi', student_quota: 8, general_quota: 4 },
      { name: 'KODOK LEMBU', description: 'Unit budidaya kodok lembu', student_quota: 10, general_quota: 5 }
    ];

    for (const unit of placementUnits) {
      const exists = await getRow('SELECT id FROM placement_units WHERE name = ?', [unit.name]);
      if (!exists) {
        await runQuery(`
          INSERT INTO placement_units (name, description, student_quota, general_quota)
          VALUES (?, ?, ?, ?)
        `, [unit.name, unit.description, unit.student_quota, unit.general_quota]);
      }
    }
    console.log('✅ Placement units created');

    // Create demo users
    const demoUsers = [
      {
        username: 'pelajar001',
        email: 'pelajar001@demo.com',
        user_type: 'pelajar',
        phone_number: '+62 812 3456 7890',
        institution: 'Universitas Padjadjaran',
        access_code: process.env.DEMO_ACCESS_CODE || 'BBPBAT2025'
      },
      {
        username: 'umum001',
        email: 'umum001@demo.com',
        user_type: 'umum',
        phone_number: '+62 816 7890 1234',
        institution: 'Dinas Perikanan Jawa Barat',
        access_code: process.env.DEMO_ACCESS_CODE || 'BBPBAT2025'
      }
    ];

    for (const user of demoUsers) {
      const exists = await getRow('SELECT id FROM users WHERE username = ?', [user.username]);
      if (!exists) {
        const result = await runQuery(`
          INSERT INTO users (username, email, user_type, phone_number, institution, access_code, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [user.username, user.email, user.user_type, user.phone_number, user.institution, user.access_code, 1]);

        // Create demo profile
        await runQuery(`
          INSERT INTO user_profiles (user_id, full_name, institution_name, placement_unit)
          VALUES (?, ?, ?, ?)
        `, [
          result.id,
          user.user_type === 'pelajar' ? 'John Doe' : 'Ahmad Rahman',
          user.institution,
          user.user_type === 'pelajar' ? 'BIOFLOK NILA' : 'PAKAN MANDIRI (BUATAN)'
        ]);

        // Create demo registration
        const placementUnit = await getRow(
          'SELECT id FROM placement_units WHERE name = ?',
          [user.user_type === 'pelajar' ? 'BIOFLOK NILA' : 'PAKAN MANDIRI (BUATAN)']
        );

        await runQuery(`
          INSERT INTO registrations (user_id, placement_unit_id, full_name, institution, phone_number, status)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          result.id,
          placementUnit.id,
          user.user_type === 'pelajar' ? 'John Doe' : 'Ahmad Rahman',
          user.institution,
          user.phone_number,
          'approved'
        ]);
      }
    }
    console.log('✅ Demo users created');

    // Create attendance settings
    const settingsExists = await getRow('SELECT id FROM attendance_settings LIMIT 1');
    if (!settingsExists) {
      await runQuery(`
        INSERT INTO attendance_settings (bbpbat_latitude, bbpbat_longitude, allowed_radius)
        VALUES (?, ?, ?)
      `, [-6.9175, 107.6191, 100]);
      console.log('✅ Attendance settings created');
    }

    // Create sample announcements
    const adminUser = await getRow('SELECT id FROM users WHERE user_type = ? LIMIT 1', ['admin']);
    if (adminUser) {
      const announcementExists = await getRow('SELECT id FROM announcements LIMIT 1');
      if (!announcementExists) {
        const announcements = [
          {
            title: 'Selamat Datang di Sistem BBPBAT',
            content: 'Selamat datang di sistem bimbingan teknis BBPBAT. Silakan lengkapi profil dan berkas Anda untuk mengakses semua fitur.',
            priority: 'high',
            target_audience: 'all',
            status: 'published',
            published_at: new Date().toISOString()
          },
          {
            title: 'Panduan Penggunaan Sistem Absensi',
            content: 'Sistem absensi menggunakan verifikasi lokasi GPS. Pastikan Anda berada di area BBPBAT saat melakukan absensi.',
            priority: 'medium',
            target_audience: 'all',
            status: 'published',
            published_at: new Date().toISOString()
          }
        ];

        for (const announcement of announcements) {
          await runQuery(`
            INSERT INTO announcements (title, content, priority, target_audience, status, created_by, published_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            announcement.title,
            announcement.content,
            announcement.priority,
            announcement.target_audience,
            announcement.status,
            adminUser.id,
            announcement.published_at
          ]);
        }
        console.log('✅ Sample announcements created');
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('👨‍🎓 Pelajar: username=pelajar001, accessCode=BBPBAT2025');
    console.log('👥 Umum: username=umum001, accessCode=BBPBAT2025');
    console.log('🔐 Admin: username=admin_bbpbat, password=AdminBBPBAT2025!');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedData };