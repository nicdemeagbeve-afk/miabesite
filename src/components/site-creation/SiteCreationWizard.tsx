"use client";

import React from "react";
import { useForm, FormProvider, SubmitHandler, ControllerRenderProps, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form"; // Import Form component
import { WizardProgress } from "./WizardProgress";
import { WizardNavigation } from "./WizardNavigation";
import { createClient } from "@/lib/supabase/client"; // Import Supabase client
import { useRouter } from "next/navigation"; // Import useRouter
import { SiteEditorFormData } from "@/lib/schemas/site-editor-form-schema"; // Import the comprehensive schema type

// Import new step components
import { EssentialDesignStep } from "./steps/EssentialDesignStep";
import { ContentStep } from "./steps/ContentStep";
import { SkillsStep } from "./steps/SkillsStep"; // New step import
import { ProductsServicesStep } from "./steps/ProductsServicesStep"; // New step import
import { ConfigurationNetworkStep } from "./steps/ConfigurationNetworkStep";

// Utility function to generate a URL-friendly slug
const generateSlug = (text: string): string => {
  return text
    .toString()
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

// Define the base schema as a ZodObject, now directly using SiteEditorFormData for consistency
const wizardFormSchema = z.object({
  // Étape 1: Infos Essentielles & Design
  publicName: z.string().min(3, { message: "Le nom public est requis et doit contenir au moins 3 caractères." }).max(50, { message: "Le nom public ne peut pas dépasser 50 caractères." }),
  whatsappNumber: z.string().regex(/^\+?\d{8,15}$/, { message: "Veuillez entrer un numéro WhatsApp valide (ex: +225 07 00 00 00 00)." }),
  secondaryPhoneNumber: z.string().regex(/^\+?\d{8,15}$/, { message: "Veuillez entrer un numéro de téléphone valide." }).optional().or(z.literal('')),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }).optional().or(z.literal('')),
  primaryColor: z.string().min(1, { message: "Veuillez sélectionner une couleur principale." }),
  secondaryColor: z.string().min(1, { message: "Veuillez sélectionner une couleur secondaire." }),
  logoOrPhoto: z.any().optional(), // File object or URL string
  businessLocation: z.string().min(3, { message: "La localisation de l'entreprise est requise." }).max(100, { message: "La localisation ne peut pas dépasser 100 caractères." }),

  // New fields for user profile (optional in wizard, but part of schema)
  firstName: z.string().min(2, "Le prénom est requis.").max(50, "Le prénom ne peut pas dépasser 50 caractères.").optional().or(z.literal('')),
  lastName: z.string().min(2, "Le nom est requis.").max(50, "Le nom ne peut pas dépasser 50 caractères.").optional().or(z.literal('')),
  expertise: z.string().min(3, "Le domaine d'expertise est requis.").max(100, "Le domaine d'expertise ne peut pas dépasser 100 caractères.").optional().or(z.literal('')),

  // Étape 2: Contenu (Les Pages Clés)
  heroSlogan: z.string().min(10, { message: "Le slogan est requis et doit contenir au moins 10 caractères." }).max(100, { message: "Le slogan ne peut pas dépasser 100 caractères." }),
  aboutStory: z.string().min(50, { message: "Votre histoire/mission est requise et doit contenir au moins 50 caractères." }).max(500, { message: "Votre histoire/mission ne peut pas dépasser 500 caractères." }),
  heroBackgroundImage: z.any().optional(), // File object or URL string

  // Nouvelle Étape: Compétences / Expertise
  skills: z.array(z.object({
    title: z.string().min(3, "Le titre de la compétence est requis.").max(50, "Le titre ne peut pas dépasser 50 caractères."),
    description: z.string().min(10, "La description est requise.").max(200, "La description ne peut pas dépasser 200 caractères."),
    icon: z.string().optional(), // Lucide icon name or similar
  })).max(10, "Vous ne pouvez ajouter que 10 compétences maximum.").optional(), // Optional for wizard, updated max to 10

  // Nouvelle Étape: Produits & Services
  productsAndServices: z.array(z.object({
    title: z.string().min(3, "Le titre du produit/service est requis.").max(50, "Le titre ne peut pas dépasser 50 caractères."),
    price: z.preprocess(
      (val: unknown) => (val === '' ? undefined : val),
      z.coerce.number().min(0, "Le prix ne peut pas être négatif.").optional()
    ),
    currency: z.string().min(1, "La devise est requise."),
    description: z.string().min(10, "La description est requise et doit contenir au moins 10 caractères.").max(300, "La description ne peut pas dépasser 300 caractères."),
    image: z.any().optional(), // File object or URL string
    actionButton: z.string().min(1, "L'action du bouton est requise."),
  })).max(5, "Vous ne pouvez ajouter que 5 produits/services maximum."), // Increased max to 5 for more customization

  // Testimonials (New for wizard, but optional)
  testimonials: z.array(z.object({
    author: z.string().min(2, "Le nom de l'auteur est requis.").max(50, "Le nom ne peut pas dépasser 50 caractères."),
    quote: z.string().min(20, "Le témoignage est requis.").max(500, "Le témoignage ne peut pas dépasser 500 caractères."),
    location: z.string().min(2, "La localisation est requise.").max(50, "La localisation ne peut pas dépasser 50 caractères."),
    avatar: z.any().optional(), // File object or URL string
  })).max(5, "Vous ne pouvez ajouter que 5 témoignages maximum.").optional(), // Optional for wizard

  // Étape 3 (maintenant Étape 5): Configuration et Réseaux
  contactButtonAction: z.string().min(1, { message: "Veuillez sélectionner une action pour le bouton de contact." }),
  facebookLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')),
  instagramLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')),
  linkedinLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')),
  paymentMethods: z.array(z.string()).max(5, "Vous ne pouvez sélectionner que 5 modes de paiement maximum."),
  deliveryOption: z.string().min(1, { message: "Veuillez sélectionner une option de livraison/déplacement." }),
  depositRequired: z.boolean(),
  showContactForm: z.boolean(),
  templateType: z.string().min(1, { message: "Veuillez sélectionner un type de template." }), // Add templateType to the schema

  // Section Visibility (New for wizard, but optional)
  sectionsVisibility: z.object({
    showHero: z.boolean(),
    showAbout: z.boolean(),
    showProductsServices: z.boolean(),
    showTestimonials: z.boolean(),
    showSkills: z.boolean(),
    showContact: z.boolean(),
  }).optional(),
});

