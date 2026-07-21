# External Interview Panelists — Functional Specification

**Module:** Recruitment (CRM) → Schedule Interview + Interview Round Detail + a new **token-gated External Panelist page**
**Screens:** Candidates › *Schedule Interview* (RSP) · Candidate › *Interview Details* › Round detail · **new** External Panelist view
**Status:** Draft for review — no development started
**Prepared from:** live crawl of CollabCRM staging (`bluewhaletechnosoftpvtltd`) — candidate `Ricky Mehta`, interview `4fec95b5-c8de-480d-be62-d63972c903d2`, round `a190fe55-b09b-467a-9416-ae64b9730962`

---

## 1. Objective

Today, an interview panel can only be **internal employees** picked from the *Interview Panel* dropdown. We want a recruiter to also invite **external panelists by email** while scheduling a round. Each external panelist:

1. receives an email (styled like the existing internal-panel invite) with the interview details,
2. opens a **branded, login-free page** secured by an access token,
3. sees everything they need to run the interview (candidate, CV, job, round, date-time **with timezone**, and either the online join link or the offline venue address),
4. can **confirm/adjust their availability** and **submit feedback** from that page,
5. triggers an **email notification back to the recruiter** on both actions.

On the internal side, the recruiter must be able to **see the external panel** inside the round detail and **cancel an invitation**.

---

## 2. Discovery — what the internal app does today

### 2.1 The Schedule Interview panel (right-side drawer)

Captured from the live drawer DOM (`div.pointer-events-auto w-[560px]`, react-select based). Fields in vertical order:

| # | Field (exact label) | Control | Notes |
|---|---|---|---|
| 1 | `Round Name` `*` | react-select (single) | e.g. *HR Round*, *Technical Round* |
| 2 | `Evaluation Criteria` `*` | react-select (multi) | list per job, e.g. *Code Quality*, *System Design* |
| 3 | `Interview Panel` `*` | react-select (multi), wrapper `div.select-employee` | **internal employees only today** |
| 4 | `Interview Mode` `*` | two toggle buttons `Offline` / `Online` | drives fields 5–6 |
| 5 | *(Online only)* meeting type | radios: `Telephonic` · `Meeting Link` · `Google Meet` · `Microsoft Teams` | integration-backed |
| 6 | `Interview Date` `*` + `Interview Time` `*` | react-datepicker + `input[type=time]` | |
| 7 | `Interview Duration (Minutes)` `*` | preset buttons `15 / 30 / 45 / 60 / Custom` | |
| 8 | info box + two checkboxes | `Send email to candidate` (`name=sendCandidateEmail`) · `Send email to panel` (`name=sendPanelEmail`) | copy: *"For future interviews, proceeding will send email notifications to the panel members and the candidate about the upcoming interview."* |
| 9 | `Additional Information` | textarea | optional |
| — | footer | `Cancel` / `Schedule` | |

Header shows two pills: candidate name (indigo border) and job title (amber/`warning` border).

> **Insertion point:** the external-panelist email input belongs **directly under field 3 (`Interview Panel`)**, so internal and external panel are configured together, and the existing *"Send email to panel"* checkbox naturally governs both.

### 2.2 The round-detail data model

From `GET /v1/candidate-int/my-to-do/detail/{interviewId}` (this is the same feed the internal *Interview Details* screen renders):

```
data.full_name, data.email, data.contact_number, data.country_code
data.job_title, data.job_description        // HTML
data.resume_attachment, data.resume_link, data.linkedin_profile
data.candidate_prev_experience (months), data.candidate_is_fresher
data.candidate_current_organization, data.candidate_notice_period_days
data.job_id, data.id                        // id = candidate-interview id

data.all_previous_interview[] = {
  id, interview_title (round name), interview_title_id,
  interview_mode: 'online' | 'offline',
  meeting_type: 'telephonic' | 'meeting_link' | 'google_meet' | 'microsoft_teams',
  meeting_link,                             // null until integration issues one
  interview_date ('YYYY-MM-DD'), interview_time ('HH:mm:ss'), interview_duration (min),
  evaluation_criteria[] { name, position, selected },
  interview_panel_ids[]  { full_name, id, business_unit_id, profile_picture, employee_code },
  panel_suggestion: 'pending' | ...,        // internal panel's verdict
  interview_status: 'pending' | ...,
  feedback_score (0–10), evaluation_feedback, remarks, overall_remarks,
  final_result, created_by_full_name, record_owner, round_count
}
```

Use these names as-is; anything new follows the same snake_case convention.

