import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { initializeSheets } from '@/lib/google-apps-script';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function SheetsInitializer() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initStatus, setInitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInitialize = async () => {
    setIsInitializing(true);
    setInitStatus('idle');
    setErrorMessage('');

    try {
      await initializeSheets();
      setInitStatus('success');
    } catch (error) {
      setInitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ');
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button 
          onClick={handleInitialize}
          disabled={isInitializing}
          variant="outline"
        >
          {isInitializing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              กำลังตั้งค่า Headers...
            </>
          ) : (
            'ตั้งค่า Headers ใน Google Sheets'
          )}
        </Button>
      </div>

      {initStatus === 'success' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ตั้งค่า Headers ใน Google Sheets สำเร็จแล้ว!
          </AlertDescription>
        </Alert>
      )}

      {initStatus === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div>
              <strong>เกิดข้อผิดพลาด:</strong>
              <p className="mt-1 text-sm">{errorMessage}</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}