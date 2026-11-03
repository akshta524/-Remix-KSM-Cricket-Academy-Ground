export type BookingStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Cancelled' | 'Completed';
export type PaymentStatus = 'Pending' | 'Submitted' | 'Verified' | 'Failed';

export interface GroundBooking {
  id: string;
  date: string; // YYYY-MM-DD
  session: 's1' | 's2' | 's3';
  sessionName: string;
  timing: string;
  isWeekend: boolean;
  price: number;
  fullName: string;
  phone: string;
  email: string;
  teamName?: string;
  playersCount?: number;
  message?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  utrNumber?: string;
  createdAt: string;
}

export interface NetsBooking {
  id: string;
  date: string;
  sessionType: 'morning' | 'night';
  timing: string;
  durationHours: number;
  pricePerHour: number;
  totalPrice: number;
  fullName: string;
  phone: string;
  email: string;
  playersCount?: number;
  message?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  utrNumber?: string;
  createdAt: string;
}

export interface BowlingMachineBooking {
  id: string;
  date: string;
  preferredTime: string;
  sessionCount: number;
  totalBalls: number;
  totalPrice: number;
  fullName: string;
  phone: string;
  email: string;
  message?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  utrNumber?: string;
  createdAt: string;
}

export interface AcademyAdmission {
  id: string;
  studentName: string;
  dob: string;
  age: number;
  parentName: string;
  parentPhone: string;
  email: string;
  address: string;
  previousExperience: string;
  trainingProgram: string; // Batting, Bowling, Wicket Keeping, Fielding, Fitness, All-round
  membership: 'Quarterly' | '6 Months' | 'Yearly';
  fee: number;
  message?: string;
  status: 'Pending' | 'Approved' | 'Contacted' | 'Rejected';
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface HostelEnquiry {
  id: string;
  studentName: string;
  age: number;
  parentName: string;
  phone: string;
  email: string;
  preferredDuration: string;
  roomType: 'AC' | 'Non-AC';
  message?: string;
  status: 'Pending' | 'Contacted' | 'Allocated' | 'Rejected';
  createdAt: string;
}

export interface PaymentSubmission {
  id: string;
  bookingType: 'ground' | 'nets' | 'bowling' | 'academy' | 'hostel';
  bookingId: string;
  amount: number;
  payerName: string;
  payerPhone: string;
  utrNumber: string;
  status: PaymentStatus;
  notes?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface WebsiteSettings {
  liveStreamActive: boolean;
  liveStreamTitle: string;
  liveStreamAngle: string;
  phonePeUpi: string;
  phonePeQrImage: string;
  noticeBanner: string;
  contactPhone: string;
  contactAddress: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
}

export interface StandingItem {
  team: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  nrr: string;
  points: number;
  form?: string[];
}

export interface FixtureItem {
  id: string;
  matchNo: number;
  stage: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
  status: 'Live' | 'Completed' | 'Upcoming';
  scores?: {
    team1Score?: string;
    team2Score?: string;
    overs?: string;
  };
  result?: string;
  playerOfTheMatch?: string;
}

export interface TournamentAward {
  title: string;
  player: string;
  team: string;
  stats: string;
}

export interface Tournament {
  id: string;
  name: string;
  shortName: string;
  edition: string;
  tagline: string;
  format: string;
  status: 'Ongoing' | 'Upcoming' | 'Completed';
  dates: string;
  prizePool: string;
  venue: string;
  description: string;
  teamsCount: number;
  entryFee?: string;
  registrationOpen: boolean;
  contactNumber: string;
  standings: StandingItem[];
  fixtures: FixtureItem[];
  awards?: TournamentAward[];
  highlights?: string[];
}

export interface TournamentRegistration {
  id: string;
  tournamentId: string;
  tournamentName: string;
  teamName: string;
  captainName: string;
  phone: string;
  email: string;
  city: string;
  playersCount: number;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}
