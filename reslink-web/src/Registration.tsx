import { useState, type FormEvent } from 'react';
import './Registration.css';

type RegistrationProps = {
  onBack: () => void;
};

type ResearcherType =
  | 'Lecturer or Professor'
  | 'Postdoctoral Researcher'
  | 'PhD Researcher'
  | "Master's Researcher"
  | 'Research Scientist'
  | 'Research Fellow'
  | 'Research Assistant'
  | 'Industry Researcher'
  | 'Independent Researcher'
  | 'Other Research Professional';

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

type RegistrationResponse = {
  message: string;
  data?: {
    user_id: number;
    email: string;
    email_verified: boolean;
    verification_status: string;
    verification_email_sent: boolean;
  };
};

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000/api'
).replace(/\/+$/, '');

export default function Registration({ onBack }: RegistrationProps) {
  const [researcherType, setResearcherType] =
    useState<ResearcherType | ''>('');

  const [affiliationType, setAffiliationType] =
    useState('institutional');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string[]>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [verificationEmailSent, setVerificationEmailSent] =
    useState(false);

  const isIndependent = affiliationType === 'independent';

  function getFieldError(name: string): string | undefined {
    return fieldErrors[name]?.[0];
  }

  function clearMessages() {
    setError('');
    setNotice('');
    setFieldErrors({});
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    clearMessages();
    setRegisteredEmail('');
    setVerificationEmailSent(false);

    if (password.length < 12) {
      setError('Your password must contain at least 12 characters.');
      return;
    }

    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setError(
        'Use uppercase and lowercase letters, a number and a symbol in your password.',
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }

    if (!acceptedTerms) {
      setError('Please accept the Research Use and Community Standards.');
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const value = (name: string): string =>
      String(formData.get(name) ?? '').trim();

    const email = value('email').toLowerCase();

    const payload = {
      first_name: value('firstName'),
      last_name: value('lastName'),
      academic_title: value('professionalTitle') || null,
      country: value('country'),
      email,

      researcher_category: researcherType,
      research_discipline: value('researchDiscipline'),
      research_interests: value('researchInterests'),

      affiliation_type: affiliationType,
      institution_name: value('institution') || null,
      department: value('department') || null,
      professional_position: value('position') || null,
      institutional_email: value('institutionalEmail').toLowerCase() || null,
      institutional_profile_url: value('institutionalProfile') || null,

      orcid: value('orcid').toUpperCase() || null,

      research_profile_url: isIndependent
        ? value('independentEvidence')
        : value('researchProfile') || null,

      independent_research_description: isIndependent
        ? value('independentResearchEvidence')
        : null,

      password,
      password_confirmation: confirmPassword,
      terms_accepted: acceptedTerms,
    };

    setIsSubmitting(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      20000,
    );

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'omit',
        signal: controller.signal,
      });

      const result = (await response.json().catch(() => ({}))) as
        | RegistrationResponse
        | ApiErrorResponse;

      if (!response.ok) {
        const apiError = result as ApiErrorResponse;

        if (response.status === 422 && apiError.errors) {
          setFieldErrors(apiError.errors);
          setError(
            'Please review the highlighted registration information and try again.',
          );
        } else if (response.status === 429) {
          setError(
            'Too many attempts have been made. Please wait before trying again.',
          );
        } else {
          setError(
            apiError.message ||
              'Registration could not be completed. Please try again.',
          );
        }

        return;
      }

      const success = result as RegistrationResponse;

      setRegisteredEmail(email);
      setVerificationEmailSent(
        success.data?.verification_email_sent ?? false,
      );

      setNotice(
        success.message ||
          'Your registration has been received.',
      );
    } catch (exception) {
      if (
        exception instanceof DOMException &&
        exception.name === 'AbortError'
      ) {
        setError(
          'The request took too long. Check your connection and try again.',
        );
      } else {
        setError(
          'Unable to connect to ResLink. Confirm that the Laravel API is running and try again.',
        );
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  }

  async function handleResendVerification() {
    if (!registeredEmail || isResending) return;

    setError('');
    setNotice('');
    setIsResending(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/email/verification-notification`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: registeredEmail }),
          credentials: 'omit',
        },
      );

      const result = (await response.json().catch(() => ({}))) as
        ApiErrorResponse;

      if (!response.ok) {
        if (response.status === 429) {
          setError(
            'Too many requests. Please wait before requesting another verification email.',
          );
        } else {
          setError(
            result.message ||
              'The request could not be completed. Please try again later.',
          );
        }

        return;
      }

      setNotice(
        'If your account exists and still needs verification, a new verification email will be sent. Check your inbox and spam folder.',
      );
    } catch {
      setError(
        'Unable to contact the server. Please check your connection and try again.',
      );
    } finally {
      setIsResending(false);
    }
  }

  return (
    <main className="registration-page">
      <header className="registration-header">
        <button
          className="registration-brand"
          onClick={onBack}
          type="button"
        >
          <span className="registration-brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="5" r="3" />
              <circle cx="5" cy="18" r="3" />
              <circle cx="19" cy="18" r="3" />
              <path d="m10.5 7.5-4 8m7-8 4 8M8 18h8" />
            </svg>
          </span>
          <span>
            Res<span className="registration-brand-accent">Link</span>
            <small>RESEARCH. CONNECT. ADVANCE.</small>
          </span>
        </button>

        <button
          className="registration-back"
          type="button"
          onClick={onBack}
        >
          ← Back to homepage
        </button>
      </header>

      <div className="registration-layout">
        <aside className="registration-aside">
          <span className="registration-kicker">
            A COMMUNITY BUILT FOR RESEARCH
          </span>

          <h1>
            Connect your
            <br />
            research to
            <br />
            <span>new possibilities.</span>
          </h1>

          <p>
            Create your researcher profile to discover expertise, build
            academic partnerships and explore meaningful research
            collaborations.
          </p>

          <div className="registration-benefits">
            <div>
              <span className="benefit-icon">✓</span>
              <span>
                <strong>Research-focused community</strong>
                <small>
                  Designed for legitimate academic and research activity.
                </small>
              </span>
            </div>

            <div>
              <span className="benefit-icon">✓</span>
              <span>
                <strong>Professional researcher profiles</strong>
                <small>
                  Showcase your expertise, affiliation and research interests.
                </small>
              </span>
            </div>

            <div>
              <span className="benefit-icon">✓</span>
              <span>
                <strong>Verification-oriented registration</strong>
                <small>
                  Email verification and a separate researcher review process.
                </small>
              </span>
            </div>
          </div>

          <div className="registration-aside-note">
            <span aria-hidden="true">◎</span>
            ResLink is for research, knowledge exchange and academic
            collaboration — not general-purpose social networking.
          </div>
        </aside>

        <section className="registration-card">
          <div className="registration-card-heading">
            <span className="registration-step">RESEARCHER ACCOUNT</span>
            <h2>Create your account</h2>
            <p>
              Provide accurate details so your research identity and
              affiliation can be assessed.
            </p>
            <div className="registration-required-note">
              Fields marked <span>*</span> are required.
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="registration-form-section">
              <h3><span>01</span> Personal information</h3>

              <div className="registration-form-grid">
                <label>
                  First name <span>*</span>
                  <input
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Your first name"
                    maxLength={100}
                    required
                  />
                  {getFieldError('first_name') && (
                    <small role="alert">{getFieldError('first_name')}</small>
                  )}
                </label>

                <label>
                  Surname <span>*</span>
                  <input
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Your surname"
                    maxLength={100}
                    required
                  />
                  {getFieldError('last_name') && (
                    <small role="alert">{getFieldError('last_name')}</small>
                  )}
                </label>

                <label>
                  Professional title
                  <select name="professionalTitle" defaultValue="">
                    <option value="">Select title (optional)</option>
                    <option>Dr</option>
                    <option>Professor</option>
                    <option>Mr</option>
                    <option>Ms</option>
                    <option>Mrs</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Country <span>*</span>
                  <input
                    name="country"
                    type="text"
                    autoComplete="country-name"
                    placeholder="Country of work or residence"
                    maxLength={100}
                    required
                  />
                  {getFieldError('country') && (
                    <small role="alert">{getFieldError('country')}</small>
                  )}
                </label>

                <label className="registration-full-width">
                  Contact email address <span>*</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    maxLength={255}
                    required
                  />
                  <small>
                    You must be able to access this address to verify your
                    account.
                  </small>
                  {getFieldError('email') && (
                    <small role="alert">{getFieldError('email')}</small>
                  )}
                </label>
              </div>
            </div>

            <div className="registration-form-section">
              <h3><span>02</span> Research identity</h3>

              <div className="registration-form-grid">
                <label className="registration-full-width">
                  Researcher category <span>*</span>
                  <select
                    name="researcherType"
                    value={researcherType}
                    onChange={(event) =>
                      setResearcherType(
                        event.target.value as ResearcherType | '',
                      )
                    }
                    required
                  >
                    <option value="">Select your current role</option>
                    <option>Lecturer or Professor</option>
                    <option>Postdoctoral Researcher</option>
                    <option>PhD Researcher</option>
                    <option>Master's Researcher</option>
                    <option>Research Scientist</option>
                    <option>Research Fellow</option>
                    <option>Research Assistant</option>
                    <option>Industry Researcher</option>
                    <option>Independent Researcher</option>
                    <option>Other Research Professional</option>
                  </select>
                  {getFieldError('researcher_category') && (
                    <small role="alert">
                      {getFieldError('researcher_category')}
                    </small>
                  )}
                </label>

                <label className="registration-full-width">
                  Primary research discipline <span>*</span>
                  <select name="researchDiscipline" defaultValue="" required>
                    <option value="">Select your main discipline</option>
                    <option>Computer Science and Information Technology</option>
                    <option>Engineering and Technology</option>
                    <option>Medicine and Health Sciences</option>
                    <option>Public Health</option>
                    <option>Natural and Physical Sciences</option>
                    <option>Agriculture and Veterinary Sciences</option>
                    <option>Education</option>
                    <option>Social Sciences</option>
                    <option>Business and Economics</option>
                    <option>Humanities and Arts</option>
                    <option>Environmental and Climate Sciences</option>
                    <option>Interdisciplinary Research</option>
                    <option>Other</option>
                  </select>
                  {getFieldError('research_discipline') && (
                    <small role="alert">
                      {getFieldError('research_discipline')}
                    </small>
                  )}
                </label>

                <label className="registration-full-width">
                  Research interests <span>*</span>
                  <textarea
                    name="researchInterests"
                    rows={3}
                    minLength={20}
                    maxLength={1000}
                    placeholder="Describe your research topics, expertise and the collaborations you are seeking."
                    required
                  />
                  <small>Enter between 20 and 1,000 characters.</small>
                  {getFieldError('research_interests') && (
                    <small role="alert">
                      {getFieldError('research_interests')}
                    </small>
                  )}
                </label>
              </div>
            </div>

            <div className="registration-form-section">
              <h3><span>03</span> Affiliation and verification</h3>

              <label>
                Affiliation type <span>*</span>
                <select
                  name="affiliationType"
                  value={affiliationType}
                  onChange={(event) => setAffiliationType(event.target.value)}
                  required
                >
                  <option value="institutional">
                    University or academic institution
                  </option>
                  <option value="research">
                    Research institute, laboratory or research centre
                  </option>
                  <option value="government">
                    Government or public-sector research organisation
                  </option>
                  <option value="industry">
                    Industry, hospital or private-sector research organisation
                  </option>
                  <option value="independent">
                    Independent researcher — no current institutional affiliation
                  </option>
                </select>
              </label>

              {!isIndependent ? (
                <div className="registration-form-grid registration-affiliation-fields">
                  <label className="registration-full-width">
                    Institution or organisation name <span>*</span>
                    <input
                      name="institution"
                      type="text"
                      placeholder="Official name of your institution"
                      maxLength={255}
                      required
                    />
                    {getFieldError('institution_name') && (
                      <small role="alert">
                        {getFieldError('institution_name')}
                      </small>
                    )}
                  </label>

                  <label>
                    Faculty, department or unit <span>*</span>
                    <input
                      name="department"
                      type="text"
                      placeholder="e.g. Computer Science"
                      maxLength={150}
                      required
                    />
                    {getFieldError('department') && (
                      <small role="alert">{getFieldError('department')}</small>
                    )}
                  </label>

                  <label>
                    Current position <span>*</span>
                    <input
                      name="position"
                      type="text"
                      placeholder="e.g. Lecturer, PhD candidate"
                      maxLength={150}
                      required
                    />
                    {getFieldError('professional_position') && (
                      <small role="alert">
                        {getFieldError('professional_position')}
                      </small>
                    )}
                  </label>

                  <label className="registration-full-width">
                    Institutional email address <span>*</span>
                    <input
                      name="institutionalEmail"
                      type="email"
                      placeholder="you@institution.edu"
                      maxLength={255}
                      required
                    />
                    <small>
                      A matching domain can assist verification but does not
                      independently prove affiliation.
                    </small>
                    {getFieldError('institutional_email') && (
                      <small role="alert">
                        {getFieldError('institutional_email')}
                      </small>
                    )}
                  </label>

                  <label className="registration-full-width">
                    Official institutional profile URL
                    <input
                      name="institutionalProfile"
                      type="url"
                      placeholder="https://institution.edu/staff/your-profile"
                      maxLength={2048}
                    />
                    {getFieldError('institutional_profile_url') && (
                      <small role="alert">
                        {getFieldError('institutional_profile_url')}
                      </small>
                    )}
                  </label>
                </div>
              ) : (
                <div className="registration-independent-note">
                  <strong>Independent researcher verification</strong>
                  <p>
                    You may register without a current institutional affiliation.
                    Your research activity must be supported by credible evidence
                    before your account can receive verified status.
                  </p>

                  <label>
                    Research profile or evidence URL <span>*</span>
                    <input
                      name="independentEvidence"
                      type="url"
                      placeholder="https://orcid.org/... or your research profile"
                      required
                    />
                    {getFieldError('research_profile_url') && (
                      <small role="alert">
                        {getFieldError('research_profile_url')}
                      </small>
                    )}
                  </label>

                  <label>
                    Briefly describe your research activity <span>*</span>
                    <textarea
                      name="independentResearchEvidence"
                      rows={3}
                      minLength={30}
                      maxLength={5000}
                      placeholder="Describe your research work, projects, publications or relevant experience."
                      required
                    />
                    <small>Enter between 30 and 5,000 characters.</small>
                    {getFieldError('independent_research_description') && (
                      <small role="alert">
                        {getFieldError('independent_research_description')}
                      </small>
                    )}
                  </label>
                </div>
              )}

              <div className="registration-form-grid registration-credentials">
                <label>
                  ORCID iD
                  <input
                    name="orcid"
                    type="text"
                    placeholder="0000-0000-0000-0000"
                    maxLength={19}
                    pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9Xx]"
                    title="Enter an ORCID iD in the format 0000-0000-0000-0000."
                  />
                  <small>
                    Optional. The server validates the identifier's checksum
                    and uniqueness.
                  </small>
                  {getFieldError('orcid') && (
                    <small role="alert">{getFieldError('orcid')}</small>
                  )}
                </label>

                <label>
                  Google Scholar or other research profile
                  <input
                    name="researchProfile"
                    type="url"
                    placeholder="https://..."
                    maxLength={2048}
                  />
                  {getFieldError('research_profile_url') && !isIndependent && (
                    <small role="alert">
                      {getFieldError('research_profile_url')}
                    </small>
                  )}
                </label>
              </div>
            </div>

            <div className="registration-form-section">
              <h3><span>04</span> Secure your account</h3>

              <div className="registration-form-grid">
                <label>
                  Create password <span>*</span>
                  <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 12 characters"
                    required
                  />
                  <small>
                    Use at least 12 characters, uppercase and lowercase letters,
                    a number and a symbol.
                  </small>
                  {getFieldError('password') && (
                    <small role="alert">{getFieldError('password')}</small>
                  )}
                </label>

                <label>
                  Confirm password <span>*</span>
                  <input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Enter password again"
                    required
                  />
                  {getFieldError('password') && (
                    <small role="alert">{getFieldError('password')}</small>
                  )}
                </label>
              </div>
            </div>

            <div className="registration-terms">
              <label className="registration-checkbox">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(event.target.checked)
                  }
                  required
                />
                <span>
                  I confirm that the information I provide is accurate and
                  that I will use ResLink for legitimate research, academic
                  collaboration and professional knowledge exchange. I agree
                  to follow ResLink's research-focused community standards
                  and applicable terms and privacy notice.
                  <span className="registration-required">*</span>
                </span>
              </label>
              <p>
                Your acceptance is recorded with the applicable document
                version. Email verification is separate from researcher
                credential verification.
              </p>
            </div>

            {error && (
              <div
                className="registration-message registration-error"
                role="alert"
                aria-live="assertive"
              >
                {error}

                {Object.keys(fieldErrors).length > 0 && (
                  <ul>
                    {Object.entries(fieldErrors).map(([field, messages]) =>
                      messages.map((message, index) => (
                        <li key={`${field}-${index}`}>{message}</li>
                      )),
                    )}
                  </ul>
                )}
              </div>
            )}

            {notice && (
              <div
                className="registration-message registration-notice"
                role="status"
                aria-live="polite"
              >
                {notice}
              </div>
            )}

            {registeredEmail && (
              <div className="registration-verification">
                <strong>Verify your email address</strong>
                <p>
                  Check the inbox for <strong>{registeredEmail}</strong>.
                  Follow the verification link before attempting to sign in.
                  Check your spam folder if the message is missing.
                </p>

                {!verificationEmailSent && (
                  <p>
                    The server could not confirm that the email was sent.
                    You can request another message below.
                  </p>
                )}

                <button
                  type="button"
                  className="registration-back"
                  onClick={handleResendVerification}
                  disabled={isResending}
                >
                  {isResending
                    ? 'Requesting email…'
                    : 'Resend verification email'}
                </button>
              </div>
            )}

            <button
              className="registration-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Submitting registration…'
                : 'Submit registration details'}
              <span aria-hidden="true">→</span>
            </button>

            <p className="registration-form-footer">
              Do not submit real personal information while testing locally.
              Before production, ResLink must be deployed over HTTPS and
              configured with a working email provider and published privacy
              and terms documents.
            </p>
          </form>
        </section>
      </div>

      <footer className="registration-footer">
        <span>© {new Date().getFullYear()} ResLink</span>
        <span>Built for research. Designed for collaboration.</span>
      </footer>
    </main>
  );
}