// Infer the type for the entire wizard form data from the schema
type WizardFormData = z.infer<typeof wizardFormSchema> & { subdomain?: string }; // Add subdomain as optional property for internal use

interface SiteCreationWizardProps {
  initialSiteData?: WizardFormData & { id?: string }; // Add id for existing sites
}

// Define separate schemas for each step
const essentialDesignStepSchema = z.object({
  publicName: wizardFormSchema.shape.publicName,
  whatsappNumber: wizardFormSchema.shape.whatsappNumber,
  secondaryPhoneNumber: wizardFormSchema.shape.secondaryPhoneNumber,
  email: wizardFormSchema.shape.email,
  primaryColor: wizardFormSchema.shape.primaryColor,
  secondaryColor: wizardFormSchema.shape.secondaryColor,
  logoOrPhoto: wizardFormSchema.shape.logoOrPhoto,
  businessLocation: wizardFormSchema.shape.businessLocation,
  firstName: wizardFormSchema.shape.firstName,
  lastName: wizardFormSchema.shape.lastName,
  expertise: wizardFormSchema.shape.expertise,
});

const contentStepSchema = z.object({
  heroSlogan: wizardFormSchema.shape.heroSlogan,
  aboutStory: wizardFormSchema.shape.aboutStory,
  heroBackgroundImage: wizardFormSchema.shape.heroBackgroundImage,
});

const skillsStepSchema = z.object({
  skills: wizardFormSchema.shape.skills,
});

