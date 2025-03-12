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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
}

const templateFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nazwa musi mieć co najmniej 2 znaki.",
  }),
  subject: z.string().min(2, {
    message: "Temat musi mieć co najmniej 2 znaki.",
  }),
  body: z.string().min(10, {
    message: "Treść musi mieć co najmniej 10 znaków.",
  }),
});

const EmailTemplatesPage = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof templateFormSchema>>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      subject: "",
      body: "",
    },
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate && isEditDialogOpen) {
      form.setValue("name", selectedTemplate.name);
      form.setValue("subject", selectedTemplate.subject);
      form.setValue("body", selectedTemplate.body);
    }
  }, [selectedTemplate, isEditDialogOpen, form]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      setTemplates(data || []);
    } catch (error: any) {
      console.error("Error loading email templates:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować szablonów email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTemplate = async (
    values: z.infer<typeof templateFormSchema>,
  ) => {
    if (!selectedTemplate) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("email_templates")
        .update({
          subject: values.subject,
          body: values.body,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedTemplate.id)
        .select();

      if (error) throw error;

      toast({
        title: "Sukces",
        description: "Szablon email został zaktualizowany",
        variant: "default",
      });

      setIsEditDialogOpen(false);
      loadTemplates();
    } catch (error: any) {
      console.error("Error updating email template:", error);
      toast({
        title: "Błąd",
        description:
          error.message || "Nie udało się zaktualizować szablonu email",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsEditDialogOpen(true);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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

        {/* Email Templates Content */}
        <main className="flex-1 overflow-auto">
          <div className="w-full h-full p-6 overflow-auto bg-gray-50">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight">
                Szablony Email
              </h1>
              <p className="text-muted-foreground mt-1">
                Zarządzaj szablonami wiadomości email używanymi w systemie
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Szablony Email</CardTitle>
                <CardDescription>
                  Edytuj szablony wiadomości email używane w systemie
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
                        <TableHead>Nazwa</TableHead>
                        <TableHead>Temat</TableHead>
                        <TableHead>Ostatnia aktualizacja</TableHead>
                        <TableHead className="text-right">Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {templates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            Brak szablonów email
                          </TableCell>
                        </TableRow>
                      ) : (
                        templates.map((template) => (
                          <TableRow key={template.id}>
                            <TableCell className="font-medium">
                              {template.name}
                            </TableCell>
                            <TableCell>{template.subject}</TableCell>
                            <TableCell>
                              {new Date(template.updated_at).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(template)}
                              >
                                <Edit2 className="h-4 w-4" />
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

            {/* Edit Template Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Edytuj szablon email</DialogTitle>
                  <DialogDescription>
                    {selectedTemplate && (
                      <>Edytuj szablon email: {selectedTemplate.name}</>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleEditTemplate)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nazwa szablonu</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temat</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="body"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Treść (HTML)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="min-h-[300px] font-mono text-sm"
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">
                            Dostępne zmienne: {{ first_name }},{" "}
                            {{ invitation_link }},{{ reset_link }},{" "}
                            {{ login_link }}
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                      >
                        Anuluj
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Zapisz zmiany
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmailTemplatesPage;
