import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getConfigurationStatus } from '@/lib/google-apps-script';
import { CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

export function ConnectionStatus() {
  const [status, setStatus] = useState(getConfigurationStatus());

  useEffect(() => {
    setStatus(getConfigurationStatus());
  }, []);

  if (status.isConfigured) {
    return (
      <div className="mb-4">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex items-center justify-between">
              <span>เชื่อมต่อ Google Sheets สำเร็จ - พร้อมใช้งาน</span>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                ออนไลน์
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-3">
            <div>
              <strong>จำเป็นต้องตั้งค่า Google Sheets เพื่อใช้งาน</strong>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.hasWebAppUrl ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>Google Apps Script URL: {status.hasWebAppUrl ? 'ตั้งค่าแล้ว' : 'ยังไม่ได้ตั้งค่า'}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://github.com/your-repo/GOOGLE_SHEETS_SETUP.md', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              ดูคำแนะนำการตั้งค่า
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}