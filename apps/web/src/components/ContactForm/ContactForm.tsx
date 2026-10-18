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
import { Box, Button, Flex, Input, Text, Textarea } from "theme-ui";
import * as yup from "yup";

import useToast from "../../hooks/use-toast";
import SubmitSuccess from "./SubmitSuccess";

export type PresetType = "resume" | "fulltime" | "consulting";

export interface ContactFormHandle {
  focus: () => void;
  selectPreset: (preset: PresetType) => void;
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

const PRESETS: Array<{
  id: PresetType;
  labelKey:
    | "preset_resume_label"
    | "preset_fulltime_label"
    | "preset_consulting_label";
  subjectKey:
    | "preset_resume_subject"
    | "preset_fulltime_subject"
    | "preset_consulting_subject";
  messageKey:
    | "preset_resume_message"
    | "preset_fulltime_message"
    | "preset_consulting_message";
}> = [
  {
    id: "resume",
    labelKey: "preset_resume_label",
    subjectKey: "preset_resume_subject",
    messageKey: "preset_resume_message",
  },
  {
    id: "fulltime",
    labelKey: "preset_fulltime_label",
    subjectKey: "preset_fulltime_subject",
    messageKey: "preset_fulltime_message",
  },
  {
    id: "consulting",
    labelKey: "preset_consulting_label",
    subjectKey: "preset_consulting_subject",
    messageKey: "preset_consulting_message",
  },
];

export const ContactForm = forwardRef<ContactFormHandle, ContactFormProps>(
  ({ isHighlighted = false, onSuccess }, ref) => {
    const { t } = useTranslation("contact");
    const [isPostSuccessful, setIsPostSuccessful] = useState(false);
    const [activePreset, setActivePreset] = useState<PresetType | null>(null);
    const { showToast, Toast } = useToast();

    const schema = useMemo(
      () =>
        yup
          .object({
            email: yup.string().email().required(),
            subject: yup.string().min(1).max(100).required(),
            message: yup.string().min(1).max(5000).required(),
          })
          .required(),
      [],
    );

    const {
      register,
      handleSubmit,
      setFocus,
      setValue,
      watch,
      formState: { errors, isSubmitting },
    } = useForm<FormData>({
      resolver: yupResolver(schema),
      mode: "onSubmit",
    });

    const watchedSubject = watch("subject");
    const watchedMessage = watch("message");

    useEffect(() => {
      if (activePreset) {
        const isSubjectEmpty = !watchedSubject || watchedSubject.trim() === "";
        const isMessageEmpty = !watchedMessage || watchedMessage.trim() === "";
        if (isSubjectEmpty && isMessageEmpty) {
          setActivePreset(null);
        }
      }
    }, [watchedSubject, watchedMessage, activePreset]);

    const emailInputRef = useRef<HTMLInputElement | null>(null);
    const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
    const { ref: formEmailRef, ...emailRegisterRest } = register("email");
    const { ref: formSubjectRef, ...subjectRegisterRest } = register("subject");
    const { ref: formMessageRef, ...messageRegisterRest } = register("message");

    const applyPreset = useCallback(
      (presetId: PresetType) => {
        const preset = PRESETS.find((p) => p.id === presetId);
        if (!preset) return;

        if (activePreset === presetId) {
          setActivePreset(null);
          setValue("subject", "", { shouldValidate: true });
          setValue("message", "", { shouldValidate: true });
        } else {
          setActivePreset(presetId);
          setValue("subject", t(preset.subjectKey), { shouldValidate: true });
          setValue("message", t(preset.messageKey), { shouldValidate: true });
          messageInputRef.current?.focus();
        }
      },
      [activePreset, setValue, t],
    );

    useImperativeHandle(ref, () => ({
      focus: () => {
        emailInputRef.current?.focus();
      },
      selectPreset: (preset: PresetType) => {
        applyPreset(preset);
      },
    }));

    const onSubmit = useCallback(
      async (data: FormData) => {
        const encode = (formData: Record<string, string>) => {
          const orderedKeys = ["form-name", "email", "subject", "message"];
          return orderedKeys
            .filter((key) => key in formData)
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

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const intent = params.get("intent");
        if (intent === "resume") {
          applyPreset("resume");
        } else if (intent === "fulltime") {
          applyPreset("fulltime");
        } else if (intent === "consulting") {
          applyPreset("consulting");
        }
      }
    }, [applyPreset, setFocus]);

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
          <Box sx={{ mb: 3 }}>
            <Text
              as="span"
              sx={{
                display: "block",
                fontSize: 0,
                fontWeight: "bold",
                color: "primary",
                mb: 2,
              }}
            >
              {t("quick_templates_title")}
            </Text>
            <Flex sx={{ gap: 2, flexWrap: "wrap" }}>
              {PRESETS.map((preset) => {
                const isActive = activePreset === preset.id;
                return (
                  <Button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    sx={{
                      cursor: "pointer",
                      fontFamily: "body",
                      fontSize: "0.8125rem",
                      fontWeight: "bold",
                      borderRadius: "20px",
                      px: 3,
                      py: "6px",
                      border: "1px solid",
                      borderColor: isActive ? "orange" : "primary",
                      bg: isActive ? "lightOrange" : "transparent",
                      color: isActive ? "darkOrange" : "primary",
                      transition: "all 0.2s ease-in-out",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "orange",
                        color: "darkOrange",
                        bg: "lightOrange",
                        boxShadow: "none",
                      },
                      "&:focus-visible": {
                        outline: "2px solid",
                        outlineColor: "orange",
                        outlineOffset: "2px",
                      },
                    }}
                  >
                    {t(preset.labelKey)}
                  </Button>
                );
              })}
            </Flex>
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
              {...subjectRegisterRest}
              ref={formSubjectRef}
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
              {...messageRegisterRest}
              ref={(el: HTMLTextAreaElement | null) => {
                formMessageRef(el);
                messageInputRef.current = el;
              }}
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
