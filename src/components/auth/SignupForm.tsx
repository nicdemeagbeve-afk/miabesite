"use client";

import React from "react";
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
import { format, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn, generateUniqueReferralCode } from "@/lib/utils"; // Import generateUniqueReferralCode
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom est requis." }).max(50, { message: "Le prénom ne peut pas dépasser 50 caractères." }),
  lastName: z.string().min(2, { message: "Le nom est requis." }).max(50, { message: "Le nom ne peut pas dépasser 50 caractères." }),
  dateOfBirth: z.date()
    .max(new Date(), "La date de naissance ne peut pas être dans le futur.")
    .optional() // Allow undefined as a type
    .refine((date) => date, { // Make it logically required
      message: "La date de naissance est requise.",
    }),
  phoneNumber: z.string().regex(/^\+?\d{8,15}$/, "Veuillez entrer un numéro de téléphone valide."),
  expertise: z.string().min(3, { message: "Le domaine d'expertise est requis." }).max(100, { message: "Le domaine d'expertise ne peut pas dépasser 100 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les conditions générales d'utilisation et la politique de confidentialité.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof formSchema>; // Define type for form data

export function SignupForm() {
  const router = useRouter(); // Initialisez le hook useRouter
  const supabase = createClient(); // Initialisez le client Supabase
  const form = useForm<SignupFormData>({ // Use SignupFormData here
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: undefined, // Changed from null
      phoneNumber: "",
      expertise: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false, // Default to false
    },
  });

  const [dateInput, setDateInput] = React.useState<string>(
    form.getValues("dateOfBirth") ? format(form.getValues("dateOfBirth")!, "yyyy/MM/dd") : ""
  );

  React.useEffect(() => {
    const dob = form.getValues("dateOfBirth");
    if (dob && isValid(dob)) {
      setDateInput(format(dob, "yyyy/MM/dd"));
    } else {
      setDateInput("");
    }
  }, [form.watch("dateOfBirth")]); // Watch for changes in the form's dateOfBirth

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInput(value);

    // Attempt to parse the date
    const parsedDate = parse(value, "yyyy/MM/dd", new Date());

    if (isValid(parsedDate) && value.length === 10) { // Only update form if valid and complete
      form.setValue("dateOfBirth", parsedDate, { shouldValidate: true });
    } else if (value === "") {
      form.setValue("dateOfBirth", undefined, { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<SignupFormData> = async (values) => { // Explicitly type onSubmit
    const { email, password, firstName, lastName, dateOfBirth, phoneNumber, expertise } = values;
    
    // 1. Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/callback`,
        // We will store profile data in the new 'profiles' table, not user_metadata directly
        // Keeping these for backward compatibility if other parts of the app still rely on them
        data: {
          full_name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth?.toISOString().split('T')[0],
          phone_number: phoneNumber,
          expertise: expertise,
        },
      },
    });

    if (authError) {
      toast.error(authError.message);
      form.setValue("password", "");
      form.setValue("confirmPassword", "");
      return;
    }

    if (authData.user) {
      // 2. Generate a unique referral code
      let referralCode: string | null = null;
      try {
        referralCode = await generateUniqueReferralCode(supabase);
      } catch (codeError: any) {
        console.error("Failed to generate referral code:", codeError);
        toast.error(`Erreur lors de la génération du code de parrainage: ${codeError.message}`);
        // Continue without referral code if generation fails, or handle as critical error
      }

      // 3. Insert user profile into the new 'profiles' table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth?.toISOString().split('T')[0],
          phone_number: phoneNumber,
          whatsapp_number: phoneNumber, // Assuming primary phone is whatsapp for now
          expertise: expertise,
          referral_code: referralCode,
          coin_points: 0,
          referral_count: 0,
        });

      if (profileError) {
        console.error("Error inserting profile:", profileError);
        toast.error(`Erreur lors de la création du profil: ${profileError.message}`);
        // Consider rolling back auth.signUp if profile creation is critical
        return;
      }

      toast.success("Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.");
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
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
                          selected={field.value} // field.value is Date | undefined
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