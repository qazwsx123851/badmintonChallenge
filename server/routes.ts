import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCourtSchema, 
  insertEventSchema, 
  insertTeamSchema, 
  insertRegistrationSchema,
  insertMatchSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Court routes
  app.get("/api/courts", async (req, res) => {
    try {
      const courts = await storage.getCourts();
      res.json(courts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courts" });
    }
  });

  app.get("/api/courts/:id", async (req, res) => {
    try {
      const court = await storage.getCourt(req.params.id);
      if (!court) {
        return res.status(404).json({ error: "Court not found" });
      }
      res.json(court);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch court" });
    }
  });

  app.post("/api/courts", async (req, res) => {
    try {
      const data = insertCourtSchema.parse(req.body);
      const court = await storage.createCourt(data);
      res.status(201).json(court);
    } catch (error) {
      res.status(400).json({ error: "Invalid court data" });
    }
  });

  app.patch("/api/courts/:id", async (req, res) => {
    try {
      const court = await storage.updateCourt(req.params.id, req.body);
      if (!court) {
        return res.status(404).json({ error: "Court not found" });
      }
      res.json(court);
    } catch (error) {
      res.status(400).json({ error: "Failed to update court" });
    }
  });

  app.delete("/api/courts/:id", async (req, res) => {
    try {
      const success = await storage.deleteCourt(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Court not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete court" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(400).json({ error: "Invalid event data", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.patch("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const success = await storage.deleteEvent(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Team routes
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team" });
    }
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const data = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(data);
      res.status(201).json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      if (error instanceof Error && error.message.includes("團隊最多只能有")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(400).json({ error: "團隊資料格式錯誤，請確認隊員人數不超過1位（含隊長共2人）" });
    }
  });

  app.patch("/api/teams/:id", async (req, res) => {
    try {
      if (req.body.memberIds) {
        const validatedData = insertTeamSchema.partial().parse(req.body);
        const team = await storage.updateTeam(req.params.id, validatedData);
        if (!team) {
          return res.status(404).json({ error: "找不到此團隊" });
        }
        return res.json(team);
      }
      
      const team = await storage.updateTeam(req.params.id, req.body);
      if (!team) {
        return res.status(404).json({ error: "找不到此團隊" });
      }
      res.json(team);
    } catch (error) {
      console.error("Error updating team:", error);
      if (error instanceof Error && error.message.includes("團隊最多只能有")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(400).json({ error: "更新團隊失敗，請確認資料格式" });
    }
  });

  app.delete("/api/teams/:id", async (req, res) => {
    try {
      const success = await storage.deleteTeam(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete team" });
    }
  });

  // Registration routes
  app.get("/api/registrations", async (req, res) => {
    try {
      const eventId = req.query.eventId as string | undefined;
      const registrations = await storage.getRegistrations(eventId);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  });

  app.post("/api/registrations", async (req, res) => {
    try {
      const data = insertRegistrationSchema.parse(req.body);
      
      const event = await storage.getEvent(data.eventId);
      if (!event) {
        return res.status(404).json({ error: "找不到此活動" });
      }

      if (!event.maxParticipants) {
        return res.status(400).json({ error: "活動未設定人數上限" });
      }

      const currentCount = await storage.getEventParticipantCount(data.eventId);
      const newParticipants = data.type === "team" ? 2 : 1;
      
      if (currentCount + newParticipants > event.maxParticipants) {
        return res.status(400).json({ 
          error: `活動已額滿！目前報名：${currentCount}人，上限：${event.maxParticipants}人`,
          currentCount,
          maxParticipants: event.maxParticipants
        });
      }

      const registration = await storage.createRegistration(data);
      res.status(201).json(registration);
    } catch (error) {
      console.error("Error creating registration:", error);
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(400).json({ error: "報名資料格式錯誤" });
    }
  });

  app.delete("/api/registrations/:id", async (req, res) => {
    try {
      const success = await storage.deleteRegistration(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Registration not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete registration" });
    }
  });

  // Match routes
  app.get("/api/matches", async (req, res) => {
    try {
      const eventId = req.query.eventId as string | undefined;
      const matches = await storage.getMatches(eventId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const data = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(data);
      res.status(201).json(match);
    } catch (error) {
      res.status(400).json({ error: "Invalid match data" });
    }
  });

  app.patch("/api/matches/:id", async (req, res) => {
    try {
      const match = await storage.updateMatch(req.params.id, req.body);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }
      res.json(match);
    } catch (error) {
      res.status(400).json({ error: "Failed to update match" });
    }
  });

  // Auto-allocation route
  app.post("/api/events/:id/allocate", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const registrations = await storage.getRegistrations(req.params.id);
      const courts = await storage.getCourts();
      const availableCourts = courts.filter(c => c.isAvailable);

      if (availableCourts.length === 0) {
        return res.status(400).json({ error: "No available courts" });
      }

      if (registrations.length === 0) {
        return res.status(400).json({ error: "No registrations found" });
      }

      // Simple allocation algorithm
      const eventDuration = event.endTime.getTime() - event.startTime.getTime();
      const slotDuration = 30 * 60 * 1000; // 30 minutes per match
      const numSlots = Math.floor(eventDuration / slotDuration);
      
      const matches = [];
      const participantIds = registrations.map(r => r.userId || r.teamId!);
      
      let slotIndex = 0;
      for (let i = 0; i < participantIds.length; i += 2) {
        if (i + 1 < participantIds.length) {
          const courtIndex = matches.length % availableCourts.length;
          const court = availableCourts[courtIndex];
          
          const startTime = new Date(event.startTime.getTime() + slotIndex * slotDuration);
          
          const match = await storage.createMatch({
            eventId: event.id,
            courtId: court.id,
            startTime,
            participantIds: [participantIds[i], participantIds[i + 1]],
            status: "scheduled"
          });
          
          matches.push(match);
          
          if ((matches.length) % availableCourts.length === 0) {
            slotIndex++;
          }
        }
      }

      res.json({ matches, count: matches.length });
    } catch (error) {
      console.error("Allocation error:", error);
      res.status(500).json({ error: "Failed to allocate matches" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