### 2.3 ⚠️ Gaps the feature must fill

The current model has **no** representation for any of these — they are net-new:

- **External panelists.** `interview_panel_ids[]` is strictly internal-employee objects (they carry `employee_code`). There is no email-based panelist entry.
- **Business-unit venue address.** For an offline round there is no address field anywhere in the feed — only `business_unit_id`. The BU's address has to be resolved and shown on the external page.
- **Timezone.** `interview_date` / `interview_time` are bare local strings with no offset. An external user has no timezone config, so the page must render an **explicit** timezone.
- **Availability.** There is no availability object; internal panel members are simply assumed available.

### 2.4 What the prototype has today

- Internal `CandidateDetailPage` → **Interview Details** tab renders static `MockRound[]` (`panel` is a `string[]` of names; fields `feedbackScore`, `panelSuggestion`, `status: Completed | Scheduled | Cancelled`).
- The **`Schedule Interview` button is a non-functional stub** (no drawer, no modal).
- There is **no** external-panelist page and **no** login-free/token route. The careers portal lives under `/portal/:slug/...` behind `PortalShell`; the CRM lives under `/crm/...`. Neither is token-gated.

---

## 3. Proposed data model (prototype)

New types (to add to `src/store/types.ts`):

```ts
/** Verdict shorthand — mirrors the internal panel_suggestion values. */
export type PanelSuggestion = 'Should Hire' | 'On Hold' | 'Reject';

export type ExternalInviteStatus =
  | 'Invited'                 // email sent, no response yet
  | 'Availability Confirmed'  // panelist said they can attend
  | 'Availability Declined'   // panelist can't attend / proposed another slot
  | 'Feedback Submitted'      // panelist completed the interview feedback
  | 'Cancelled';              // recruiter revoked the invitation (token dead)

export interface ExternalAvailability {
  status: 'available' | 'unavailable' | 'proposed_alternate';
  respondedAt: string;
  proposedDate?: string;      // only for proposed_alternate
  proposedTime?: string;
  note?: string;
}

export interface ExternalFeedback {
  submittedAt: string;
  score: number;              // 0–10, mirrors feedback_score
  suggestion: PanelSuggestion;// mirrors panel_suggestion
  remarks: string;
  criteria?: { name: string; rating: number }[]; // one per evaluation_criteria
}

export interface ExternalPanelist {
  id: string;
  email: string;              // the only mandatory identity the recruiter has
  name?: string;              // optional; may be blank until they respond
  invitedAt: string;
  invitedBy: string;
  status: ExternalInviteStatus;
  /** Opaque token embedded in the email button — the page's only auth. */
  accessToken: string;
  availability?: ExternalAvailability;
  feedback?: ExternalFeedback;
}
```

Extend the round model with `externalPanel?: ExternalPanelist[]` (and, for the token page to resolve venue, ensure the job/round can reach its BU address — see §5.3).

### 3.1 Status → what the external page allows

| `status` | Page state | Availability action | Feedback action | Download/Join |
|---|---|---|---|---|
| Invited | full page, prompts for availability | editable | editable (optional before the round) | visible |
| Availability Confirmed | confirmation banner shown | editable (can change) | editable | visible |
| Availability Declined | "you marked yourself unavailable", recruiter notified | editable | hidden | hidden |
| Feedback Submitted | read-only summary of what they submitted | locked | locked (shows submitted values) | visible |
| Cancelled | **access revoked** screen — "This invitation was cancelled." | — | — | — |

---

## 4. Surface A — Schedule Interview form: add external panelists

Directly beneath `Interview Panel`, add an **External Panelists** field:

- Label `External Panelists` (no `*` — optional). Helper: *"Invite people outside your organization by email. They'll get a secure link to view the interview and submit feedback — no login required."*
- An email input with **add-on-Enter / add-on-comma** chip behaviour (each valid email becomes a removable chip). Invalid emails are rejected inline.
- Optional name per chip is out of scope for v1 (email is enough; name is captured when they respond).
- The existing **`Send email to panel`** checkbox governs whether invitations actually go out (external + internal together). If unchecked, external panelists are saved but not emailed (recruiter can send later — see §6).

No other schedule fields change. On `Schedule`, each external email becomes an `ExternalPanelist { status: 'Invited', accessToken }`.

---

## 5. Surface B — External Panelist page (new, token-gated)

**Route (prototype):** `/panel/:token` — a **new top-level route, outside `PortalShell` and outside `/crm`**, with **no auth guard**. The token is the only credential. An unknown/expired/cancelled token renders the revoked/invalid state, never a login redirect (contrast the careers-portal catch-all bug from the offer task — this route must resolve tokens, not bounce to `/`).

