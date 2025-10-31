import { useState } from "react";
import CourtCard from "@/components/CourtCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Plus } from "lucide-react";

export default function CourtsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [courtName, setCourtName] = useState("");

  // Mock data - todo: remove mock functionality
  const mockCourts = [
    {
      id: "a",
      name: "A 場",
      isAvailable: false,
      currentMatch: {
        participants: ["快樂隊", "衝鋒隊"],
        time: "19:00 - 19:30",
      },
    },
    { id: "b", name: "B 場", isAvailable: true },
    {
      id: "c",
      name: "C 場",
      isAvailable: false,
      currentMatch: {
        participants: ["王大明", "李小華"],
        time: "19:00 - 19:30",
      },
    },
    { id: "d", name: "D 場", isAvailable: true },
  ];

  const handleCreateCourt = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating court:", courtName);
    setCreateDialogOpen(false);
    setCourtName("");
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">場地管理</h1>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-add-court">
              <Plus className="w-4 h-4 mr-2" />
              新增場地
            </Button>
          </div>
          <p className="text-lg text-muted-foreground">
            管理羽球場地資訊，即時查看場地使用狀態
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCourts.map((court) => (
            <CourtCard
              key={court.id}
              {...court}
              onEdit={(id) => console.log("Edit court:", id)}
            />
          ))}
        </div>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent data-testid="dialog-create-court">
          <DialogHeader>
            <DialogTitle>新增場地</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCourt} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="courtName">場地名稱</Label>
              <Input
                id="courtName"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                placeholder="例如：E 場"
                required
                data-testid="input-court-name"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="flex-1"
                data-testid="button-cancel-court"
              >
                取消
              </Button>
              <Button type="submit" className="flex-1" data-testid="button-submit-court">
                新增
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
