import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { ZodError } from "zod";
import {
  insertCourtSchema,
  insertEventSchema,
  insertMatchSchema,
  insertRegistrationSchema,
  insertTeamSchema,
} from "@shared/schema";
import { storage } from "./storage";

function formatZodError(error: unknown): string | undefined {
  if (error instanceof ZodError) {
    return error.issues.map((issue) => issue.message).join("; ");
  }
  return undefined;
}

export async function registerRoutes(app: Express): Promise<Server> {
  /**
   * Court routes
   */
  app.get("/api/courts", async (_req, res) => {
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
      res.status(400).json({
        error: "Invalid court data",
        details: formatZodError(error),
      });
    }
  });

  const updateCourtHandler = async (req: Request, res: Response) => {
    try {
      const updateData = insertCourtSchema.partial().parse(req.body);
      const court = await storage.updateCourt(req.params.id, updateData);
      if (!court) {
        return res.status(404).json({ error: "Court not found" });
      }
      res.json(court);
    } catch (error) {
      res.status(400).json({
        error: "Invalid court data",
        details: formatZodError(error),
      });
    }
  };

  app.patch("/api/courts/:id", updateCourtHandler);
  app.put("/api/courts/:id", updateCourtHandler);

  app.delete("/api/courts/:id", async (req, res) => {
    try {
      const allCourts = await storage.getCourts();
      if (allCourts.length <= 1) {
        return res
          .status(400)
          .json({ error: "無法刪除，系統至少需要保留一座場地" });
      }

      const matches = await storage.getMatches();
      const courtHasActiveMatches = matches.some(
        (match) =>
          match.courtId === req.params.id &&
          (match.status === "scheduled" || match.status === "in_progress"),
      );

      if (courtHasActiveMatches) {
        return res
          .status(400)
          .json({ error: "此場地已有排程或進行中的比賽，無法刪除" });
      }

      const success = await storage.deleteCourt(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Court not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete court" });
    }
  });

  /**
   * Event routes
   */
  app.get("/api/events", async (_req, res) => {
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
      res.status(400).json({
        error: "Invalid event data",
        details: formatZodError(error),
      });
    }
  });

  app.patch("/api/events/:id", async (req, res) => {
    try {
      const updateData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(req.params.id, updateData);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({
        error: "Invalid event data",
        details: formatZodError(error),
      });
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

  /**
   * Team routes
   */
  app.get("/api/teams", async (_req, res) => {
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
      const details =
        formatZodError(error) ??
        "隊伍資料格式有誤，請確認成員人數符合 1 位隊長與 1 位隊員（共 2 人）";
      res.status(400).json({ error: details });
    }
  });

  app.patch("/api/teams/:id", async (req, res) => {
    try {
      const hasMemberUpdate = Array.isArray(req.body.memberIds);
      if (hasMemberUpdate) {
        const validated = insertTeamSchema.partial().parse(req.body);
        const team = await storage.updateTeam(req.params.id, validated);
        if (!team) {
          return res.status(404).json({ error: "找不到指定隊伍" });
        }
        return res.json(team);
      }

      const team = await storage.updateTeam(req.params.id, req.body);
      if (!team) {
        return res.status(404).json({ error: "找不到指定隊伍" });
      }
      res.json(team);
    } catch (error) {
      const details =
        formatZodError(error) ?? "更新隊伍失敗，請確認資料格式正確";
      res.status(400).json({ error: details });
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

  /**
   * Registration routes
   */
  app.get("/api/registrations", async (req, res) => {
    try {
      const eventId = (req.query.eventId as string | undefined) ?? undefined;
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
        return res.status(404).json({ error: "找不到指定活動" });
      }

      if (!event.maxParticipants) {
        return res.status(400).json({ error: "活動尚未設定人數上限" });
      }

      const currentCount = await storage.getEventParticipantCount(data.eventId);
      const newParticipants = data.type === "team" ? 2 : 1;

      if (currentCount + newParticipants > event.maxParticipants) {
        return res.status(400).json({
          error: `活動已達上限，目前 ${currentCount} 人，上限 ${event.maxParticipants} 人`,
          currentCount,
          maxParticipants: event.maxParticipants,
        });
      }

      const registration = await storage.createRegistration(data);
      res.status(201).json(registration);
    } catch (error) {
      res.status(400).json({
        error: formatZodError(error) ?? "報名資料格式錯誤",
      });
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

  /**
   * Match routes
   */
  app.get("/api/matches", async (req, res) => {
    try {
      const eventId = (req.query.eventId as string | undefined) ?? undefined;
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
      res.status(400).json({
        error: "Invalid match data",
        details: formatZodError(error),
      });
    }
  });

  app.patch("/api/matches/:id", async (req, res) => {
    try {
      const updateData = insertMatchSchema.partial().parse(req.body);
      const match = await storage.updateMatch(req.params.id, updateData);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }
      res.json(match);
    } catch (error) {
      res.status(400).json({
        error: "Invalid match data",
        details: formatZodError(error),
      });
    }
  });

  /**
   * Auto allocation (badminton aware scheduling)
   */
  app.post("/api/events/:id/allocate", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "找不到指定活動" });
      }

      const registrations = await storage.getRegistrations(req.params.id);
      const courts = await storage.getCourts();
      const availableCourts = courts.filter((court) => court.isAvailable);

      if (availableCourts.length === 0) {
        return res.status(400).json({ error: "目前沒有可用的場地" });
      }

      if (registrations.length === 0) {
        return res.status(400).json({ error: "尚無報名資料" });
      }

      const individuals = registrations.filter(
        (registration) => registration.type === "individual",
      );
      const teams = registrations.filter(
        (registration) => registration.type === "team",
      );

      const eventDuration =
        event.endTime.getTime() - event.startTime.getTime();
      const slotDuration = 30 * 60 * 1000;
      const numSlots = Math.floor(eventDuration / slotDuration);

      const matches: Match[] = [];
      const COURT_CAPACITY = 10;

      const doublesMatches = [];
      for (let i = 0; i < teams.length; i += 2) {
        if (i + 1 < teams.length) {
          doublesMatches.push({
            participantIds: [teams[i].teamId!, teams[i + 1].teamId!],
            playerCount: 4,
          });
        }
      }

      const singlesMatches = [];
      for (let i = 0; i < individuals.length; i += 2) {
        if (i + 1 < individuals.length) {
          singlesMatches.push({
            participantIds: [
              individuals[i].userId || individuals[i].participantName!,
              individuals[i + 1].userId ||
                individuals[i + 1].participantName!,
            ],
            playerCount: 2,
          });
        }
      }

      const allMatches = [...doublesMatches, ...singlesMatches];

      let currentSlot = 0;
      let matchesInCurrentSlot = 0;
      let playersInCurrentSlot = 0;

      for (const matchData of allMatches) {
        while (playersInCurrentSlot + matchData.playerCount > COURT_CAPACITY) {
          currentSlot += 1;
          matchesInCurrentSlot = 0;
          playersInCurrentSlot = 0;

          if (currentSlot >= numSlots) {
            console.warn("場次不足：無法為所有參賽者安排比賽");
            break;
          }
        }

        if (currentSlot >= numSlots) {
          break;
        }

        const courtIndex = matchesInCurrentSlot % availableCourts.length;
        const court = availableCourts[courtIndex];
        const startTime = new Date(
          event.startTime.getTime() + currentSlot * slotDuration,
        );

        const match = await storage.createMatch({
          eventId: event.id,
          courtId: court.id,
          startTime,
          participantIds: matchData.participantIds,
          status: "scheduled",
        });

        matches.push(match);
        matchesInCurrentSlot += 1;
        playersInCurrentSlot += matchData.playerCount;

        if (matchesInCurrentSlot >= availableCourts.length) {
          currentSlot += 1;
          matchesInCurrentSlot = 0;
          playersInCurrentSlot = 0;
        }
      }

      const unmatchedIndividuals = individuals.length % 2;
      const unmatchedTeams = teams.length % 2;

      res.json({
        success: true,
        matches,
        count: matches.length,
        doublesCount: doublesMatches.length,
        singlesCount: singlesMatches.length,
        totalAllocated: matches.length,
        unmatchedIndividuals,
        unmatchedTeams,
        message: `已排程 ${matches.length} 場比賽（單打 ${singlesMatches.length} 場，雙打 ${doublesMatches.length} 場）`,
      });
    } catch (error) {
      console.error("Allocation error:", error);
      res.status(500).json({
        error: "自動排程失敗",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
