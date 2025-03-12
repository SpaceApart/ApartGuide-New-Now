import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2 } from "lucide-react";

const formSchema = z
  .object({
    password: z.string().min(6, {
      message: "Hasło musi mieć co najmniej 6 znaków.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne.",
    path: ["confirmPassword"],
  });

interface ResetPasswordFormProps {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  onBackToLogin?: () => void;
  token?: string;
}

const ResetPasswordForm = ({
  onSubmit = (values) => console.log(values),
  onBackToLogin = () => console.log("Back to login clicked"),
  token = "",
}: ResetPasswordFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({ ...values, token });
    setIsSubmitted(true);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      {isSubmitted ? (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">Hasło zostało zmienione</h1>
          <p className="text-muted-foreground">
            Twoje hasło zostało pomyślnie zresetowane. Możesz teraz zalogować
            się używając nowego hasła.
          </p>
          <Button className="mt-4" onClick={onBackToLogin}>
            Przejdź do logowania
          </Button>
        </div>
      ) : (
        <>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Ustaw nowe hasło</h1>
            <p className="text-muted-foreground">
              Wprowadź nowe hasło dla swojego konta
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nowe hasło</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Minimum 6 znaków"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potwierdź nowe hasło</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Powtórz hasło"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Resetuj hasło
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default ResetPasswordForm;
