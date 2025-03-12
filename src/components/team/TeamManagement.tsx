import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Send, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { deleteUser } from "@/lib/api-user-management";
import { sendInvitationEmail } from "@/lib/email";
import TeamMemberForm, { teamMemberFormSchema } from "./TeamMemberForm";
import TeamMemberList from "./TeamMemberList";
import * as z from "zod";

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  team_type: "cleaning" | "service";
  avatar_url?: string;
  created_at: string;
  has_account?: boolean;
}

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [lastInvitation, setLastInvitation] = useState<{
    email: string;
    firstName: string;
    invitationLink: string;
    tempPassword: string;
  } | null>(null);
  const [isInvitationDetailsOpen, setIsInvitationDetailsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "cleaning" | "service">(
    "all",
  );
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTeamMembers(data || []);
    } catch (error: any) {
      console.error("Error loading team members:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować listy członków zespołu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTeamMember = async (
    values: z.infer<typeof teamMemberFormSchema>,
  ) => {
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
      const { data, error } = await supabase
        .from("team_members")
        .insert([
          {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            phone: values.phone,
            role: values.role,
            team_type: values.team_type,
            created_by: user?.id,
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Sukces",
        description: "Członek zespołu został dodany",
        variant: "default",
      });

      setIsAddDialogOpen(false);
      loadTeamMembers();
    } catch (error: any) {
      console.error("Error adding team member:", error);
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się dodać członka zespołu",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTeamMember = async (
    values: z.infer<typeof teamMemberFormSchema>,
  ) => {
    if (!selectedMember) return;

    setIsSubmitting(true);
    try {
      // Only check for email conflicts if the email has changed
      if (values.email !== selectedMember.email) {
        // Check if team member with this email already exists
        const { data: existingTeamMember, error: teamMemberCheckError } =
          await supabase
            .from("team_members")
            .select("*")
            .eq("email", values.email)
            .neq("id", selectedMember.id) // Exclude current member
            .maybeSingle();

        if (teamMemberCheckError && teamMemberCheckError.code !== "PGRST116") {
          throw teamMemberCheckError;
        }

        if (existingTeamMember) {
          toast({
            title: "Błąd",
            description:
              "Inny członek zespołu z tym adresem email już istnieje w systemie",
            variant: "destructive",
          });
          return;
        }
      }

      const { data, error } = await supabase
        .from("team_members")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone,
          role: values.role,
          team_type: values.team_type,
        })
        .eq("id", selectedMember.id)
        .select();

      if (error) throw error;

      toast({
        title: "Sukces",
        description: "Dane członka zespołu zostały zaktualizowane",
        variant: "default",
      });

      setIsEditDialogOpen(false);
      loadTeamMembers();
    } catch (error: any) {
      console.error("Error updating team member:", error);
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się zaktualizować danych",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (
      !confirm(
        "Czy na pewno chcesz usunąć tego członka zespołu? Ta operacja usunie również konto użytkownika jeśli istnieje.",
      )
    )
      return;

    try {
      // Znajdź członka zespołu, aby pobrać jego email
      const { data: teamMember, error: teamMemberError } = await supabase
        .from("team_members")
        .select("*")
        .eq("id", id)
        .single();

      if (teamMemberError) throw teamMemberError;

      if (!teamMember) {
        throw new Error("Nie znaleziono członka zespołu");
      }

      // Usuń użytkownika z auth, profiles i powiązań za pomocą Edge Function
      if (teamMember.has_account) {
        const { success, error: deleteUserError } = await deleteUser(
          teamMember.email,
        );

        if (!success) {
          console.error("Error deleting user:", deleteUserError);
        }
      }

      // Usuń członka zespołu
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sukces",
        description: "Członek zespołu został usunięty z systemu",
        variant: "default",
      });

      loadTeamMembers();
    } catch (error: any) {
      console.error("Error deleting team member:", error);
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się usunąć członka zespołu",
        variant: "destructive",
      });
    }
  };

  const handleSendInvitation = async (member: TeamMember) => {
    if (member.has_account) {
      toast({
        title: "Informacja",
        description: "Ten członek zespołu już posiada konto w systemie",
        variant: "default",
      });
      return;
    }

    setIsInviting(true);
    try {
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
            email: member.email,
            first_name: member.first_name,
            last_name: member.last_name,
            role: "team_member",
            team_type: member.team_type,
            temp_password: tempPassword,
          },
        ])
        .select();

      if (invitationError) throw invitationError;

      // Generujemy link do aktywacji konta
      const invitationLink = `${window.location.origin}/auth/invitation?email=${encodeURIComponent(member.email)}`;

      // Wysyłamy email z zaproszeniem
      const { success: emailSuccess } = await sendInvitationEmail(
        member.email,
        member.first_name,
        invitationLink,
      );

      // Nie oznaczamy członka zespołu jako mającego konto na tym etapie
      // To zostanie zaktualizowane dopiero po faktycznym utworzeniu konta przez użytkownika
      // w procesie aktywacji zaproszenia

      // Zapisz dane zaproszenia do późniejszego wyświetlenia
      setLastInvitation({
        email: member.email,
        firstName: member.first_name,
        invitationLink,
        tempPassword,
      });

      toast({
        title: "Zaproszenie wysłane",
        description: (
          <div>
            <p>Zaproszenie zostało wysłane na adres {member.email}.</p>
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
              onClick={() => setIsInvitationDetailsOpen(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Pokaż szczegóły zaproszenia
            </Button>
          </div>
        ),
        variant: "default",
      });

      // Refresh the team members list to update the has_account status
      loadTeamMembers();
    } catch (error: any) {
      console.error("Błąd wysyłania zaproszenia:", error);
      toast({
        title: "Błąd",
        description:
          error.message ||
          "Nie udało się wysłać zaproszenia. Spróbuj ponownie później.",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const openEditDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="w-full h-full p-6 overflow-auto bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Zarządzanie zespołem
        </h1>
        <p className="text-muted-foreground mt-1">
          Zarządzaj członkami zespołu obsługującymi obiekty i sprzątanie
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Członkowie zespołu</CardTitle>
            <CardDescription>
              Zarządzaj członkami zespołu obsługującymi obiekty i sprzątanie
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Dodaj członka zespołu
          </Button>
        </CardHeader>
        <CardContent>
          <TeamMemberList
            teamMembers={teamMembers}
            isLoading={isLoading}
            onEdit={openEditDialog}
            onDelete={handleDeleteTeamMember}
            onSendInvitation={handleSendInvitation}
            isInviting={isInviting}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </CardContent>
      </Card>

      {/* Add Team Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dodaj członka zespołu</DialogTitle>
            <DialogDescription>
              Wprowadź dane nowego członka zespołu.
            </DialogDescription>
          </DialogHeader>
          <TeamMemberForm
            onSubmit={handleAddTeamMember}
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={isSubmitting}
            mode="add"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Team Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj członka zespołu</DialogTitle>
            <DialogDescription>
              {selectedMember && (
                <>
                  Edytuj dane dla {selectedMember.first_name}{" "}
                  {selectedMember.last_name}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <TeamMemberForm
              onSubmit={handleEditTeamMember}
              onCancel={() => setIsEditDialogOpen(false)}
              isSubmitting={isSubmitting}
              initialValues={selectedMember}
              mode="edit"
              memberId={selectedMember.id}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Invitation Details Dialog */}
      <Dialog
        open={isInvitationDetailsOpen}
        onOpenChange={setIsInvitationDetailsOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Szczegóły zaproszenia</DialogTitle>
            <DialogDescription>
              {lastInvitation && (
                <>Dane zaproszenia dla {lastInvitation.firstName}</>
              )}
            </DialogDescription>
          </DialogHeader>
          {lastInvitation && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Email</h3>
                <p className="text-sm">{lastInvitation.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Link aktywacyjny</h3>
                <div className="bg-gray-50 p-3 rounded-md text-sm break-all">
                  <a
                    href={lastInvitation.invitationLink}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {lastInvitation.invitationLink}
                  </a>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      lastInvitation.invitationLink,
                    );
                    toast({
                      title: "Skopiowano",
                      description:
                        "Link aktywacyjny został skopiowany do schowka",
                      variant: "default",
                    });
                  }}
                >
                  Kopiuj link
                </Button>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Tymczasowe hasło</h3>
                <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
                  {lastInvitation.tempPassword}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(lastInvitation.tempPassword);
                    toast({
                      title: "Skopiowano",
                      description:
                        "Tymczasowe hasło zostało skopiowane do schowka",
                      variant: "default",
                    });
                  }}
                >
                  Kopiuj hasło
                </Button>
              </div>
              <div className="pt-4 flex justify-end">
                <Button onClick={() => setIsInvitationDetailsOpen(false)}>
                  Zamknij
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
