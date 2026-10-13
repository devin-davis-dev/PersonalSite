import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "gatsby-plugin-react-i18next";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { Box, Button, Input, Text, Textarea } from "theme-ui";
import * as yup from "yup";

import useToast from "../../hooks/use-toast";
import SubmitSuccess from "./SubmitSuccess";

export interface ContactFormHandle {
  focus: () => void;
}

export interface ContactFormProps {
  isHighlighted?: boolean;
  onSuccess?: () => void;
}

interface FormData {
  email: string;
  subject: string;
  message: string;
}

export const ContactForm = forwardRef<ContactFormHandle, ContactFormProps>(
  ({ isHighlighted = false, onSuccess }, ref) => {
    const { t } = useTranslation("contact");
    const [isPostSuccessful, setIsPostSuccessful] = useState(false);
    const { showToast, Toast } = useToast();

    const schema = useMemo(
      () =>
        yup
          .object({
            email: yup.string().email().required(),
            subject: yup.string().min(1).max(40).required(),
            message: yup.string().min(1).max(5000).required(),
          })
          .required(),
      [],
    );

    const {
      register,
      handleSubmit,
      setFocus,
      formState: { errors, isSubmitting },
    } = useForm<FormData>({
      resolver: yupResolver(schema),
      mode: "onSubmit",
    });

    const emailInputRef = useRef<HTMLInputElement | null>(null);
    const { ref: formEmailRef, ...emailRegisterRest } = register("email");

    useImperativeHandle(ref, () => ({
      focus: () => {
        emailInputRef.current?.focus();
      },
    }));

    const onSubmit = useCallback(
      async (data: FormData) => {
        const encode = (formData: Record<string, string>) => {
          return Object.keys(formData)
            .map(
              (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`,
            )
            .join("&");
        };

        try {
          const response = await fetch("/contact", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encode({
              "form-name": "Contact Form",
              ...data,
            }),
          });

          if (response.ok) {
            setIsPostSuccessful(true);
            showToast(t("email_sent_success"), "success");
            onSuccess?.();
          } else {
            showToast(t("email_sent_error"));
          }
        } catch {
          showToast(t("email_sent_error"));
        }
      },
      [showToast, t, onSuccess],
    );

    useEffect(() => {
      setFocus("email");
    }, [setFocus]);

    if (isPostSuccessful) {
      return (
        <>
          {Toast}
          <SubmitSuccess showToast={showToast} />
        </>
      );
    }

    return (
      <Box
        sx={{
          border: isHighlighted ? "3px solid orange" : "none",
          borderRadius: 5,
          p: isHighlighted ? 3 : 0,
        }}
      >
        {Toast}
        <form
          action="/contact"
          name="Contact Form"
          method="POST"
          data-netlify="true"
          id="contact-form"
        >
          <Input
            variant="primary"
            sx={{ mb: 3, bg: "secondary" }}
            type="hidden"
            name="form-name"
            value="Contact Form"
          />
          <Box>
            <Input
              sx={{
                mb: 3,
                bg: "primary",
                color: "secondary",
                border: "none",
                p: 3,
              }}
              {...emailRegisterRest}
              ref={(el: HTMLInputElement | null) => {
                formEmailRef(el);
                emailInputRef.current = el;
              }}
              type="text"
              placeholder={t("placeholder_email")}
            />
            {errors.email && (
              <Text sx={{ color: "error", mb: 3, display: "block" }}>
                {errors.email.message}
              </Text>
            )}
          </Box>
          <Box>
            <Input
              sx={{
                mb: 3,
                bg: "primary",
                color: "secondary",
                border: "none",
                p: 3,
              }}
              {...register("subject")}
              type="text"
              placeholder={t("placeholder_subject")}
            />
            {errors.subject && (
              <Text sx={{ color: "error", mb: 3, display: "block" }}>
                {errors.subject.message}
              </Text>
            )}
          </Box>
          <Box>
            <Textarea
              sx={{
                mb: 3,
                bg: "primary",
                color: "secondary",
                border: "none",
                p: 3,
                fontFamily: "roboto",
                minHeight: "300px",
                resize: "vertical",
              }}
              {...register("message")}
              placeholder={t("placeholder_message")}
            />
            {errors.message && (
              <Text sx={{ color: "error", mb: 3, display: "block" }}>
                {errors.message.message}
              </Text>
            )}
          </Box>
          <Button
            sx={{ flexShrink: 0 }}
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("button_sending") : t("button_send")}
          </Button>
        </form>
      </Box>
    );
  },
);

ContactForm.displayName = "ContactForm";

export default ContactForm;
