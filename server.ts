import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { getDb, saveDb } from './server/db.js';
import type {
  GroundBooking,
  NetsBooking,
  BowlingMachineBooking,
  AcademyAdmission,
  HostelEnquiry,
  PaymentSubmission,
  WebsiteSettings,
  Tournament,
  TournamentRegistration
} from './src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = 3000;

const ADMIN_CREDENTIALS = {
  email: 'admin@ksmcricket.com',
  password: 'ksm@adibatla2026'
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  app.get('/api/status', (_req: Request, res: Response) => {
    res.json({ ok: true, name: 'KSM Cricket Academy & Ground API', time: new Date().toISOString() });
  });

  // Settings
  app.get('/api/settings', (_req: Request, res: Response) => {
    const db = getDb();
    res.json(db.settings);
  });

  app.post('/api/settings', (req: Request, res: Response) => {
    const db = getDb();
    db.settings = { ...db.settings, ...req.body };
    saveDb(db);
    res.json({ success: true, settings: db.settings });
  });

  // Admin Auth
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (
      email?.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
      password === ADMIN_CREDENTIALS.password
    ) {
      res.json({
        success: true,
        token: 'ksm_admin_' + Buffer.from(email + ':' + Date.now()).toString('base64'),
        user: { name: 'KSM Academy Admin', email: ADMIN_CREDENTIALS.email, role: 'Super Admin' }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please check your admin email and password.' });
    }
  });

  // Ground Bookings
  app.get('/api/bookings/ground', (req: Request, res: Response) => {
    const db = getDb();
    const { date } = req.query;
    if (date && typeof date === 'string') {
      const filtered = db.groundBookings.filter(b => b.date === date);
      return res.json(filtered);
    }
    res.json(db.groundBookings);
  });

  app.post('/api/bookings/ground', (req: Request, res: Response) => {
    const db = getDb();
    const data = req.body;

    if (!data.date || !data.session || !data.fullName || !data.phone) {
      return res.status(400).json({ success: false, message: 'Missing required booking fields.' });
    }

    // Check duplicate confirmed booking
    const duplicate = db.groundBookings.find(
      b => b.date === data.date && b.session === data.session && b.status === 'Confirmed'
    );
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'This session has already been confirmed for another match. Please choose an alternate slot.'
      });
    }

    const uniqueId = `KSM-GB-${Date.now().toString().slice(-5)}`;
    const newBooking: GroundBooking = {
      id: uniqueId,
      date: data.date,
      session: data.session,
      sessionName: data.sessionName || `Session ${data.session.toUpperCase()}`,
      timing: data.timing || '7:30 AM – 10:30 AM',
      isWeekend: Boolean(data.isWeekend),
      price: Number(data.price) || (data.isWeekend ? 6500 : 3000),
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || '',
      teamName: data.teamName || '',
      playersCount: Number(data.playersCount) || 16,
      message: data.message || '',
      status: 'Pending',
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString()
    };

    db.groundBookings.unshift(newBooking);
    saveDb(db);

    res.json({
      success: true,
      booking: newBooking,
      message: 'Your booking request has been submitted. Our team will contact you to confirm availability.'
    });
  });

  app.patch('/api/bookings/ground/:id', (req: Request, res: Response) => {
    const db = getDb();
    const { id } = req.params;
    const index = db.groundBookings.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    db.groundBookings[index] = { ...db.groundBookings[index], ...req.body };
    saveDb(db);
    res.json({ success: true, booking: db.groundBookings[index] });
  });

  // Nets Bookings
  app.get('/api/bookings/nets', (_req: Request, res: Response) => {
    const db = getDb();
    res.json(db.netsBookings);
  });

  app.post('/api/bookings/nets', (req: Request, res: Response) => {
    const db = getDb();
    const data = req.body;

    if (!data.date || !data.fullName || !data.phone) {
      return res.status(400).json({ success: false, message: 'Missing required nets booking fields.' });
    }

    const uniqueId = `KSM-NET-${Date.now().toString().slice(-5)}`;
    const newBooking: NetsBooking = {
      id: uniqueId,
      date: data.date,
      sessionType: data.sessionType || 'morning',
      timing: data.timing || 'Morning Slot',
      durationHours: Number(data.durationHours) || 1,
      pricePerHour: data.sessionType === 'night' ? 800 : 500,
      totalPrice: Number(data.totalPrice) || (data.sessionType === 'night' ? 800 : 500),
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || '',
      playersCount: Number(data.playersCount) || 2,
      message: data.message || '',
      status: 'Pending',
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString()
    };

    db.netsBookings.unshift(newBooking);
    saveDb(db);

    res.json({
      success: true,
      booking: newBooking,
      message: 'Your practice nets booking request has been submitted. Our team will contact you to confirm availability.'
    });
  });

  app.patch('/api/bookings/nets/:id', (req: Request, res: Response) => {
    const db = getDb();
    const { id } = req.params;
    const index = db.netsBookings.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    db.netsBookings[index] = { ...db.netsBookings[index], ...req.body };
    saveDb(db);
    res.json({ success: true, booking: db.netsBookings[index] });
  });

  // Bowling Machine Bookings
  app.get('/api/bookings/bowling-machine', (_req: Request, res: Response) => {
    const db = getDb();
    res.json(db.bowlingBookings);
  });

  app.post('/api/bookings/bowling-machine', (req: Request, res: Response) => {
    const db = getDb();
    const data = req.body;

    if (!data.date || !data.fullName || !data.phone) {
      return res.status(400).json({ success: false, message: 'Missing required bowling machine booking fields.' });
    }

    const sessions = Number(data.sessionCount) || 1;
    const uniqueId = `KSM-BM-${Date.now().toString().slice(-5)}`;
    const newBooking: BowlingMachineBooking = {
      id: uniqueId,
      date: data.date,
      preferredTime: data.preferredTime || '07:00 AM',
      sessionCount: sessions,
      totalBalls: sessions * 200,
      totalPrice: sessions * 1000,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || '',
      message: data.message || '',
      status: 'Pending',
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString()
    };

    db.bowlingBookings.unshift(newBooking);
    saveDb(db);

    res.json({
      success: true,
      booking: newBooking,
      message: 'Your bowling machine booking enquiry has been submitted. Our team will contact you to confirm availability.'
    });
  });

  app.patch('/api/bookings/bowling-machine/:id', (req: Request, res: Response) => {
    const db = getDb();
    const { id } = req.params;
    const index = db.bowlingBookings.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    db.bowlingBookings[index] = { ...db.bowlingBookings[index], ...req.body };
    saveDb(db);
    res.json({ success: true, booking: db.bowlingBookings[index] });
  });

  // Academy Admissions
  app.get('/api/academy/admissions', (_req: Request, res: Response) => {
    const db = getDb();
    res.json(db.academyAdmissions);
  });

  app.post('/api/academy/admissions', (req: Request, res: Response) => {
    const db = getDb();
    const data = req.body;

    if (!data.studentName || !data.parentName || !data.parentPhone) {
      return res.status(400).json({ success: false, message: 'Please complete all required student and parent fields.' });
    }

    const feeMap = { Quarterly: 10000, '6 Months': 20000, Yearly: 40000 };
    const membership = (data.membership || 'Quarterly') as 'Quarterly' | '6 Months' | 'Yearly';
    const fee = feeMap[membership] || 10000;

    const uniqueId = `KSM-ADM-${Date.now().toString().slice(-5)}`;
    const newAdmission: AcademyAdmission = {
      id: uniqueId,
      studentName: data.studentName,
      dob: data.dob || '',
      age: Number(data.age) || 12,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      email: data.email || '',
      address: data.address || '',
      previousExperience: data.previousExperience || '',
      trainingProgram: data.trainingProgram || 'Batting',
      membership,
      fee,
      message: data.message || '',
      status: 'Pending',
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString()
    };

    db.academyAdmissions.unshift(newAdmission);
    saveDb(db);

    res.json({
      success: true,
      admission: newAdmission,
      message: 'Admission enquiry received successfully! KSM coaching coaches will review and get in touch with you.'
    });
  });

  app.patch('/api/academy/admissions/:id', (req: Request, res: Response) => {
    const db = getDb();
    const { id } = req.params;
    const index = db.academyAdmissions.findIndex(a => a.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Admission record not found' });
    }
    db.academyAdmissions[index] = { ...db.academyAdmissions[index], ...req.body };
    saveDb(db);
    res.json({ success: true, admission: db.academyAdmissions[index] });
  });

  // Hostel Enquiries
  app.get('/api/hostel/enquiries', (_req: Request, res: Response) => {
    const db = getDb();
    res.json(db.hostelEnquiries);
  });

  app.post('/api/hostel/enquiries', (req: Request, res: Response) => {
    const db = getDb();
    const data = req.body;

    if (!data.studentName || !data.parentName || !data.phone) {
      return res.status(400).json({ success: false, message: 'Missing required hostel enquiry fields.' });
    }

    const uniqueId = `KSM-HST-${Date.now().toString().slice(-5)}`;
    const newEnquiry: HostelEnquiry = {
      id: uniqueId,
      studentName: data.studentName,
      age: Number(data.age) || 14,
      parentName: data.parentName,
      phone: data.phone,
      email: data.email || '',
      preferredDuration: data.preferredDuration || '1 Year',
      roomType: data.roomType === 'Non-AC' ? 'Non-AC' : 'AC',
      message: data.message || '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    db.hostelEnquiries.unshift(newEnquiry);
    saveDb(db);

    res.json({
      success: true,
      enquiry: newEnquiry,
      message: 'Hostel accommodation enquiry submitted. Management will contact you regarding room availability.'
    });
  });

  app.patch('/api/hostel/enquiries/:id', (req: Request, res: Response) => {
    const db = getDb();
    const { id } = req.params;
    const index = db.hostelEnquiries.findIndex(h => h.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Hostel enquiry not found' });
    }
    db.hostelEnquiries[index] = { ...db.hostelEnquiries[index], ...req.body };
    saveDb(db);
    res.json({ success: true, enquiry: db.hostelEnquiries[index] });
  });

  // Payments
  app.get('/api/payments', (_req: Request, res: Response) => {
    const db = getDb();
    res.json(db.payments);
  });

  app.post('/api/payments', (req: Request, res: Response) => {
    const db = getDb();
    const data = req.body;

    if (!data.bookingId || !data.amount || !data.utrNumber) {
      return res.status(400).json({ success: false, message: 'Booking ID, Amount, and UTR number are mandatory for payment submission.' });
    }

    const uniqueId = `PAY-${Date.now().toString().slice(-4)}`;
    const newPayment: PaymentSubmission = {
      id: uniqueId,
      bookingType: data.bookingType || 'ground',
      bookingId: data.bookingId,
      amount: Number(data.amount),
      payerName: data.payerName || 'Cricket Player',
      payerPhone: data.payerPhone || '',
      utrNumber: data.utrNumber.trim(),
      status: 'Submitted',
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    db.payments.unshift(newPayment);

    // Sync booking status
    if (data.bookingType === 'ground') {
      const b = db.groundBookings.find(x => x.id === data.bookingId);
      if (b) {
        b.paymentStatus = 'Submitted';
        b.utrNumber = data.utrNumber.trim();
      }
    } else if (data.bookingType === 'nets') {
      const b = db.netsBookings.find(x => x.id === data.bookingId);
      if (b) {
        b.paymentStatus = 'Submitted';
        b.utrNumber = data.utrNumber.trim();
      }
    } else if (data.bookingType === 'bowling') {
      const b = db.bowlingBookings.find(x => x.id === data.bookingId);
      if (b) {
        b.paymentStatus = 'Submitted';
        b.utrNumber = data.utrNumber.trim();
      }
    } else if (data.bookingType === 'academy') {
      const a = db.academyAdmissions.find(x => x.id === data.bookingId);
      if (a) {
        a.paymentStatus = 'Submitted';
      }
    }

    saveDb(db);

    res.json({
      success: true,
      payment: newPayment,
      message: 'Payment reference submitted. KSM management will verify the transaction and confirm your booking.'
    });
  });

  app.patch('/api/payments/:id', (req: Request, res: Response) => {
    const db = getDb();
    const { id } = req.params;
    const { status, notes } = req.body;

    const paymentIndex = db.payments.findIndex(p => p.id === id);
    if (paymentIndex === -1) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    const payment = db.payments[paymentIndex];
    payment.status = status;
    if (notes) payment.notes = notes;
    if (status === 'Verified') payment.verifiedAt = new Date().toISOString();

    // Also update associated booking
    const bookingId = payment.bookingId;
    if (payment.bookingType === 'ground') {
      const b = db.groundBookings.find(x => x.id === bookingId);
      if (b) {
        b.paymentStatus = status;
        if (status === 'Verified') b.status = 'Confirmed';
      }
    } else if (payment.bookingType === 'nets') {
      const b = db.netsBookings.find(x => x.id === bookingId);
      if (b) {
        b.paymentStatus = status;
        if (status === 'Verified') b.status = 'Confirmed';
      }
    } else if (payment.bookingType === 'bowling') {
      const b = db.bowlingBookings.find(x => x.id === bookingId);
      if (b) {
        b.paymentStatus = status;
        if (status === 'Verified') b.status = 'Confirmed';
      }
    } else if (payment.bookingType === 'academy') {
      const a = db.academyAdmissions.find(x => x.id === bookingId);
      if (a) {
        a.paymentStatus = status;
        if (status === 'Verified') a.status = 'Approved';
      }
    }

    saveDb(db);
    res.json({ success: true, payment });
  });

  // Tournaments
  app.get('/api/tournaments', (_req: Request, res: Response) => {
    const db = getDb();
    res.json(db.tournaments || []);
  });

  app.get('/api/tournaments/:id', (req: Request, res: Response) => {
    const db = getDb();
    const tournament = (db.tournaments || []).find(t => t.id === req.params.id);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }
    res.json(tournament);
  });

  app.patch('/api/tournaments/:id', (req: Request, res: Response) => {
    const db = getDb();
    const { id } = req.params;
    const index = (db.tournaments || []).findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }
    db.tournaments[index] = { ...db.tournaments[index], ...req.body };
    saveDb(db);
    res.json({ success: true, tournament: db.tournaments[index] });
  });

  // Tournament Team Registration
  app.post('/api/tournaments/:id/register', (req: Request, res: Response) => {
    const db = getDb();
    const { id } = req.params;
    const tournament = (db.tournaments || []).find(t => t.id === id);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    const data = req.body;
    if (!data.teamName || !data.captainName || !data.phone) {
      return res.status(400).json({ success: false, message: 'Team Name, Captain Name, and Phone are mandatory.' });
    }

    const regId = `TRN-REG-${Date.now().toString().slice(-4)}`;
    const newReg: TournamentRegistration = {
      id: regId,
      tournamentId: tournament.id,
      tournamentName: tournament.name,
      teamName: data.teamName.trim(),
      captainName: data.captainName.trim(),
      phone: data.phone.trim(),
      email: data.email ? data.email.trim() : '',
      city: data.city ? data.city.trim() : 'Hyderabad',
      playersCount: Number(data.playersCount) || 15,
      notes: data.notes ? data.notes.trim() : '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    if (!db.tournamentRegistrations) db.tournamentRegistrations = [];
    db.tournamentRegistrations.unshift(newReg);
    saveDb(db);

    res.json({
      success: true,
      registration: newReg,
      message: `Team registration for "${tournament.name}" submitted successfully! KSM Tournament Committee will contact you to verify squad details.`
    });
  });

  app.get('/api/tournament-registrations', (_req: Request, res: Response) => {
    const db = getDb();
    res.json(db.tournamentRegistrations || []);
  });

  app.patch('/api/tournament-registrations/:id', (req: Request, res: Response) => {
    const db = getDb();
    const { id } = req.params;
    const { status } = req.body;
    const index = (db.tournamentRegistrations || []).findIndex(r => r.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    db.tournamentRegistrations[index].status = status;
    saveDb(db);
    res.json({ success: true, registration: db.tournamentRegistrations[index] });
  });

  // Export CSV
  app.get('/api/export/:type', (req: Request, res: Response) => {
    const db = getDb();
    const { type } = req.params;

    if (type === 'ground-bookings') {
      const header = 'ID,Date,Session,Price,Customer,Phone,Email,Team,Players,Status,Payment,UTR,Created\n';
      const rows = db.groundBookings.map(b =>
        `"${b.id}","${b.date}","${b.sessionName}",${b.price},"${b.fullName}","${b.phone}","${b.email}","${b.teamName || ''}",${b.playersCount || 0},"${b.status}","${b.paymentStatus}","${b.utrNumber || ''}","${b.createdAt}"`
      ).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="ksm_ground_bookings.csv"');
      return res.send(header + rows);
    }

    if (type === 'admissions') {
      const header = 'ID,Student,DOB,Age,Parent,Phone,Email,Program,Membership,Fee,Status,Payment,Created\n';
      const rows = db.academyAdmissions.map(a =>
        `"${a.id}","${a.studentName}","${a.dob}",${a.age},"${a.parentName}","${a.parentPhone}","${a.email}","${a.trainingProgram}","${a.membership}",${a.fee},"${a.status}","${a.paymentStatus}","${a.createdAt}"`
      ).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="ksm_academy_admissions.csv"');
      return res.send(header + rows);
    }

    if (type === 'payments') {
      const header = 'ID,Type,BookingID,Amount,Payer,Phone,UTR,Status,Notes,Created\n';
      const rows = db.payments.map(p =>
        `"${p.id}","${p.bookingType}","${p.bookingId}",${p.amount},"${p.payerName}","${p.payerPhone}","${p.utrNumber}","${p.status}","${p.notes || ''}","${p.createdAt}"`
      ).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="ksm_payments.csv"');
      return res.send(header + rows);
    }

    res.status(400).send('Invalid export type requested');
  });

  // Vite Integration in Dev or Static in Production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KSM Cricket Academy & Ground server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