### 5.1 Branding

Header carries **CollabCRM platform brand + the job's Business-Unit branding** (BU name, logo, brand colour). The careers portal already models per-portal branding (`PortalAppearance`: `portalName`, `brandColor`, `heroImageUrl`); the external page reuses the same tokens resolved from the round's business unit, so it looks like the hiring company, not a generic CollabCRM page.

### 5.2 Content (all read-only unless noted)

| Section | Fields | Source |
|---|---|---|
| Candidate | name, current organization, total experience, notice period | `full_name`, `candidate_current_organization`, `candidate_prev_experience`, `candidate_notice_period_days` |
| **CV / Resume** | "View CV" (opens `resume_attachment`) and/or "Resume link" + LinkedIn | `resume_attachment`, `resume_link`, `linkedin_profile` |
| Job | job title + (collapsible) description | `job_title`, `job_description` |
| Round | round name, evaluation criteria (the ones marked `selected`) | `interview_title`, `evaluation_criteria[].selected` |
| Date & time | date, start time, duration, **explicit timezone** | see §5.4 |
| Mode | Online → **Join** button; Offline → **venue address** | see §5.3 |

### 5.3 Online vs Offline

- **Online:** show a `Join` button using `meeting_link`, labelled by `meeting_type` (*Join Google Meet* / *Join Microsoft Teams* / *Meeting Link* / *Telephonic* — for telephonic show the number instead of a link). "Per existing integration" = we render whatever link the integration issued; we don't generate it.
- **Offline:** show the **Business Unit's address** (resolved from `business_unit_id`). Since the round feed has no address, the prototype seeds a BU→address map (see §8) and the real build resolves it server-side into the token payload.

### 5.4 Timezone (explicit requirement)

The external user has no timezone config, so the date-time must be **self-describing**. Display: `Tue, 14 Jul 2026 · 10:00 AM – 11:00 AM (IST, GMT+5:30)`, where the timezone is the **organization/BU timezone** the interview was scheduled in. Optionally add a muted second line "*= 4:30 AM in your local time*" computed from the browser — but the authoritative line always shows the org timezone label so there's no ambiguity.

### 5.5 Availability (write)

A small panel: **"Can you attend?"** → `Yes, I'll attend` / `No, I'm not available` (+ optional *propose another time* → date/time + note). Submitting sets `availability` and moves `status` to `Availability Confirmed` / `Availability Declined`, and **notifies the recruiter by email** (§7).

### 5.6 Feedback (write)

Mirrors the internal feedback shape so it slots straight into the round: **score (0–10)**, **suggestion** (`Should Hire` / `On Hold` / `Reject`), per-criteria rating (one row per selected `evaluation_criteria`), and free-text **remarks**. On submit → `feedback` populated, `status: 'Feedback Submitted'`, **recruiter notified** (§7), and the form locks to a read-only summary.

---

## 6. Surface C — Internal round detail: external panel + cancel

In `CandidateDetailPage` → *Interview Details* → each round, add an **External Panel** block alongside the existing internal panel list:

- Each external panelist row: email (and name once known), a **status chip** (`Invited` / `Availability Confirmed` / `Availability Declined` / `Feedback Submitted` / `Cancelled`), availability summary, and — if feedback submitted — the same score/suggestion/remarks the internal panel rows show.
- **Actions per row:** `Cancel invitation` (sets `Cancelled`, kills the token → external page shows the revoked screen) and `Resend invite` (re-emails the same token; needed when *Send email to panel* was left unchecked at scheduling).
- The `Schedule Interview` stub button should open the **new schedule drawer** (Surface A) so the flow is demonstrable end-to-end. *(Optional for v1 — can stay a static demo if we only want to showcase the external surfaces.)*

---

## 7. Email & notification flows

All "emails" in the prototype are **simulated** (a preview panel / toast + a state change), consistent with how the offer emails were handled. Real flows:

| Trigger | Recipient | Content |
|---|---|---|
| Schedule with external emails + *Send email to panel* ✔ | each external panelist | invite styled like the internal-panel email; primary button **"View Interview Details"** → `/panel/:token` |
| `Resend invite` | that panelist | same email, same token |
| Panelist confirms/declines availability | recruiter (`record_owner`) | *"{email} has {confirmed / declined} availability for {round} — {candidate}"* |
| Panelist submits feedback | recruiter | *"{email} submitted feedback for {round} — {candidate}"* |
| `Cancel invitation` | that panelist *(optional)* | *"Your interview invitation has been cancelled."* |

