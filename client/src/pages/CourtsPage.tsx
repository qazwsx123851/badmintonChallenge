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
    { id: "e", name: "E 場", isAvailable: true },
    { id: "f", name: "F 場", isAvailable: false, currentMatch: { participants: ["夢想隊", "閃電隊"], time: "19:30 - 20:00" } },
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
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-orange-600 flex items-center justify-center shadow-xl">
                <MapPin className="w-9 h-9 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-secondary to-orange-600 bg-clip-text text-transparent">場地管理</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  管理羽球場地資訊，即時查看場地使用狀態
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setCreateDialogOpen(true)} 
              variant="secondary"
              className="rounded-full shadow-lg h-14 px-8 font-medium text-base"
              data-testid="button-add-court"
            >
              <Plus className="w-5 h-5 mr-2" />
              新增場地
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <DialogContent className="rounded-2xl" data-testid="dialog-create-court">
          <DialogHeader>
            <DialogTitle className="text-2xl">新增場地</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCourt} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="courtName" className="text-base font-medium">場地名稱</Label>
              <Input
                id="courtName"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                placeholder="例如：G 場"
                required
                className="h-12 rounded-xl"
                data-testid="input-court-name"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="flex-1 rounded-full h-12"
                data-testid="button-cancel-court"
              >
                取消
              </Button>
              <Button variant="secondary" type="submit" className="flex-1 rounded-full h-12 font-medium" data-testid="button-submit-court">
                新增
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
