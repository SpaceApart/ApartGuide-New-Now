export type UserRole = "super_admin" | "admin" | "team_member" | "guest";

export type TeamRole = "cleaning" | "maintenance" | "reception" | "other";

export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyTeamMember {
  id: string;
  property_id: string;
  user_id: string;
  team_role: string;
  created_at: string;
  user?: Profile;
  property?: Property;
}