const productsServicesStepSchema = z.object({
  productsAndServices: wizardFormSchema.shape.productsAndServices,
});

const configurationNetworkStepSchema = z.object({
  contactButtonAction: wizardFormSchema.shape.contactButtonAction,
  facebookLink: wizardFormSchema.shape.facebookLink,
  instagramLink: wizardFormSchema.shape.instagramLink,
  linkedinLink: wizardFormSchema.shape.linkedinLink,
  paymentMethods: wizardFormSchema.shape.paymentMethods,
  deliveryOption: wizardFormSchema.shape.deliveryOption,
  depositRequired: wizardFormSchema.shape.depositRequired,
  showContactForm: wizardFormSchema.shape.showContactForm,
});


// Define all possible steps
const allSteps: {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  schema: z.ZodObject<any>;
}[] = [
  {
    id: "essentialDesign",
    title: "Infos Essentielles & Design",
    component: EssentialDesignStep,
    schema: essentialDesignStepSchema,
  },
  {
    id: "content",
    title: "Contenu (Pages Clés)",
    component: ContentStep,
    schema: contentStepSchema,
  },
  {
    id: "skills",
    title: "Compétences / Expertise",
    component: SkillsStep,
    schema: skillsStepSchema,
  },
  {
    id: "productsServices",
    title: "Produits & Services",
    component: ProductsServicesStep,
    schema: productsServicesStepSchema,
  },
  {
    id: "configurationNetwork",
    title: "Configuration et Réseaux",
    component: ConfigurationNetworkStep,
    schema: configurationNetworkStepSchema,
  },
];

// Utility function to sanitize file names for storage keys
const sanitizeFileNameForStorage = (fileName: string): string => {
  if (!fileName) return '';
  // Replace special characters (including spaces, accents) with hyphens
  // Keep alphanumeric characters, hyphens, and dots
  let sanitized = fileName
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-zA-Z0-9-.]/g, '-') // Replace non-alphanumeric (except dot and hyphen) with hyphen
    .replace(/--+/g, '-') // Replace multiple hyphens with a single one
    .replace(/^-+/, '') // Trim hyphens from start/end
    .replace(/-+$/, ''); // Trim - from end of text

  // Ensure file extension is preserved if present
  const parts = sanitized.split('.');
  if (parts.length > 1) {
    const extension = parts.pop();
    sanitized = parts.join('-') + '.' + extension;
  }

  return sanitized;
};


