import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { CheckCircle2, Info, XCircle } from "lucide-react"; // 상태별 아이콘

// StatusDialog에 필요한 props 타입 정의
interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  status?: "success" | "info" | "error";
}

// 상태에 따라 다른 아이콘과 색상을 반환하는 맵
const statusConfig = {
  success: {
    icon: <CheckCircle2 className="h-16 w-16 text-green-500" />,
    actionClass: "bg-green-600 hover:bg-green-700",
  },
  info: {
    icon: <Info className="h-16 w-16 text-blue-500" />,
    actionClass: "bg-blue-600 hover:bg-blue-700",
  },
  error: {
    icon: <XCircle className="h-16 w-16 text-red-500" />,
    actionClass: "bg-red-600 hover:bg-red-700",
  },
};

export function StatusDialog({
  open,
  onOpenChange,
  title,
  description,
  status = "info",
}: StatusDialogProps) {
  const config = statusConfig[status];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex flex-col items-center text-center">
          {config.icon}
          <AlertDialogTitle className="mt-4 text-2xl">{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="mt-2">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button
              onClick={() => onOpenChange(false)}
              className={`w-full ${config.actionClass}`}
            >
              확인
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
