import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Send, Mail, Phone, Loader2 } from "lucide-react";

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

interface TeamMemberListProps {
  teamMembers: TeamMember[];
  isLoading: boolean;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
  onSendInvitation: (member: TeamMember) => void;
  isInviting: boolean;
  activeTab: "all" | "cleaning" | "service";
  setActiveTab: (tab: "all" | "cleaning" | "service") => void;
}

const TeamMemberList = ({
  teamMembers,
  isLoading,
  onEdit,
  onDelete,
  onSendInvitation,
  isInviting,
  activeTab,
  setActiveTab,
}: TeamMemberListProps) => {
  const getTeamTypeLabel = (type: "cleaning" | "service") => {
    return type === "cleaning" ? "Serwis sprzątający" : "Obsługa obiektu";
  };

  const getTeamTypeBadgeColor = (type: "cleaning" | "service") => {
    return type === "cleaning"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  const filteredTeamMembers = teamMembers.filter((member) => {
    if (activeTab === "all") return true;
    return member.team_type === activeTab;
  });

  return (
    <>
      <div className="mb-4">
        <div className="flex space-x-2">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
          >
            Wszyscy
          </Button>
          <Button
            variant={activeTab === "service" ? "default" : "outline"}
            onClick={() => setActiveTab("service")}
          >
            Obsługa obiektu
          </Button>
          <Button
            variant={activeTab === "cleaning" ? "default" : "outline"}
            onClick={() => setActiveTab("cleaning")}
          >
            Serwis sprzątający
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Ładowanie członków zespołu...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Osoba</TableHead>
              <TableHead>Kontakt</TableHead>
              <TableHead>Rola</TableHead>
              <TableHead>Zespół</TableHead>
              <TableHead className="text-right">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeamMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Brak członków zespołu
                </TableCell>
              </TableRow>
            ) : (
              filteredTeamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback>
                          {member.first_name[0]}
                          {member.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.first_name} {member.last_name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <Badge
                      className={getTeamTypeBadgeColor(member.team_type)}
                      variant="outline"
                    >
                      {getTeamTypeLabel(member.team_type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(member)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSendInvitation(member)}
                      disabled={isInviting || member.has_account}
                      title={
                        member.has_account
                          ? "Użytkownik już posiada konto"
                          : "Wyślij zaproszenie"
                      }
                    >
                      {isInviting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send
                          className={`h-4 w-4 ${member.has_account ? "text-gray-300" : "text-blue-500"}`}
                        />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(member.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default TeamMemberList;
