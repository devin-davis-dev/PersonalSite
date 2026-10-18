import { act, fireEvent, render, screen, waitFor } from "../../test-utils";
import ContactForm from "./ContactForm";

describe("ContactForm Component Behavior", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
    (navigator.clipboard.writeText as jest.Mock).mockClear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  describe("Submission Flow", () => {
    it("disables the submit button and indicates sending state while request is in-flight", async () => {
      let resolveFetch!: (value: any) => void;
      (global.fetch as jest.Mock).mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
      );

      render(<ContactForm />);

      fireEvent.change(screen.getByPlaceholderText("placeholder_email"), {
        target: { value: "devin@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("placeholder_subject"), {
        target: { value: "Project Inquiry" },
      });
      fireEvent.change(screen.getByPlaceholderText("placeholder_message"), {
        target: { value: "Hello Devin!" },
      });
      fireEvent.click(screen.getByRole("button", { name: "button_send" }));

      await waitFor(() => {
        const sendingButton = screen.getByRole("button", {
          name: "button_sending",
        });
        expect(sendingButton).toBeInTheDocument();
        expect(sendingButton).toBeDisabled();
      });

      resolveFetch({ ok: true });

      await waitFor(() => {
        expect(screen.getByText("email_sent_success")).toBeInTheDocument();
      });
    });

    it("submits encoded form payload, invokes onSuccess, and displays confirmation view", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
      const onSuccessMock = jest.fn();

      render(<ContactForm onSuccess={onSuccessMock} />);

      fireEvent.change(screen.getByPlaceholderText("placeholder_email"), {
        target: { value: "devin@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("placeholder_subject"), {
        target: { value: "Project Inquiry" },
      });
      fireEvent.change(screen.getByPlaceholderText("placeholder_message"), {
        target: { value: "Collaboration request" },
      });
      fireEvent.click(screen.getByRole("button", { name: "button_send" }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/contact", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: "form-name=Contact%20Form&email=devin%40example.com&subject=Project%20Inquiry&message=Collaboration%20request",
        });
      });

      await waitFor(() => {
        expect(screen.getByText("email_sent_success")).toBeInTheDocument();
      });

      expect(onSuccessMock).toHaveBeenCalledTimes(1);

      // Form is replaced by success confirmation view
      expect(
        screen.queryByPlaceholderText("placeholder_email"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("success_title")).toBeInTheDocument();
    });

    it("notifies of error and preserves form content when server response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      render(<ContactForm />);

      fireEvent.change(screen.getByPlaceholderText("placeholder_email"), {
        target: { value: "devin@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("placeholder_subject"), {
        target: { value: "Subject" },
      });
      fireEvent.change(screen.getByPlaceholderText("placeholder_message"), {
        target: { value: "Message" },
      });
      fireEvent.click(screen.getByRole("button", { name: "button_send" }));

      await waitFor(() => {
        expect(screen.getByText("email_sent_error")).toBeInTheDocument();
      });

      // Form remains visible with user input
      expect(screen.getByPlaceholderText("placeholder_email")).toHaveValue(
        "devin@example.com",
      );
    });

    it("notifies of error and preserves form content on network failure", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network Error"),
      );

      render(<ContactForm />);

      fireEvent.change(screen.getByPlaceholderText("placeholder_email"), {
        target: { value: "devin@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("placeholder_subject"), {
        target: { value: "Subject" },
      });
      fireEvent.change(screen.getByPlaceholderText("placeholder_message"), {
        target: { value: "Message" },
      });
      fireEvent.click(screen.getByRole("button", { name: "button_send" }));

      await waitFor(() => {
        expect(screen.getByText("email_sent_error")).toBeInTheDocument();
      });

      expect(screen.getByPlaceholderText("placeholder_email")).toHaveValue(
        "devin@example.com",
      );
    });
  });

  describe("Success View Actions", () => {
    const renderConfirmationScreen = async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      render(<ContactForm />);

      fireEvent.change(screen.getByPlaceholderText("placeholder_email"), {
        target: { value: "devin@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("placeholder_subject"), {
        target: { value: "Subject" },
      });
      fireEvent.change(screen.getByPlaceholderText("placeholder_message"), {
        target: { value: "Message" },
      });
      fireEvent.click(screen.getByRole("button", { name: "button_send" }));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "success_pgp_button" }),
        ).toBeInTheDocument();
      });
    };

    it("fetches PGP key, writes to clipboard, and confirms via toast notification", async () => {
      await renderConfirmationScreen();

      const mockKey =
        "-----BEGIN PGP PUBLIC KEY BLOCK-----\ntest\n-----END PGP PUBLIC KEY BLOCK-----";
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: jest.fn().mockResolvedValueOnce(mockKey),
      });

      fireEvent.click(
        screen.getByRole("button", { name: "success_pgp_button" }),
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/pgp-key.asc");
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockKey);
        expect(screen.getByText("pgp_copy_success")).toBeInTheDocument();
      });
    });

    it("displays error notification if fetching PGP key fails", async () => {
      await renderConfirmationScreen();

      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      fireEvent.click(
        screen.getByRole("button", { name: "success_pgp_button" }),
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/pgp-key.asc");
        expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
        expect(screen.getByText("pgp_copy_error")).toBeInTheDocument();
      });
    });
  });

  describe("Highlighting", () => {
    it("applies highlight styling when isHighlighted is true", () => {
      const { rerender } = render(<ContactForm isHighlighted={false} />);

      const formContainer =
        document.getElementById("contact-form")?.parentElement;
      expect(formContainer).toHaveStyle("border: none");

      rerender(<ContactForm isHighlighted={true} />);
      expect(formContainer).toHaveStyle("border: 3px solid orange");
    });
  });

  describe("Quick Inquiry Presets", () => {
    it("renders all preset buttons", () => {
      render(<ContactForm />);

      expect(screen.getByText("quick_templates_title")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "preset_resume_label" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "preset_fulltime_label" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "preset_consulting_label" }),
      ).toBeInTheDocument();
    });

    it("pre-populates subject and message when a preset button is clicked", () => {
      render(<ContactForm />);

      const resumeButton = screen.getByRole("button", {
        name: "preset_resume_label",
      });
      act(() => {
        fireEvent.click(resumeButton);
      });

      expect(screen.getByPlaceholderText("placeholder_subject")).toHaveValue(
        "preset_resume_subject",
      );
      expect(screen.getByPlaceholderText("placeholder_message")).toHaveValue(
        "preset_resume_message",
      );
    });

    it("clears subject and message when the active preset button is clicked again", () => {
      render(<ContactForm />);

      const resumeButton = screen.getByRole("button", {
        name: "preset_resume_label",
      });
      // Select
      act(() => {
        fireEvent.click(resumeButton);
      });
      expect(screen.getByPlaceholderText("placeholder_subject")).toHaveValue(
        "preset_resume_subject",
      );

      // Deselect
      act(() => {
        fireEvent.click(resumeButton);
      });
      expect(screen.getByPlaceholderText("placeholder_subject")).toHaveValue(
        "",
      );
      expect(screen.getByPlaceholderText("placeholder_message")).toHaveValue(
        "",
      );
    });

    it("switches pre-filled content when a different preset is clicked", () => {
      render(<ContactForm />);

      act(() => {
        fireEvent.click(
          screen.getByRole("button", { name: "preset_resume_label" }),
        );
      });
      expect(screen.getByPlaceholderText("placeholder_subject")).toHaveValue(
        "preset_resume_subject",
      );

      act(() => {
        fireEvent.click(
          screen.getByRole("button", { name: "preset_fulltime_label" }),
        );
      });
      expect(screen.getByPlaceholderText("placeholder_subject")).toHaveValue(
        "preset_fulltime_subject",
      );
      expect(screen.getByPlaceholderText("placeholder_message")).toHaveValue(
        "preset_fulltime_message",
      );
    });

    it("allows programmatic preset selection via imperative ref", () => {
      const ref = { current: null as any };
      render(<ContactForm ref={ref} />);

      expect(ref.current).toBeDefined();
      act(() => {
        ref.current.selectPreset("consulting");
      });

      expect(screen.getByPlaceholderText("placeholder_subject")).toHaveValue(
        "preset_consulting_subject",
      );
      expect(screen.getByPlaceholderText("placeholder_message")).toHaveValue(
        "preset_consulting_message",
      );
    });
  });
});
