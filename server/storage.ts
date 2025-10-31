import { 
  type User, 
  type InsertUser,
  type Team,
  type InsertTeam,
  type Court,
  type InsertCourt,
  type Event,
  type InsertEvent,
  type Registration,
  type InsertRegistration,
  type Match,
  type InsertMatch
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Court operations
  getCourts(): Promise<Court[]>;
  getCourt(id: string): Promise<Court | undefined>;
  createCourt(court: InsertCourt): Promise<Court>;
  updateCourt(id: string, court: Partial<InsertCourt>): Promise<Court | undefined>;
  deleteCourt(id: string): Promise<boolean>;

  // Event operations
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;

  // Team operations
  getTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, team: Partial<InsertTeam>): Promise<Team | undefined>;
  deleteTeam(id: string): Promise<boolean>;

  // Registration operations
  getRegistrations(eventId?: string): Promise<Registration[]>;
  getRegistration(id: string): Promise<Registration | undefined>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  deleteRegistration(id: string): Promise<boolean>;

  // Match operations
  getMatches(eventId?: string): Promise<Match[]>;
  getMatch(id: string): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: string, match: Partial<InsertMatch>): Promise<Match | undefined>;
  deleteMatch(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private courts: Map<string, Court>;
  private events: Map<string, Event>;
  private teams: Map<string, Team>;
  private registrations: Map<string, Registration>;
  private matches: Map<string, Match>;

  constructor() {
    this.users = new Map();
    this.courts = new Map();
    this.events = new Map();
    this.teams = new Map();
    this.registrations = new Map();
    this.matches = new Map();

    // Add some initial mock data
    this.seedData();
  }

  private seedData() {
    // Seed courts
    const courts = [
      { id: randomUUID(), name: "A 場", isAvailable: true },
      { id: randomUUID(), name: "B 場", isAvailable: true },
      { id: randomUUID(), name: "C 場", isAvailable: true },
      { id: randomUUID(), name: "D 場", isAvailable: true },
    ];
    courts.forEach(court => this.courts.set(court.id, court));

    // Seed events
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(19, 0, 0, 0);
    
    const events = [
      {
        id: randomUUID(),
        name: "週五夜間歡樂場",
        startTime: new Date(tomorrow),
        endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000),
        status: "開放報名",
        maxParticipants: 20,
      },
    ];
    events.forEach(event => this.events.set(event.id, event));
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      email: insertUser.email ?? null
    };
    this.users.set(id, user);
    return user;
  }

  // Court operations
  async getCourts(): Promise<Court[]> {
    return Array.from(this.courts.values());
  }

  async getCourt(id: string): Promise<Court | undefined> {
    return this.courts.get(id);
  }

  async createCourt(insertCourt: InsertCourt): Promise<Court> {
    const id = randomUUID();
    const court: Court = { 
      ...insertCourt, 
      id,
      isAvailable: insertCourt.isAvailable ?? true
    };
    this.courts.set(id, court);
    return court;
  }

  async updateCourt(id: string, update: Partial<InsertCourt>): Promise<Court | undefined> {
    const court = this.courts.get(id);
    if (!court) return undefined;
    const updated = { ...court, ...update };
    this.courts.set(id, updated);
    return updated;
  }

  async deleteCourt(id: string): Promise<boolean> {
    return this.courts.delete(id);
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = { 
      ...insertEvent, 
      id,
      status: insertEvent.status ?? "開放報名",
      maxParticipants: insertEvent.maxParticipants ?? null
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, update: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    const updated = { ...event, ...update };
    this.events.set(id, updated);
    return updated;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  // Team operations
  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async getTeam(id: string): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = randomUUID();
    const team: Team = { 
      ...insertTeam, 
      id,
      memberIds: insertTeam.memberIds ?? []
    };
    this.teams.set(id, team);
    return team;
  }

  async updateTeam(id: string, update: Partial<InsertTeam>): Promise<Team | undefined> {
    const team = this.teams.get(id);
    if (!team) return undefined;
    const updated = { ...team, ...update };
    this.teams.set(id, updated);
    return updated;
  }

  async deleteTeam(id: string): Promise<boolean> {
    return this.teams.delete(id);
  }

  // Registration operations
  async getRegistrations(eventId?: string): Promise<Registration[]> {
    const all = Array.from(this.registrations.values());
    if (eventId) {
      return all.filter(r => r.eventId === eventId);
    }
    return all;
  }

  async getRegistration(id: string): Promise<Registration | undefined> {
    return this.registrations.get(id);
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const id = randomUUID();
    const registration: Registration = { 
      ...insertRegistration, 
      id,
      userId: insertRegistration.userId ?? null,
      teamId: insertRegistration.teamId ?? null,
      participantName: insertRegistration.participantName ?? null,
      registeredAt: new Date()
    };
    this.registrations.set(id, registration);
    return registration;
  }

  async deleteRegistration(id: string): Promise<boolean> {
    return this.registrations.delete(id);
  }

  // Match operations
  async getMatches(eventId?: string): Promise<Match[]> {
    const all = Array.from(this.matches.values());
    if (eventId) {
      return all.filter(m => m.eventId === eventId);
    }
    return all;
  }

  async getMatch(id: string): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = randomUUID();
    const match: Match = { 
      ...insertMatch, 
      id,
      status: insertMatch.status ?? "scheduled"
    };
    this.matches.set(id, match);
    return match;
  }

  async updateMatch(id: string, update: Partial<InsertMatch>): Promise<Match | undefined> {
    const match = this.matches.get(id);
    if (!match) return undefined;
    const updated = { ...match, ...update };
    this.matches.set(id, updated);
    return updated;
  }

  async deleteMatch(id: string): Promise<boolean> {
    return this.matches.delete(id);
  }
}

export const storage = new MemStorage();
