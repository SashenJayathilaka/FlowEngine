"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UseUpgradeModel from "@/hooks/use-upgrade-modle";
import { CredentialType } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  useCreateCredential,
  useSuspendCredential,
  useUpdateCredential,
} from "../hooks/use-credential";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialType),
  value: z.string().min(1, "Value is required"),
});

type FormValues = z.infer<typeof formSchema>;

const credentialTypesOptions = [
  {
    label: "OpenAI",
    value: CredentialType.OPENAI,
    logo: "/images/openai.svg",
  },
  {
    label: "Anthropic",
    value: CredentialType.ANTHROPIC,
    logo: "/images/anthropic.svg",
  },
  {
    label: "Gemini",
    value: CredentialType.GEMINI,
    logo: "/images/gemini_icon.png",
  },
  {
    label: "Deepseek",
    value: CredentialType.DEEPSEEK,
    logo: "/images/Deepseek-logo-icon.svg",
  },
];

interface CredentialsProps {
  initialData?: {
    id?: string;
    name: string;
    type: CredentialType;
    value: string;
  };
}

const CredentialsForm = ({ initialData }: CredentialsProps) => {
  const router = useRouter();
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();
  const { handleError, modal } = UseUpgradeModel();

  const isEdit = !!initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialType.OPENAI,
      value: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEdit && initialData?.id) {
      await updateCredential.mutateAsync({
        id: initialData.id,
        ...values,
      });
    } else {
      await createCredential.mutateAsync(values, {
        onSuccess: (data) => {
          router.push(`/credentials/${data.id}`);
        },
        onError: (error) => {
          handleError(error);
        },
      });
    }
  };

  return (
    <>
      {modal}
      <Card className="border border-border/50 bg-card/80 backdrop-blur-sm shadow-lg shadow-black/10">
        <CardHeader className="pb-4 border-b border-border/30">
          <CardTitle className="text-lg font-bold tracking-tight">{isEdit ? "Edit Credential" : "New Credential"}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground/70">
            {isEdit
              ? "Update your existing credential details below."
              : "Create a new credential to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My API Key"
                        className="bg-muted/30 border-border/60 focus:border-primary/60 focus:bg-background transition-all duration-200 focus:ring-1 focus:ring-primary/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-muted/30 border-border/60 focus:border-primary/60 focus:ring-1 focus:ring-primary/30">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60">
                        {credentialTypesOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-3">
                              <Image
                                src={option.logo}
                                alt={option.label}
                                width={20}
                                height={20}
                              />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">API Key</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="sk-..."
                        type="password"
                        className="bg-muted/30 border-border/60 focus:border-primary/60 focus:bg-background transition-all duration-200 focus:ring-1 focus:ring-primary/30 font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md shadow-primary/20 border-0 transition-all duration-200"
                  disabled={
                    createCredential.isPending || updateCredential.isPending
                  }
                >
                  {isEdit ? "Update Credential" : "Create Credential"}
                </Button>
                <Button type="button" variant="outline" asChild className="border-border/60 hover:bg-accent/40 hover:border-border transition-all duration-200">
                  <Link href="/credentials" prefetch>
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default CredentialsForm;

export const CredentialView = ({
  credentialsId,
}: {
  credentialsId: string;
}) => {
  const { data: credential } = useSuspendCredential(credentialsId);

  return <CredentialsForm initialData={credential} />;
};
