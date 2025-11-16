"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_][A-Za-z0-9_]*$/, { message: "Invalid variable name" }),
  username: z.string().optional(),
  content: z
    .string()
    .min(1, { message: "Content is required" })
    .max(2000, { message: "Content is too long" }),
  webhookUrl: z.string().min(1, { message: "Webhook URL is required" }),
  //.refine()
});

interface DiscordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<DiscordFormValues>;
}

export type DiscordFormValues = z.infer<typeof formSchema>;

export function DiscordDialog({
  open,
  onOpenChange,
  defaultValues = {},
  onSubmit,
}: DiscordDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      content: defaultValues.content || "",
      webhookUrl: defaultValues.webhookUrl || "",
      username: defaultValues.username || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        content: defaultValues.content || "",
        webhookUrl: defaultValues.webhookUrl || "",
        username: defaultValues.username || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "MyGeminiAI";

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Discord</DialogTitle>
          <DialogDescription>
            Configure the Discord webhook details
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>My Discord Variable</FormLabel>
                  <FormControl>
                    <Input placeholder="My Discord Variable" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the variable to store the response{" "}
                    {`{{${watchVariableName}.text}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discord Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://discord.com/api/webhooks/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Get this from Discord: Channel setting → Integrations →
                    Webhooks → New Webhook
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="You are a helpful assistant that summarizes text."
                      className="min-h-[80px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The message content to send{" "}
                    {`{{${watchVariableName}.text}}`} for simple text messages.
                    or {"{{json.variableName}}"} for rich messages.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Username</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Bot Username"
                      className="min-h-[120px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The username to display the bot as (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
