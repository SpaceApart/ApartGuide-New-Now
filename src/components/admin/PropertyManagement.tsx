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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Home, Edit2, Trash2, Plus, Users } from "lucide-react";
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getPropertiesByOwner,
  updateProperty,
} from "@/lib/api";
import { Property } from "@/types/roles";
import { useRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";

const propertyFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nazwa musi mieć co najmniej 2 znaki.",
  }),
  address: z.string().min(5, {
    message: "Adres musi mieć co najmniej 5 znaków.",
  }),
  city: z.string().min(2, {
    message: "Miasto musi mieć co najmniej 2 znaki.",
  }),
  country: z.string().min(2, {
    message: "Kraj musi mieć co najmniej 2 znaki.",
  }),
});

const PropertyManagement = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const { toast } = useToast();
  const { isSuperAdmin } = useRole();
  const { user } = useAuth();

  const propertyForm = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      country: "",
    },
  });

  useEffect(() => {
    loadProperties();
  }, [isSuperAdmin, user]);

  useEffect(() => {
    if (selectedProperty && isEditDialogOpen) {
      propertyForm.setValue("name", selectedProperty.name);
      propertyForm.setValue("address", selectedProperty.address || "");
      propertyForm.setValue("city", selectedProperty.city || "");
      propertyForm.setValue("country", selectedProperty.country || "");
    }
  }, [selectedProperty, isEditDialogOpen]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      let propertiesList: Property[] = [];

      if (isSuperAdmin) {
        // Super admins can see all properties
        propertiesList = await getAllProperties();
      } else if (user) {
        // Regular admins can only see their own properties
        propertiesList = await getPropertiesByOwner(user.id);
      }

      setProperties(propertiesList);
    } catch (error) {
      console.error("Error loading properties:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować listy obiektów",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProperty = async (
    values: z.infer<typeof propertyFormSchema>,
  ) => {
    if (!user) return;

    try {
      const newProperty = await createProperty({
        name: values.name,
        address: values.address,
        city: values.city,
        country: values.country,
        owner_id: user.id,
      });

      if (newProperty) {
        toast({
          title: "Obiekt dodany",
          description: `Obiekt ${values.name} został pomyślnie dodany`,
          variant: "default",
        });
        setIsAddDialogOpen(false);
        propertyForm.reset();
        loadProperties();
      } else {
        throw new Error("Nie udało się dodać obiektu");
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się dodać obiektu",
        variant: "destructive",
      });
    }
  };

  const handleEditProperty = async (
    values: z.infer<typeof propertyFormSchema>,
  ) => {
    if (!selectedProperty) return;

    try {
      const updatedProperty = await updateProperty({
        id: selectedProperty.id,
        name: values.name,
        address: values.address,
        city: values.city,
        country: values.country,
      });

      if (updatedProperty) {
        toast({
          title: "Obiekt zaktualizowany",
          description: `Obiekt ${values.name} został pomyślnie zaktualizowany`,
          variant: "default",
        });
        setIsEditDialogOpen(false);
        loadProperties();
      } else {
        throw new Error("Nie udało się zaktualizować obiektu");
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się zaktualizować obiektu",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten obiekt?")) return;

    try {
      const success = await deleteProperty(propertyId);

      if (success) {
        toast({
          title: "Obiekt usunięty",
          description: "Obiekt został pomyślnie usunięty",
          variant: "default",
        });
        loadProperties();
      } else {
        throw new Error("Nie udało się usunąć obiektu");
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się usunąć obiektu",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (property: Property) => {
    setSelectedProperty(property);
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    propertyForm.reset();
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Zarządzanie obiektami</CardTitle>
            <CardDescription>
              Zarządzaj swoimi obiektami noclegowymi
            </CardDescription>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Dodaj obiekt
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Ładowanie obiektów...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nazwa</TableHead>
                  <TableHead>Adres</TableHead>
                  <TableHead>Miasto</TableHead>
                  <TableHead>Kraj</TableHead>
                  {isSuperAdmin && <TableHead>Właściciel</TableHead>}
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isSuperAdmin ? 6 : 5}
                      className="text-center py-8"
                    >
                      Brak obiektów
                    </TableCell>
                  </TableRow>
                ) : (
                  properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Home className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">{property.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{property.address}</TableCell>
                      <TableCell>{property.city}</TableCell>
                      <TableCell>{property.country}</TableCell>
                      {isSuperAdmin && (
                        <TableCell>{property.owner_id}</TableCell>
                      )}
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2"
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Zespół
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(property)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProperty(property.id)}
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
        </CardContent>
      </Card>

      {/* Add Property Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dodaj nowy obiekt</DialogTitle>
            <DialogDescription>
              Wprowadź dane nowego obiektu noclegowego
            </DialogDescription>
          </DialogHeader>
          <Form {...propertyForm}>
            <form
              onSubmit={propertyForm.handleSubmit(handleAddProperty)}
              className="space-y-4"
            >
              <FormField
                control={propertyForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa obiektu</FormLabel>
                    <FormControl>
                      <Input placeholder="Apartament Morski" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={propertyForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres</FormLabel>
                    <FormControl>
                      <Input placeholder="ul. Przykładowa 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={propertyForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Miasto</FormLabel>
                      <FormControl>
                        <Input placeholder="Warszawa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={propertyForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kraj</FormLabel>
                      <FormControl>
                        <Input placeholder="Polska" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Dodaj obiekt</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Property Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj obiekt</DialogTitle>
            <DialogDescription>
              {selectedProperty && (
                <>Edytuj dane obiektu {selectedProperty.name}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <Form {...propertyForm}>
            <form
              onSubmit={propertyForm.handleSubmit(handleEditProperty)}
              className="space-y-4"
            >
              <FormField
                control={propertyForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa obiektu</FormLabel>
                    <FormControl>
                      <Input placeholder="Apartament Morski" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={propertyForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres</FormLabel>
                    <FormControl>
                      <Input placeholder="ul. Przykładowa 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={propertyForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Miasto</FormLabel>
                      <FormControl>
                        <Input placeholder="Warszawa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={propertyForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kraj</FormLabel>
                      <FormControl>
                        <Input placeholder="Polska" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Zapisz zmiany</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyManagement;
