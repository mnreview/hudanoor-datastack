import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Store, 
  Palette, 
  FileText, 
  Save,
  Check,
  RotateCcw
} from "lucide-react";

interface AppSettingsData {
  id: string;
  storeName: string;
  websiteName: string;
  storeSlogan?: string;
  primaryColor: string;
  storeAddress?: string;
  storePhone?: string;
  storeEmail?: string;
  currency: string;
  dateFormat: string;
  defaultSalesTarget: number;
}

const defaultSettings: AppSettingsData = {
  id: "1",
  storeName: "HUDANOOR",
  websiteName: "ระบบบันทึกรายรับ-รายจ่าย",
  storeSlogan: "เสื้อผ้าแฟชั่นมุสลิม",
  primaryColor: "#e11d48",
  storeAddress: "",
  storePhone: "",
  storeEmail: "",
  currency: "THB",
  dateFormat: "DD/MM/YYYY",
  defaultSalesTarget: 15000
};

export function AppSettings() {
  const [settings, setSettings] = useState<AppSettingsData>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // โหลดการตั้งค่าจาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    const savedSettings = localStorage.getItem('hudanoor-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
        
        // แสดงเวลาบันทึกล่าสุด
        if (parsedSettings.updatedAt) {
          const lastSavedDate = new Date(parsedSettings.updatedAt);
          setLastSaved(lastSavedDate.toLocaleString('th-TH'));
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // จำลองการบันทึกข้อมูล (ในอนาคตจะเชื่อมต่อกับ API หรือ localStorage)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // บันทึกลง localStorage สำหรับตอนนี้
      const settingsWithTimestamp = {
        ...settings,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('hudanoor-settings', JSON.stringify(settingsWithTimestamp));
      setLastSaved(new Date().toLocaleString('th-TH'));
      
      toast({
        title: "บันทึกการตั้งค่าสำเร็จ",
        description: "การตั้งค่าของคุณได้รับการบันทึกแล้ว",
        duration: 3000,
      });
      
      console.log("Settings saved:", settingsWithTimestamp);
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกการตั้งค่าได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
        duration: 3000,
      });
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
    setLastSaved(null);
    localStorage.removeItem('hudanoor-settings');
    toast({
      title: "รีเซ็ตการตั้งค่าสำเร็จ",
      description: "การตั้งค่าได้กลับไปเป็นค่าเริ่มต้นแล้ว",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            การตั้งค่า
          </h1>
          <div>
            <p className="text-muted-foreground mt-1">
              ปรับแต่งระบบให้เหมาะสมกับการใช้งานของคุณ
            </p>
            {lastSaved && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                <Check className="h-3 w-3 inline mr-1" />
                บันทึกล่าสุด: {lastSaved}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleResetSettings}
            variant="outline"
            disabled={isSaving}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            รีเซ็ต
          </Button>
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                กำลังบันทึก...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                บันทึกการตั้งค่า
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="store">ข้อมูลร้าน</TabsTrigger>
          <TabsTrigger value="appearance">รูปลักษณ์</TabsTrigger>
          <TabsTrigger value="system">ระบบ</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                ข้อมูลร้านค้า
              </CardTitle>
              <CardDescription>
                ตั้งค่าข้อมูลพื้นฐานของร้านค้า
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">ชื่อร้าน</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="websiteName">ชื่อเว็บไซต์</Label>
                  <Input
                    id="websiteName"
                    value={settings.websiteName}
                    onChange={(e) => setSettings({...settings, websiteName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="storeSlogan">สโลแกนร้าน</Label>
                <Input
                  id="storeSlogan"
                  value={settings.storeSlogan || ""}
                  onChange={(e) => setSettings({...settings, storeSlogan: e.target.value})}
                  placeholder="เช่น เสื้อผ้าแฟชั่นมุสลิม"
                />
              </div>

              <div>
                <Label htmlFor="storeAddress">ที่อยู่ร้าน</Label>
                <Textarea
                  id="storeAddress"
                  value={settings.storeAddress || ""}
                  onChange={(e) => setSettings({...settings, storeAddress: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storePhone">เบอร์โทรศัพท์</Label>
                  <Input
                    id="storePhone"
                    value={settings.storePhone || ""}
                    onChange={(e) => setSettings({...settings, storePhone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="storeEmail">อีเมล</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={settings.storeEmail || ""}
                    onChange={(e) => setSettings({...settings, storeEmail: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                รูปลักษณ์และธีม
              </CardTitle>
              <CardDescription>
                ปรับแต่งสีและรูปลักษณ์ของระบบ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>สีหลักของระบบ</Label>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {[
                    { name: "Rose", value: "#e11d48" },
                    { name: "Pink", value: "#ec4899" },
                    { name: "Purple", value: "#a855f7" },
                    { name: "Blue", value: "#3b82f6" },
                    { name: "Green", value: "#10b981" },
                    { name: "Orange", value: "#f97316" },
                    { name: "Red", value: "#ef4444" }
                  ].map((color) => (
                    <button
                      key={color.value}
                      className={`w-12 h-12 rounded-lg border-2 ${
                        settings.primaryColor === color.value 
                          ? 'border-gray-900 dark:border-white' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSettings({...settings, primaryColor: color.value})}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                การตั้งค่าระบบ
              </CardTitle>
              <CardDescription>
                ตั้งค่าพื้นฐานของระบบ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currency">สกุลเงิน</Label>
                  <Select value={settings.currency} onValueChange={(value) => setSettings({...settings, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="THB">บาท (THB)</SelectItem>
                      <SelectItem value="USD">ดอลลาร์ (USD)</SelectItem>
                      <SelectItem value="EUR">ยูโร (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">รูปแบบวันที่</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => setSettings({...settings, dateFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="defaultSalesTarget">เป้าหมายยอดขายเริ่มต้น</Label>
                  <Input
                    id="defaultSalesTarget"
                    type="number"
                    value={settings.defaultSalesTarget}
                    onChange={(e) => setSettings({...settings, defaultSalesTarget: Number(e.target.value)})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}