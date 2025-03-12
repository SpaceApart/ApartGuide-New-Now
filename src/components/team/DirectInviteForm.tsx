import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { sendInvitationEmail } from "@/lib/email";
import { Loader2, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const inviteFormSchema = z.object({
  first_name: z.string().min(2, {
    message: "Imię musi mieć co najmniej 2 znaki.",
  }),
  last_name: z.string().min(2, {
    message: "Nazwisko musi mieć co najmniej 2 znaki.",
  }),
  email: z.string().email({
    message: "Wprowadź poprawny adres email.",
  }),
  phone: z.string().optional(),
  role: z.string().min(2, {
    message: "Rola musi mieć co najmniej 2 znaki.",
  }),
  team_type: z.enum(["cleaning", "service"], {
    message: "Wybierz typ zespołu.",
  }),
});

interface DirectInviteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  onShowInvitationDetails?: (details: {
    email: string;
    firstName: string;
    invitationLink: string;
    tempPassword: string;
  }) => void;
}

const DirectInviteForm = ({
  onSuccess,
  onCancel,
  onShowInvitationDetails,
}: DirectInviteFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "",
      team_type: "service",
    },
  });

  const handleSubmit = async (values: z.infer<typeof inviteFormSchema>) => {
    setIsSubmitting(true);
    try {
      // Check if team member with this email already exists
      const { data: existingTeamMember, error: teamMemberCheckError } =
        await supabase
          .from("team_members")
          .select("*")
          .eq("email", values.email)
          .maybeSingle();

      if (teamMemberCheckError && teamMemberCheckError.code !== "PGRST116") {
        throw teamMemberCheckError;
      }

      if (existingTeamMember) {
        toast({
          title: "Błąd",
          description:
            "Członek zespołu z tym adresem email już istnieje w systemie",
          variant: "destructive",
        });
        return;
      }

      // Create team member record
      const { data: teamMember, error: insertError } = await supabase
        .from("team_members")
        .insert([
          {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            phone: values.phone,
            role: values.role,
            team_type: values.team_type,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Generujemy tymczasowe hasło
      const tempPassword =
        Math.random().toString(36).slice(-10) +
        Math.random().toString(36).toUpperCase().slice(-2) +
        "!1";

      // Zapisujemy zaproszenie w bazie danych
      const { data: invitationData, error: invitationError } = await supabase
        .from("invitations")
        .insert([
          {
            email: values.email,
            first_name: values.first_name,
            last_name: values.last_name,
            role: "team_member",
            team_type: values.team_type,
            temp_password: tempPassword,
          },
        ])
        .select();

      if (invitationError) throw invitationError;

      // Generujemy link do aktywacji konta
      const invitationLink = `${window.location.origin}/auth/invitation?email=${encodeURIComponent(values.email)}`;

      // Wysyłamy email z zaproszeniem
      const { success: emailSuccess } = await sendInvitationEmail(
        values.email,
        values.first_name,
        invitationLink,
      );

      // Nie oznaczamy członka zespołu jako mającego konto na tym etapie
      // To zostanie zaktualizowane dopiero po faktycznym utworzeniu konta przez użytkownika
      // w procesie aktywacji zaproszenia

      // Zapisz dane zaproszenia do późniejszego wyświetlenia
      const invitationDetails = {
        email: values.email,
        firstName: values.first_name,
        invitationLink,
        tempPassword,
      };

      toast({
        title: "Zaproszenie wysłane",
        description: (
          <div>
            <p>Zaproszenie zostało wysłane na adres {values.email}.</p>
            {emailSuccess ? (
              <p className="mt-2 text-green-600">
                Email z instrukcjami został wysłany.
              </p>
            ) : (
              <p className="mt-2 text-amber-600">
                Nie udało się wysłać emaila, ale zaproszenie zostało utworzone.
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() =>
                onShowInvitationDetails &&
                onShowInvitationDetails(invitationDetails)
              }
            >
              <Eye className="h-4 w-4 mr-2" />
              Pokaż szczegóły zaproszenia
            </Button>
          </div>
        ),
        variant: "default",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Error inviting team member:", error);
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się wysłać zaproszenia",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię</FormLabel>
                <FormControl>
                  <Input placeholder="Jan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwisko</FormLabel>
                <FormControl>
                  <Input placeholder="Kowalski" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="jan.kowalski@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon (opcjonalnie)</FormLabel>
              <FormControl>
                <Input placeholder="+48 123 456 789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stanowisko</FormLabel>
              <FormControl>
                <Input placeholder="np. Recepcjonista" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="team_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typ zespołu</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz typ zespołu" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="service">Obsługa obiektu</SelectItem>
                  <SelectItem value="cleaning">Serwis sprzątający</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Wyślij zaproszenie
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DirectInviteForm;
