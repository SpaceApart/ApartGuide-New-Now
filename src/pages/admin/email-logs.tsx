import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";

interface EmailLog {
  id: string;
  template_name: string;
  recipient: string;
  subject: string;
  status: string;
  provider_response: any;
  created_at: string;
}

const EmailLogsPage = () => {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("email_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      setLogs(data || []);
    } catch (error: any) {
      console.error("Error loading email logs:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować logów email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openDetailsDialog = (log: EmailLog) => {
    setSelectedLog(log);
    setIsDetailsDialogOpen(true);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-100 text-green-800">Wysłany</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Oczekujący</Badge>
        );
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Błąd</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Mock user data
  const user = {
    name: "Jane Cooper",
    email: "jane@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <DashboardHeader user={user} notificationCount={3} />

        {/* Email Logs Content */}
        <main className="flex-1 overflow-auto">
          <div className="w-full h-full p-6 overflow-auto bg-gray-50">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Logi Email
                </h1>
                <p className="text-muted-foreground mt-1">
                  Historia wysłanych wiadomości email
                </p>
              </div>
              <Button onClick={loadLogs} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Odśwież
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Historia wiadomości email</CardTitle>
                <CardDescription>
                  Lista ostatnich 100 wiadomości email wysłanych przez system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Szablon</TableHead>
                        <TableHead>Odbiorca</TableHead>
                        <TableHead>Temat</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Brak logów email
                          </TableCell>
                        </TableRow>
                      ) : (
                        logs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-medium">
                              {log.template_name}
                            </TableCell>
                            <TableCell>{log.recipient}</TableCell>
                            <TableCell>{log.subject}</TableCell>
                            <TableCell>{getStatusBadge(log.status)}</TableCell>
                            <TableCell>
                              {new Date(log.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDetailsDialog(log)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Log Details Dialog */}
            <Dialog
              open={isDetailsDialogOpen}
              onOpenChange={setIsDetailsDialogOpen}
            >
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Szczegóły wiadomości email</DialogTitle>
                  <DialogDescription>
                    {selectedLog && (
                      <>
                        Wysłano:{" "}
                        {new Date(selectedLog.created_at).toLocaleString()}
                      </>
                    )}
                  </DialogDescription>
                </DialogHeader>
                {selectedLog && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium">Szablon</h3>
                        <p>{selectedLog.template_name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Status</h3>
                        <p>{getStatusBadge(selectedLog.status)}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Odbiorca</h3>
                      <p>{selectedLog.recipient}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Temat</h3>
                      <p>{selectedLog.subject}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">
                        Odpowiedź dostawcy
                      </h3>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-xs">
                        {JSON.stringify(selectedLog.provider_response, null, 2)}
                      </pre>
                    </div>
                    <div className="flex justify-end">
                      <DialogClose asChild>
                        <Button variant="outline">Zamknij</Button>
                      </DialogClose>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmailLogsPage;
