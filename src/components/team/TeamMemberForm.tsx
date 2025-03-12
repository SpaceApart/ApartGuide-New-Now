import React, { useState, useCallback } from "react";
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
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "@/lib/debounce";

export const teamMemberFormSchema = z.object({
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

interface TeamMemberFormProps {
  onSubmit: (values: z.infer<typeof teamMemberFormSchema>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  initialValues?: Partial<z.infer<typeof teamMemberFormSchema>>;
  mode: "add" | "edit";
  memberId?: string;
}

export default function TeamMemberForm({
  onSubmit,
  onCancel,
  isSubmitting,
  initialValues,
  mode,
  memberId,
}: TeamMemberFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof teamMemberFormSchema>>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      first_name: initialValues?.first_name || "",
      last_name: initialValues?.last_name || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      role: initialValues?.role || "",
      team_type: initialValues?.team_type || "service",
    },
  });

  const handleFormSubmit = async (
    values: z.infer<typeof teamMemberFormSchema>,
  ) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
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
          render={({ field }) => {
            const [emailExists, setEmailExists] = useState(false);
            const [emailCheckMessage, setEmailCheckMessage] = useState("");
            const [isCheckingEmail, setIsCheckingEmail] = useState(false);

            const checkEmailExists = async (email: string) => {
              if (
                !email ||
                !email.includes("@") ||
                (mode === "edit" && email === initialValues?.email)
              )
                return;

              setIsCheckingEmail(true);
              try {
                // Check if team member with this email already exists
                const { data: existingTeamMember } = await supabase
                  .from("team_members")
                  .select("*")
                  .eq("email", email)
                  .maybeSingle();

                if (
                  existingTeamMember &&
                  (mode !== "edit" || existingTeamMember.id !== memberId)
                ) {
                  setEmailExists(true);
                  setEmailCheckMessage(
                    "Ten email jest już przypisany do członka zespołu",
                  );
                  return;
                }

                // Sprawdź czy użytkownik istnieje w auth bez wysyłania maila
                // Pobierz użytkowników z profili
                const { data: profileData, error: profileError } =
                  await supabase
                    .from("profiles")
                    .select("email")
                    .eq("email", email)
                    .maybeSingle();

                if (profileData) {
                  setEmailExists(true);
                  setEmailCheckMessage(
                    "Ten email jest już zarejestrowany w systemie",
                  );
                  return;
                }

                // Dodatkowe sprawdzenie w tabeli auth.users nie jest możliwe bez uprawnień administratora
                // Dlatego zakładamy, że jeśli nie ma w profiles, to email jest dostępny

                // If we got here, email is available
                setEmailExists(false);
                setEmailCheckMessage("Email jest dostępny");
              } catch (error) {
                console.error("Error checking email:", error);
                setEmailExists(false);
                setEmailCheckMessage("");
              } finally {
                setIsCheckingEmail(false);
              }
            };

            // Debounce function to avoid too many requests
            const debouncedCheckEmail = useCallback(
              debounce((email: string) => checkEmailExists(email), 500),
              [mode, memberId],
            );

            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="jan.kowalski@example.com"
                    type="email"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debouncedCheckEmail(e.target.value);
                    }}
                    disabled={mode === "edit" && initialValues?.email}
                  />
                </FormControl>
                {isCheckingEmail && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Sprawdzanie dostępności...
                  </div>
                )}
                {!isCheckingEmail && emailCheckMessage && (
                  <p
                    className={`text-xs ${emailExists ? "text-red-500" : "text-green-500"} mt-1`}
                  >
                    {emailCheckMessage}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            );
          }}
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
            {mode === "add" ? "Dodaj członka zespołu" : "Zapisz zmiany"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
