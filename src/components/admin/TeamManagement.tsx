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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserPlus, Trash2 } from "lucide-react";
import {
  addTeamMember,
  getAllProfiles,
  getPropertyTeamMembers,
  removeTeamMember,
} from "@/lib/api";
import { Profile, PropertyTeamMember, TeamRole } from "@/types/roles";

interface TeamManagementProps {
  propertyId: string;
  propertyName: string;
}

const teamMemberFormSchema = z.object({
  userId: z.string().min(1, {
    message: "Wybierz użytkownika.",
  }),
  teamRole: z.enum(["cleaning", "maintenance", "reception", "other"]),
});

const TeamManagement = ({
  propertyId,
  propertyName,
}: TeamManagementProps) => {
  const [teamMembers, setTeamMembers] = useState<PropertyTeamMember[]>([]);
  const [availableUsers, setAvailableUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const teamMemberForm = useForm<z.infer<typeof teamMemberFormSchema>>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      userId: "",
      teamRole: "cleaning",
    },
  });

  useEffect(() => {
    loadTeamMembers();
    loadAvailableUsers();
  }, [propertyId]);

  const loadTeamMembers = async () => {
    setIsLoading(true);
    try {
      const members = await getPropertyTeamMembers(propertyId);
      setTeamMembers(members);
    } catch (error) {
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

  const loadAvailableUsers = async () => {
    try {
      const profiles = await getAllProfiles();
      // Filter to only show team_member role users
      const teamMembers = profiles.filter(
        (profile) => profile.role === "team_member"
      );
      setAvailableUsers(teamMembers);
    } catch (error) {
      console.error("Error loading available users:", error);
    }
  };

  const handleAddTeamMember = async (values: z.infer<typeof teamMemberFormSchema>) => {
    try {
      const result = await addTeamMember(
        propertyId,
        values.userId,
        values.teamRole as TeamRole
      );

      if (result) {
        toast({
          title: "Członek zespołu dodany",
          description: "Użytkownik został pomyślnie dodany do zespołu",
          variant: "default",
        });
        setIsAddDialogOpen(false);
        teamMemberForm.reset();
        loadTeamMembers();
      } else {
        throw new Error("Nie udało się dodać członka zespołu");
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się dodać członka zespołu",
        variant: "destructive",
      });
    }
  };

  const handleRemoveTeamMember = async (userId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tego członka zespołu?")) return;

    try {
      const success = await removeTeamMember(propertyId, userId);

      if (success) {
        toast({
          title: "Członek zespołu usunięty",
          description: "Użytkownik został pomyślnie usunięty z zespołu",
          variant: "default",
        });
        loadTeamMembers();
      } else {
        throw new Error("Nie udało się usunąć członka zespołu");
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się usunąć członka zespołu",
        variant: "destructive",
      });
    }
  };

  const getTeamRoleLabel = (role: string) => {
    switch (role) {
      case "cleaning":
        return "Sprzątanie";
      case "maintenance":
        return "Konserwacja";
      case "reception":
        return "Recepcja";
      case "other":
      default:
        return "Inne";
    }
  };

  const getTeamRoleBadgeColor = (role: string) => {
    switch (role) {
      case "cleaning":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-amber-100 text-amber-800";
      case "reception":
        return "bg-green-100 text-green-800";
      case "other":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Zespół obiektu: {propertyName}</CardTitle>
            <CardDescription>
              Zarządzaj członkami zespołu przypisanymi do tego obiektu
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Dodaj członka zespołu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj członka zespołu</DialogTitle>
                <DialogDescription>
                  Przypisz użytkownika do zespołu obiektu {propertyName}
                </DialogDescription>
              </DialogHeader>
              <Form {...teamMemberForm}>
                <form
                  onSubmit={teamMemberForm.handleSubmit(handleAddTeamMember)}
                  className="space-y-4"
                >
                  <FormField
                    control={teamMemberForm.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Użytkownik</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz użytkownika" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.first_name} {user.last_name} ({user.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={teamMemberForm.control}
                    name="teamRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rola w zespole</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz rolę" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cleaning">Sprzątanie</SelectItem>
                            <SelectItem value="maintenance">
                              Konserwacja
                            </SelectItem>
                            <SelectItem value="reception">Recepcja</SelectItem>
                            <SelectItem value="other">Inne</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Dodaj do zespołu</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Ładowanie członków zespołu...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Użytkownik</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rola w zespole</TableHead>
                  <TableHead>Data dodania</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