export function SiteCreationWizard({ initialSiteData }: SiteCreationWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null); // Define user state

  React.useEffect(() => {
    async function getUser() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, [supabase]);

  // Define defaultValues based on the WizardFormData type
  const defaultValues: WizardFormData = {
    publicName: initialSiteData?.publicName || "",
    whatsappNumber: initialSiteData?.whatsappNumber || "",
    secondaryPhoneNumber: initialSiteData?.secondaryPhoneNumber || "",
    email: initialSiteData?.email || "",
    primaryColor: initialSiteData?.primaryColor || "blue", // Default color
    secondaryColor: initialSiteData?.secondaryColor || "red", // Default color
    logoOrPhoto: initialSiteData?.logoOrPhoto || undefined, // This will be a URL if existing, not a File
    businessLocation: initialSiteData?.businessLocation || "",

    firstName: initialSiteData?.firstName || "",
    lastName: initialSiteData?.lastName || "",
    expertise: initialSiteData?.expertise || "",

    heroSlogan: initialSiteData?.heroSlogan || "",
    aboutStory: initialSiteData?.aboutStory || "",
    heroBackgroundImage: initialSiteData?.heroBackgroundImage || undefined,

    skills: initialSiteData?.skills || [], // Initialize with an empty array
    productsAndServices: initialSiteData?.productsAndServices || [], // Initialize with an empty array, ProductsServicesStep will add one if needed

    testimonials: initialSiteData?.testimonials || [], // New field
    

    contactButtonAction: initialSiteData?.contactButtonAction || "whatsapp", // Default to WhatsApp
    facebookLink: initialSiteData?.facebookLink || "",
    instagramLink: initialSiteData?.instagramLink || "",
    linkedinLink: initialSiteData?.linkedinLink || "",
    paymentMethods: initialSiteData?.paymentMethods || [],
    deliveryOption: initialSiteData?.deliveryOption || "",
    depositRequired: initialSiteData?.depositRequired || false,
    showContactForm: initialSiteData?.showContactForm !== undefined ? initialSiteData.showContactForm : true, // Default to true
    templateType: initialSiteData?.templateType || "default", // Default template
    subdomain: initialSiteData?.subdomain, // Include existing subdomain for updates
    sectionsVisibility: initialSiteData?.sectionsVisibility || { // Default visibility for new sites
      showHero: true,
      showAbout: true,
      showProductsServices: true,
      showTestimonials: true,
      showSkills: true,
      showContact: true,
    },
  };

  const methods = useForm<WizardFormData>({
    resolver: zodResolver(wizardFormSchema as z.ZodSchema<WizardFormData>),
    defaultValues: defaultValues,
    mode: "onChange", // Validate on change to enable/disable next button
  });

  const {
    handleSubmit,
    trigger,
    formState: { isSubmitting, errors }, // Get errors from formState
    watch, // Watch function
    setValue, // setValue function
  } = methods;

  const templateType = watch('templateType'); // Watch the templateType from the form

  // Dynamically filter steps based on templateType
  const filteredSteps = React.useMemo(() => {
    const baseSteps = [
      { id: "essentialDesign", title: "Infos Essentielles & Design", component: EssentialDesignStep, schema: essentialDesignStepSchema },
      { id: "content", title: "Contenu (Pages Clés)", component: ContentStep, schema: contentStepSchema },
      { id: "skills", title: "Compétences / Expertise", component: SkillsStep, schema: skillsStepSchema },
      { id: "productsServices", title: "Produits & Services", component: ProductsServicesStep, schema: productsServicesStepSchema },
      { id: "configurationNetwork", title: "Configuration et Réseaux", component: ConfigurationNetworkStep, schema: configurationNetworkStepSchema },
    ];

    if (templateType === 'ecommerce' || templateType === 'artisan-ecommerce') {
      // For e-commerce, hide the 'skills' step
      return baseSteps.filter(step => step.id !== 'skills');
    } else if (templateType === 'service-portfolio' || templateType === 'professional-portfolio') {
      // For portfolio, hide the 'productsServices' step
      return baseSteps.filter(step => step.id !== 'productsServices');
    }
    // For default or any other template, show all steps
    return baseSteps;
  }, [templateType]);

  // Reset currentStep if templateType changes
  React.useEffect(() => {
    setCurrentStep(0);
  }, [templateType]);

  // Set the templateType value in the form if it comes from initialSiteData
  React.useEffect(() => {
    if (initialSiteData?.templateType) {
      setValue('templateType', initialSiteData.templateType);
    }
  }, [initialSiteData?.templateType, setValue]);


  const currentStepSchema = filteredSteps[currentStep].schema as z.ZodObject<any>;
  const currentStepFieldNames = Object.keys(currentStepSchema.shape) as (keyof WizardFormData)[];

  const isCurrentStepValid = !currentStepFieldNames.some(fieldName => errors[fieldName]);

  const handleNext = async () => {
    if (currentStep >= filteredSteps.length - 1) return; // Use filteredSteps.length

    // Trigger validation for only the current step's fields
    const result = await trigger(currentStepFieldNames);

    if (result) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error("Veuillez corriger les erreurs avant de passer à l'étape suivante.");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const CurrentStepComponent = filteredSteps.length > 0 ? filteredSteps[currentStep].component : () => <p className="text-center text-muted-foreground">Aucune étape définie pour le moment.</p>;

  const handleFileUpload = async (file: File, path: string, siteIdentifier: string): Promise<string | null> => {
    if (!file) return null;

    if (!user) { // Ensure user is defined before attempting upload
      toast.error("Utilisateur non authentifié pour le téléchargement de fichiers.");
      return null;
    }

    const sanitizedFileName = sanitizeFileNameForStorage(file.name);
    const filePath = `${user.id}/${siteIdentifier}/${path}/${Date.now()}-${sanitizedFileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      toast.error(`Erreur lors du téléchargement de l'image: ${uploadError.message}`);
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from('site-assets').getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  };

  const onSubmit: SubmitHandler<WizardFormData> = async (data: WizardFormData) => { // Explicitly type 'data'
    if (!user) {
      toast.error("Vous devez être connecté pour créer un site.");
      router.push("/login");
      return;
    }

    // --- New: Site creation limits and template uniqueness checks ---
    if (!initialSiteData?.id) { // Only apply these checks for new site creation
      const { data: userSites, error: fetchSitesError } = await supabase
        .from('sites')
        .select('id, template_type')
        .eq('user_id', user.id);

      if (fetchSitesError) {
        console.error("Error fetching user sites for limits:", fetchSitesError);
        toast.error("Erreur lors de la vérification des limites de sites.");
        return;
      }

      if (userSites && userSites.length >= 5) {
        toast.error("Vous avez atteint la limite de 5 sites web par compte.");
        return;
      }

      const hasSameTemplate = userSites?.some(site => site.template_type === data.templateType);
      if (hasSameTemplate) {
        toast.error(`Vous avez déjà un site avec le template "${data.templateType}". Veuillez choisir un template différent.`);
        return;
      }
    }
    // --- End New: Site creation limits and template uniqueness checks ---


    let siteIdentifier = initialSiteData?.subdomain; // Use existing identifier if editing

    // If creating a new site, generate a unique identifier
    if (!initialSiteData?.id) {
      let baseSlug = generateSlug(data.publicName);
      let uniqueSlug = baseSlug;
      let counter = 0;
      let isUnique = false;

      while (!isUnique) {
        const { data: existingSite, error: checkError } = await supabase
          .from('sites')
          .select('id')
          .eq('subdomain', uniqueSlug)
          .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means "no rows found" which is good
          console.error("Error checking identifier uniqueness:", checkError);
          toast.error("Erreur lors de la vérification de l'unicité de l'identifiant.");
          return;
        }

        if (existingSite) {
          counter++;
          uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`; // Append random string
        } else {
          isUnique = true;
        }
      }
      siteIdentifier = uniqueSlug;
    }

    // Handle file uploads (logo and product images)
    let logoUrl: string | null = null;
    let heroBackgroundImageUrl: string | null = null;
    const productImages: { [key: number]: string | null } = {};
    const testimonialAvatars: { [key: number]: string | null } = {};

    try {
      // Upload logo/photo if present and it's a new File (not an existing URL)
      if (data.logoOrPhoto instanceof File) {
        logoUrl = await handleFileUpload(data.logoOrPhoto, 'logo', siteIdentifier!);
        if (logoUrl === null) throw new Error("Logo upload failed.");
      } else if (typeof data.logoOrPhoto === 'string') {
        logoUrl = data.logoOrPhoto;
      } else {
        logoUrl = null;
      }

      // Upload hero background image
      if (data.heroBackgroundImage instanceof File) {
        heroBackgroundImageUrl = await handleFileUpload(data.heroBackgroundImage, 'hero', siteIdentifier!);
        if (heroBackgroundImageUrl === null) throw new Error("Hero background image upload failed.");
      } else if (typeof data.heroBackgroundImage === 'string') {
        heroBackgroundImageUrl = data.heroBackgroundImage;
      } else {
        heroBackgroundImageUrl = null;
      }

      // Upload product images if present and they are new Files
      for (const [index, product] of data.productsAndServices.entries()) {
        if (product.image instanceof File) {
          productImages[index] = await handleFileUpload(product.image, `products/${index}`, siteIdentifier!);
          if (productImages[index] === null) throw new Error(`Product image ${index} upload failed.`);
        } else if (typeof product.image === 'string') {
          productImages[index] = product.image;
        } else {
          productImages[index] = null;
        }
      }

      // Upload testimonial avatars if present and they are new Files
      if (data.testimonials) {
        for (const [index, testimonial] of data.testimonials.entries()) {
          if (testimonial.avatar instanceof File) {
            testimonialAvatars[index] = await handleFileUpload(testimonial.avatar, `testimonials/${index}`, siteIdentifier!);
            if (testimonialAvatars[index] === null) throw new Error(`Testimonial avatar ${index} upload failed.`);
          } else if (typeof testimonial.avatar === 'string') {
            testimonialAvatars[index] = testimonial.avatar;
          } else {
            testimonialAvatars[index] = null;
          }
        }
      }

      // Prepare site_data for Supabase, replacing File objects with URLs
      const siteDataToSave: SiteEditorFormData = {
        ...data,
        logoOrPhoto: logoUrl,
        heroBackgroundImage: heroBackgroundImageUrl,
        productsAndServices: data.productsAndServices.map((product, index) => ({
          ...product,
          image: productImages[index] !== undefined ? productImages[index] : product.image,
        })),
        testimonials: data.testimonials?.map((testimonial, index) => ({
          ...testimonial,
          avatar: testimonialAvatars[index] !== undefined ? testimonialAvatars[index] : testimonial.avatar,
        })) || [],
        skills: data.skills || [], // Ensure skills array is passed
        sectionsVisibility: data.sectionsVisibility || { // Ensure visibility is passed
          showHero: true,
          showAbout: true,
          showProductsServices: true,
          showTestimonials: true,
          showSkills: true,
          showContact: true,
        },
        // Removed subdomain from siteDataToSave as it's a top-level column
      };

      if (initialSiteData?.id) {
        // Update existing site
        const { error: updateError } = await supabase
          .from('sites')
          .update({
            subdomain: siteIdentifier, // This is correct, updating the top-level column
            site_data: siteDataToSave,
            template_type: data.templateType, // Update template type
          })
          .eq('id', initialSiteData.id)
          .eq('user_id', user.id); // Corrected to user_id

        if (updateError) {
          toast.error(`Erreur lors de la mise à jour du site: ${updateError.message}`);
          return;
        }
        toast.success("Votre site a été mis à jour avec succès ! Vous serez redirigé sous peu.");
      } else {
        // Insert new site
        const { error: insertError } = await supabase
          .from('sites')
          .insert({
            user_id: user.id,
            subdomain: siteIdentifier, // Use the generated unique identifier
            site_data: siteDataToSave,
            status: 'published', // Default status
            template_type: data.templateType, // Use the templateType from form data
          });

        if (insertError) {
          // Check for unique constraint error on subdomain (should be handled by generation loop, but as a fallback)
          if (insertError.code === '23505') { // PostgreSQL unique violation error code
            toast.error(`L'identifiant "${siteIdentifier}" est déjà pris. Veuillez réessayer.`);
          } else {
            toast.error(`Erreur lors de la création du site: ${insertError.message}`);
          }
          return;
        }
        toast.success("Votre site est en cours de création ! Vous serez redirigé sous peu.");
      }

      router.push(`/sites/${siteIdentifier}`); // Redirect to the new site's public page
      router.refresh(); // Refresh to update data
    } catch (error: any) {
      console.error("Site creation/update error:", error);
      toast.error(`Une erreur est survenue: ${error.message || "Impossible de créer/mettre à jour le site."}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted py-12">
      <Card className="w-full max-w-2xl p-6">
        <CardContent>
          <WizardProgress currentStep={currentStep} totalSteps={filteredSteps.length} />
          <Form {...methods}> {/* Use Form component here */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <CurrentStepComponent templateType={templateType} />
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={filteredSteps.length}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isSubmitting={isSubmitting}
                isValid={isCurrentStepValid} // Pass the current step's validity
              />
            </form>
          </Form> {/* Closing Form tag added here */}
        </CardContent>
      </Card>
    </div>
  );
}