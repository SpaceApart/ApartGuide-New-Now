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
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Wprowadź poprawny adres email.",
  }),
});

interface ForgotPasswordFormProps {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  onBackToLogin?: () => void;
}

const ForgotPasswordForm = ({
  onSubmit = (values) => console.log(values),
  onBackToLogin = () => console.log("Back to login clicked"),
}: ForgotPasswordFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <Button
        variant="ghost"
        className="flex items-center gap-2 -ml-2 mb-4"
        onClick={onBackToLogin}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Powrót do logowania</span>
      </Button>

      {isSubmitted ? (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">Sprawdź swoją skrzynkę email</h1>
          <p className="text-muted-foreground">
            Wysłaliśmy instrukcje resetowania hasła na podany adres email. Jeśli
            nie otrzymasz wiadomości w ciągu kilku minut, sprawdź folder spam.
          </p>
          <Button className="mt-4" onClick={onBackToLogin}>
            Powrót do logowania
          </Button>
        </div>
      ) : (
        <>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Zapomniałeś hasła?</h1>
            <p className="text-muted-foreground">
              Podaj swój adres email, a wyślemy Ci link do zresetowania hasła
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="twoj@email.pl"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Wyślij instrukcje resetowania
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
