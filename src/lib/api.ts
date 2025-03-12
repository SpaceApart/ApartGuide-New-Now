import { supabase } from "./supabase";
import {
  Profile,
  Property,
  PropertyTeamMember,
  TeamRole,
  UserRole,
} from "@/types/roles";

// Profile functions
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

export async function updateProfile(
  profile: Partial<Profile> & { id: string },
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", profile.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return null;
  }

  return data;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }

  return data || [];
}

// Property functions
export async function createProperty(
  property: Omit<Property, "id" | "created_at" | "updated_at">,
): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .insert(property)
    .select()
    .single();

  if (error) {
    console.error("Error creating property:", error);
    return null;
  }

  return data;
}

export async function getProperty(
  propertyId: string,
): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    return null;
  }

  return data;
}

export async function updateProperty(
  property: Partial<Property> & { id: string },
): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .update(property)
    .eq("id", property.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating property:", error);
    return null;
  }

  return data;
}

export async function deleteProperty(propertyId: string): Promise<boolean> {
  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", propertyId);

  if (error) {
    console.error("Error deleting property:", error);
    return false;
  }

  return true;
}

export async function getPropertiesByOwner(
  ownerId: string,
): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }

  return data || [];
}

export async function getAllProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all properties:", error);
    return [];
  }

  return data || [];
}

// Team member functions
export async function addTeamMember(
  propertyId: string,
  userId: string,
  teamRole: TeamRole,
): Promise<PropertyTeamMember | null> {
  const { data, error } = await supabase
    .from("property_team")
    .insert({
      property_id: propertyId,
      user_id: userId,
      team_role: teamRole,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding team member:", error);
    return null;
  }

  return data;
}

export async function removeTeamMember(
  propertyId: string,
  userId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("property_team")
    .delete()
    .eq("property_id", propertyId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error removing team member:", error);
    return false;
  }

  return true;
}

export async function getPropertyTeamMembers(
  propertyId: string,
): Promise<PropertyTeamMember[]> {
  const { data, error } = await supabase
    .from("property_team")
    .select(
      `
      *,
      user:user_id(id, email, first_name, last_name, avatar_url, role)
    `,
    )
    .eq("property_id", propertyId);

  if (error) {
    console.error("Error fetching team members:", error);
    return [];
  }

  return data || [];
}

export async function getUserTeamAssignments(
  userId: string,
): Promise<PropertyTeamMember[]> {
  const { data, error } = await supabase
    .from("property_team")
    .select(
      `
      *,
      property:property_id(*)
    `,
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user assignments:", error);
    return [];
  }

  return data || [];
}

// User management functions for admins
export async function inviteTeamMember(
  email: string,
  role: UserRole = "team_member",
  firstName?: string,
  lastName?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // This would typically send an invitation email with a signup link
    // For now, we'll just create a user directly
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        role,
        firstName,
        lastName,
      },
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error inviting team member:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user role:", error);
    return false;
  }

  return true;
}
