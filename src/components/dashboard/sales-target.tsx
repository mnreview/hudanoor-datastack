
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DashboardSummary } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Target, Edit3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SalesTargetProps {
  summary: DashboardSummary;
  onTargetUpdate: (target: number) => void;
}

export function SalesTarget({ summary, onTargetUpdate }: SalesTargetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetInput, setTargetInput] = useState(summary.salesTarget?.toString() || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetInput);
    if (isNaN(target) || target <= 0) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณาใส่เป้าหมายยอดขายที่ถูกต้อง",
        variant: "destructive"
      });
      return;
    }
    onTargetUpdate(target);
    setIsOpen(false);
    toast({
      title: "บันทึกสำเร็จ",
      description: `ตั้งเป้าหมายยอดขายเป็น ${formatCurrency(target)}`
    });
  };

  const progressPercentage = summary.salesTarget 
    ? Math.min((summary.totalIncome / summary.salesTarget) * 100, 100)
    : 0;

  return (
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            เป้าหมายยอดขาย
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Edit3 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ตั้งเป้าหมายยอดขาย</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="target">เป้าหมายยอดขาย (บาท)</Label>
                  <Input
                    id="target"
                    type="number"
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    placeholder="ใส่เป้าหมายยอดขาย"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button type="submit">บันทึก</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {summary.salesTarget ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">ยอดขายปัจจุบัน</span>
              <span className="font-semibold text-income">{formatCurrency(summary.totalIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">เป้าหมาย</span>
              <span className="font-semibold">{formatCurrency(summary.salesTarget)}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ความคืบหน้า</span>
                <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
            <div className="text-center text-sm">
              {summary.totalIncome >= summary.salesTarget ? (
                <span className="text-green-600 font-medium">🎉 บรรลุเป้าหมายแล้ว!</span>
              ) : (
                <span className="text-muted-foreground">
                  เหลืออีก {formatCurrency(summary.salesTarget - summary.totalIncome)}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">ยังไม่ได้ตั้งเป้าหมายยอดขาย</p>
            <Button onClick={() => setIsOpen(true)} variant="outline">
              ตั้งเป้าหมาย
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
