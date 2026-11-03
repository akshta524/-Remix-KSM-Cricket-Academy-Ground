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
} from '../types/index.js';

const KSM_WHATSAPP_NUMBER = '919392259363';

export function createWhatsAppUrl(text: string): string {
  return `https://wa.me/${KSM_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function formatGroundBookingWhatsApp(b: GroundBooking): string {
  return `Hello KSM Cricket Academy & Ground,

I have submitted a booking request for the ground:
* Booking ID: ${b.id}
* Date: ${b.date} (${b.isWeekend ? 'Weekend' : 'Weekday'})
* Session: ${b.sessionName} (${b.timing})
* Price: ₹${b.price.toLocaleString('en-IN')}
* Name: ${b.fullName}
* Phone: ${b.phone}
* Team: ${b.teamName || 'N/A'}
* Players: ${b.playersCount || '16'}
${b.message ? `* Note: ${b.message}` : ''}

Please confirm slot availability. Thank you!`;
}

export function formatNetsBookingWhatsApp(b: NetsBooking): string {
  return `Hello KSM Cricket Academy,

I have requested a Practice Nets slot:
* Enquiry ID: ${b.id}
* Date: ${b.date}
* Session: ${b.sessionType === 'night' ? 'Night under Floodlights' : 'Morning Practice'}
* Timing: ${b.timing}
* Duration: ${b.durationHours} Hour(s)
* Total Amount: ₹${b.totalPrice.toLocaleString('en-IN')}
* Name: ${b.fullName}
* Phone: ${b.phone}

Please confirm net availability. Thank you!`;
}

export function formatBowlingMachineWhatsApp(b: BowlingMachineBooking): string {
  return `Hello KSM Cricket Academy,

I would like to book a Bowling Machine training session:
* Enquiry ID: ${b.id}
* Date: ${b.date}
* Preferred Time: ${b.preferredTime}
* Sessions: ${b.sessionCount} (${b.totalBalls} Balls)
* Total Amount: ₹${b.totalPrice.toLocaleString('en-IN')}
* Name: ${b.fullName}
* Phone: ${b.phone}

Please confirm machine availability. Thank you!`;
}

export function formatAdmissionWhatsApp(a: AcademyAdmission): string {
  return `Hello KSM Cricket Academy,

I have submitted an admission application for coaching:
* Application ID: ${a.id}
* Student Name: ${a.studentName} (Age: ${a.age})
* Training Program: ${a.trainingProgram}
* Membership: ${a.membership} (₹${a.fee.toLocaleString('en-IN')})
* Parent Name: ${a.parentName}
* Parent Contact: ${a.parentPhone}

Looking forward to scheduling the trial/assessment session.`;
}

export function formatHostelWhatsApp(h: HostelEnquiry): string {
  return `Hello KSM Cricket Academy,

I have submitted an accommodation enquiry for the Academy Hostel:
* Enquiry ID: ${h.id}
* Student Name: ${h.studentName} (Age: ${h.age})
* Parent Name: ${h.parentName}
* Phone: ${h.phone}
* Preferred Duration: ${h.preferredDuration}
* Room Preference: ${h.roomType}
${h.message ? `* Note: ${h.message}` : ''}

Please share room availability and joining details.`;
}

export function formatTournamentRegistrationWhatsApp(r: TournamentRegistration): string {
  return `Hello KSM Tournament Organizing Committee,

We would like to register our cricket team for:
* Tournament: ${r.tournamentName}
* Registration ID: ${r.id}
* Team Name: ${r.teamName}
* Captain / Manager: ${r.captainName}
* Contact Phone: ${r.phone}
* City / Location: ${r.city}
* Squad Size: ${r.playersCount} Players
${r.notes ? `* Squad Notes: ${r.notes}` : ''}

Please confirm our entry slot and share tournament guidelines. Thank you!`;
}

export const api = {
  async getSettings(): Promise<WebsiteSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to load settings');
    return res.json();
  },

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<void> {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
  },

  async getGroundBookings(date?: string): Promise<GroundBooking[]> {
    const url = date ? `/api/bookings/ground?date=${date}` : '/api/bookings/ground';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch ground bookings');
    return res.json();
  },

  async bookGround(data: Partial<GroundBooking>): Promise<{ success: boolean; booking: GroundBooking; message: string }> {
    const res = await fetch('/api/bookings/ground', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to submit ground booking');
    return result;
  },

  async updateGroundBooking(id: string, updates: Partial<GroundBooking>): Promise<GroundBooking> {
    const res = await fetch(`/api/bookings/ground/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update booking');
    return result.booking;
  },

  async getNetsBookings(): Promise<NetsBooking[]> {
    const res = await fetch('/api/bookings/nets');
    if (!res.ok) throw new Error('Failed to fetch nets bookings');
    return res.json();
  },

  async bookNets(data: Partial<NetsBooking>): Promise<{ success: boolean; booking: NetsBooking; message: string }> {
    const res = await fetch('/api/bookings/nets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to submit nets booking');
    return result;
  },

  async updateNetsBooking(id: string, updates: Partial<NetsBooking>): Promise<NetsBooking> {
    const res = await fetch(`/api/bookings/nets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update nets booking');
    return result.booking;
  },

  async getBowlingBookings(): Promise<BowlingMachineBooking[]> {
    const res = await fetch('/api/bookings/bowling-machine');
    if (!res.ok) throw new Error('Failed to fetch bowling machine bookings');
    return res.json();
  },

  async bookBowlingMachine(data: Partial<BowlingMachineBooking>): Promise<{ success: boolean; booking: BowlingMachineBooking; message: string }> {
    const res = await fetch('/api/bookings/bowling-machine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to submit bowling machine booking');
    return result;
  },

  async updateBowlingBooking(id: string, updates: Partial<BowlingMachineBooking>): Promise<BowlingMachineBooking> {
    const res = await fetch(`/api/bookings/bowling-machine/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update bowling booking');
    return result.booking;
  },

  async getAdmissions(): Promise<AcademyAdmission[]> {
    const res = await fetch('/api/academy/admissions');
    if (!res.ok) throw new Error('Failed to fetch academy admissions');
    return res.json();
  },

  async submitAdmission(data: Partial<AcademyAdmission>): Promise<{ success: boolean; admission: AcademyAdmission; message: string }> {
    const res = await fetch('/api/academy/admissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to submit admission enquiry');
    return result;
  },

  async updateAdmission(id: string, updates: Partial<AcademyAdmission>): Promise<AcademyAdmission> {
    const res = await fetch(`/api/academy/admissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update admission');
    return result.admission;
  },

  async getHostelEnquiries(): Promise<HostelEnquiry[]> {
    const res = await fetch('/api/hostel/enquiries');
    if (!res.ok) throw new Error('Failed to fetch hostel enquiries');
    return res.json();
  },

  async submitHostelEnquiry(data: Partial<HostelEnquiry>): Promise<{ success: boolean; enquiry: HostelEnquiry; message: string }> {
    const res = await fetch('/api/hostel/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to submit hostel enquiry');
    return result;
  },

  async updateHostelEnquiry(id: string, updates: Partial<HostelEnquiry>): Promise<HostelEnquiry> {
    const res = await fetch(`/api/hostel/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update hostel enquiry');
    return result.enquiry;
  },

  async getPayments(): Promise<PaymentSubmission[]> {
    const res = await fetch('/api/payments');
    if (!res.ok) throw new Error('Failed to fetch payments');
    return res.json();
  },

  async submitPayment(data: Partial<PaymentSubmission>): Promise<{ success: boolean; payment: PaymentSubmission; message: string }> {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to submit payment reference');
    return result;
  },

  async updatePayment(id: string, status: string, notes?: string): Promise<PaymentSubmission> {
    const res = await fetch(`/api/payments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update payment');
    return result.payment;
  },

  async adminLogin(email: string, password: string): Promise<{ success: boolean; token: string; user: { name: string; email: string } }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Login failed');
    return result;
  },

  async getTournaments(): Promise<Tournament[]> {
    const res = await fetch('/api/tournaments');
    if (!res.ok) throw new Error('Failed to fetch tournaments');
    return res.json();
  },

  async getTournamentById(id: string): Promise<Tournament> {
    const res = await fetch(`/api/tournaments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch tournament details');
    return res.json();
  },

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament> {
    const res = await fetch(`/api/tournaments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update tournament');
    return result.tournament;
  },

  async registerTournamentTeam(tournamentId: string, data: Partial<TournamentRegistration>): Promise<{ success: boolean; registration: TournamentRegistration; message: string }> {
    const res = await fetch(`/api/tournaments/${tournamentId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to submit team registration');
    return result;
  },

  async getTournamentRegistrations(): Promise<TournamentRegistration[]> {
    const res = await fetch('/api/tournament-registrations');
    if (!res.ok) throw new Error('Failed to fetch tournament registrations');
    return res.json();
  },

  async updateTournamentRegistration(id: string, status: string): Promise<TournamentRegistration> {
    const res = await fetch(`/api/tournament-registrations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update registration status');
    return result.registration;
  }
};