---

## 8. Access token & seed strategy (prototype)

- **Token** = opaque string stored on the `ExternalPanelist`. `/panel/:token` looks it up across all rounds; miss → invalid screen; `status: 'Cancelled'` → revoked screen.
- **BU address map:** seed a small `businessUnit → { name, brandColor, logo, address }` lookup so offline rounds and branding resolve without inventing per-render values. (Real build: server injects these into the token payload.)
- **Seed data:** one candidate/round carrying a mix of external panelists — one `Invited`, one `Availability Confirmed`, one `Feedback Submitted`, one `Cancelled` — plus one **online** round (Google Meet link) and one **offline** round (BU address) so every branch of §3.1 and §5.3 is demonstrable. Follow the `localStorage` merge discipline noted in project memory so seeds actually reach the browser.

---

## 9. Scope summary

**In scope**
- Schedule drawer gains an **External Panelists** email-chip field (Surface A).
- New **`/panel/:token`** branded, login-free page: view details, timezone-aware datetime, online/offline handling, **availability** + **feedback** submission (Surface B).
- Round detail shows **external panel** with status + **cancel / resend** actions (Surface C).
- Simulated invite + recruiter-notification flows.

**Out of scope (v1)**
- Real email delivery, real Google/MS Teams link generation, real token signing/expiry.
- Editing an external panelist's email after invite (cancel + re-add instead).
- Multi-round bulk invite; external panelist accounts/history.

---

## 10. Resolved decisions (settled from the ticket)

All prior open points are resolved directly by the ticket text — recorded here as the decisions the build follows, no further sign-off needed.

1. **Offline venue = the Business Unit address.** Ticket: *"If offline, the address of the BU should be made visible to them."* No custom per-interview location, so **Surface A needs no Location field** — the venue is derived from the job's Business Unit.
2. **Timezone = the interview's scheduled zone, shown with an explicit label** (e.g. `2:30 PM IST (GMT+5:30)`). Ticket: *"Date time should have timezone displayed as the external user won't have any timezone configs"* — the label is what the requirement asks for; the value rides on the interview, which is the BU/org zone. §5.4.
3. **External feedback is shown in its own external-panel block, not merged into the internal average.** Ticket asks only to *"see the external panel details in the interview round detail section"* — it stays a distinct, clearly-labelled section alongside internal panel feedback.
4. **Availability is confirm / decline (+ optional note), not a reschedule flow.** Ticket: *"update their availability"* and *"Recruiter should be notified via email upon the availability confirmation."* The recruiter is notified; any rescheduling remains a normal recruiter action, out of the panelist page.
5. **Cancel deactivates the token page and keeps any already-submitted feedback** (greyed, for the recruiter's record). Ticket lists *"Actions to cancel the invitation etc."* with no requirement to purge prior feedback.
6. **The `Schedule Interview` button is wired to a working drawer so the external-panelist field functions end-to-end** — adding an email seeds a real invite and mints its token page — matching the crawled RSP structure (§2.1). This is what makes Surfaces A→B→C demonstrable as one flow.

---

## Appendix — crawl evidence

- **Schedule drawer:** `div.pointer-events-auto w-[560px]`; react-select controls (`react-select__control`, `.select-employee` for Interview Panel); `label.label` + `span.text-error-500` asterisks; Offline/Online + duration are `h-10` toggle buttons; `input[type=time]`; react-datepicker; checkboxes `name=sendCandidateEmail`, `name=sendPanelEmail`; IcoMoon icons `icon-x-close`, `icon-clock`, `icon-info-circle`.
- **Round detail feed:** `GET /v1/candidate-int/my-to-do/detail/4fec95b5-c8de-480d-be62-d63972c903d2` → shape in §2.2. Sample round `a190fe55…`: `interview_mode: 'online'`, `meeting_type: 'telephonic'`, `interview_date: '2026-07-14'`, `interview_duration: 60`, two internal panel members (`Gurpreetsingh Dhillon` BL-001, `Lakshmi Narayan` BL-022), `evaluation_criteria` with *Security Implementation* selected.
- **Internal shell (reference for round-detail styling):** `bg-indigo-700 w-[220px]` sidebar, breadcrumb bar, candidate info panel `w-[300px] border-r` (icons `icon-copy-03`, `icon-phone`, `icon-linked-in`, `icon-arrow-up-right`), round detail pane `w-[calc(100%-288px)]`, STAGING badge `bg-[#FF0000]`.
