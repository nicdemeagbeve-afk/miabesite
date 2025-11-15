"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, ControllerRenderProps, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from 'next/navigation'; // Assurez-vous d'importer useRouter
import { createClient } from '@/lib/supabase/client'; // Assurez-vous que le chemin est correct
import { FaGoogle, FaFacebookF, FaInstagram } from 'react-icons/fa';
import type { Provider } from '@supabase/supabase-js';
import { PhoneInputWithCountryCode } from "@/components/PhoneInputWithCountryCode";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parse, isValid, subYears } from "date-fns"; // Import subYears
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn, generateUniqueReferralCode } from "@/lib/utils"; // Import generateUniqueReferralCode
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox

// Schéma Zod CORRIGÉ pour correspondre à votre formulaire
const signupSchema = z.object({
  firstName: z.string().min(1, { message: "Le prénom est requis." }),
  lastName: z.string().min(1, { message: "Le nom de famille est requis." }),
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
  confirmPassword: z.string(),
  dateOfBirth: z.date().optional().nullable(), // Utilisez z.date() si vous utilisez un calendrier
  phoneNumber: z.string().optional(),
  expertise: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les termes et conditions.",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"], // Affiche l'erreur sous le champ de confirmation
});

type SignupFormData = z.infer<typeof signupSchema>; // Define type for form data

export function SignupForm() {
  const router = useRouter(); // Initialisez le hook useRouter
  const supabase = createClient(); // Initialisez le client Supabase
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupFormData>({ // Use SignupFormData here
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      expertise: "",
      termsAccepted: false, // Default to false
    },
  });

  // Calculate the date 18 years ago for default calendar view
  const eighteenYearsAgo = subYears(new Date(), 18);

  const [dateInput, setDateInput] = React.useState<string>(
    form.getValues("dateOfBirth") ? format(form.getValues("dateOfBirth")!, "yyyy/MM/dd") : ""
  );

  React.useEffect(() => {
    const dob = form.watch("dateOfBirth");
    if (dob && isValid(dob)) {
      setDateInput(format(dob, "yyyy/MM/dd"));
    } else {
      setDateInput("");
    }
  }, [form.watch("dateOfBirth")]); // Watch for changes in the form's dateOfBirth

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

    // Auto-insert slashes
    if (value.length > 4) {
      value = value.slice(0, 4) + '/' + value.slice(4);
    }
    if (value.length > 7) {
      value = value.slice(0, 7) + '/' + value.slice(7);
    }
    value = value.slice(0, 10); // Max length AAAA/MM/JJ

    e.target.value = value; // Update input value visually

    setDateInput(value);

    // Attempt to parse the date
    const parsedDate = parse(value, "yyyy/MM/dd", new Date());

    if (isValid(parsedDate) && value.length === 10) { // Only update form if valid and complete
      form.setValue("dateOfBirth", parsedDate, { shouldValidate: true });
    } else if (value === "") {
      form.setValue("dateOfBirth", undefined, { shouldValidate: true });
    }
  };

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    setError(null);

    // Déstructuration des valeurs du formulaire
    const { email, password, firstName, lastName, dateOfBirth, phoneNumber, expertise } = values;
    // On crée fullName à partir de firstName et lastName
    const fullName = `${firstName} ${lastName}`.trim();

    // Définir l'URL de redirection vers la route de callback, en spécifiant la destination finale
    const redirectToUrl = `${window.location.origin}/auth/callback?next=/dashboard/sites`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth?.toISOString().split('T')[0], // Formatte la date pour la BDD
          phone_number: phoneNumber,
          expertise: expertise,
        },
        emailRedirectTo: redirectToUrl, // Utiliser la redirection pour la confirmation par e-mail
      },
    });

    if (error) {
      // AFFICHER L'ERREUR COMPLÈTE DANS LA CONSOLE
      console.error("Erreur Supabase Auth:", error); 
      setError(error.message);
      setIsLoading(false);
    } else {
      // Rediriger vers une page informant l'utilisateur de vérifier son e-mail
      router.push(`/auth/check-email?email=${encodeURIComponent(values.email)}`);
    }
  }

  const handleOAuthSignIn = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Inscription</CardTitle>
          <CardDescription>
            Créez votre compte pour commencer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}> {/* Explicitly pass the form object */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }: { field: ControllerRenderProps<SignupFormData, "firstName"> }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }: { field: ControllerRenderProps<SignupFormData, "lastName"> }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }: { field: ControllerRenderProps<SignupFormData, "dateOfBirth"> }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de naissance</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <div className="relative flex items-center">
                            <Input
                              placeholder="AAAA/MM/JJ"
                              value={dateInput}
                              onChange={handleDateInputChange}
                              className={cn(
                                "w-full pl-3 pr-10 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            />
                            <CalendarIcon className="absolute right-3 h-4 w-4 opacity-50 pointer-events-none" />
                          </div>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined} // FIX: Pass undefined if null
                          onSelect={(date: Date | undefined) => {
                            field.onChange(date);
                            if (date) {
                              setDateInput(format(date, "yyyy/MM/dd"));
                            } else {
                              setDateInput("");
                            }
                          }}
                          disabled={(date: Date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={fr}
                          defaultMonth={eighteenYearsAgo} // Set default month to 18 years ago
                          captionLayout="dropdown-buttons" // Enable dropdowns for month/year
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }: { field: ControllerRenderProps<SignupFormData, "phoneNumber"> }) => (
                  <PhoneInputWithCountryCode
                    name={field.name}
                    label="Numéro de Téléphone"
                    placeholder="Ex: 07 00 00 00 00"
                    required
                  />
                )}
              />
              <FormField
                control={form.control}
                name="expertise"
                render={({ field }: { field: ControllerRenderProps<SignupFormData, "expertise"> }) => (
                  <FormItem>
                    <FormLabel>Domaine d'expertise / Travail</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Développeur Web" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }: { field: ControllerRenderProps<SignupFormData, "email"> }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }: { field: ControllerRenderProps<SignupFormData, "password"> }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }: { field: ControllerRenderProps<SignupFormData, "confirmPassword"> }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }: { field: ControllerRenderProps<SignupFormData, "termsAccepted"> }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        J'accepte les{" "}
                        <Link href="/legal" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                          Conditions Générales d'Utilisation
                        </Link>{" "}
                        et la{" "}
                        <Link href="/legal" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                          Politique de Confidentialité
                        </Link>
                        .
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Inscription en cours..." : "S'inscrire"}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Ou continuer avec
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={() => handleOAuthSignIn('google')}>
              <FaGoogle className="mr-2 h-4 w-4" /> Google
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleOAuthSignIn('facebook')}>
              <FaFacebookF className="mr-2 h-4 w-4" /> Facebook
            </Button>
            <Button variant="outline" className="w-full" onClick={() => toast.info("Instagram login requires additional setup and is not a direct Supabase provider.")} disabled>
              <FaInstagram className="mr-2 h-4 w-4" /> Instagram
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Connectez-vous
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}