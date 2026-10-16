# SyncPulse — Collaborative Task & Agile Project Tracker

A modern, high-velocity agile project management prototype engineered specifically for student project groups, hackathons, and software development teams.

---

## 🎯 Executive Summary for Tomorrow's Presentation

### 1. Problem Statement
- **Real-world Problem**: When student teams work on projects or hackathons, keeping track of who is doing what often gets messy. Heavy team software (like Jira or complex enterprise tools) takes too long to set up, leaving people confused about responsibilities and approaching deadlines.
- **Why it Matters**: A clean task organizer keeps team members aligned, prevents repeated or lost work, and makes it immediately obvious if someone needs help finishing a task on time.
- **Target Users**: Student project groups, hackathon squads, software development teams, and team leads.

### 2. Core Capabilities Built & Demonstrated
1. **Workspace & Team Roles**:
   - Set up project workspaces (e.g. *NeuroCampus Hackathon*, *CS490 Capstone*).
   - Invite teammates with instant toast notifications.
   - Enforce 3 distinct permission tiers: **Admin** (Lead/Full Control), **Member** (Dev/Designer), and **Viewer** (Mentor/Judge Read-Only).
   - Manage multiple sprint boards per workspace.

2. **Interactive Task Board (Kanban & List)**:
   - 4 Agile work stages: **Backlog**, **In Progress**, **Review**, and **Done**.
   - Fluid HTML5 Drag & Drop + one-click **Quick Move** buttons for touchpad reliability.
   - Confetti particle celebration when cards reach **Done**!
   - Multi-filter toolbar: search by keyword, filter by assignee avatar, filter by priority, filter by tag.

3. **Task Details & Subtask Checklist**:
   - Priority levels: **Urgent**, **High**, **Medium**, **Low**.
   - Subtasks checklist with dynamic progress bar (`3 of 4 completed (75%)`).
   - Assignee selection and due dates with calendar badges.
   - Tag/label management.

4. **Comments & Updates Thread**:
   - Real-time in-card discussion thread with user avatars, roles, and timestamps.
   - Complete audit activity history logging moves, checklist ticks, and reassignments.

5. **Progress Overview & Workload Health**:
   - Overall sprint completion gauge & live countdown clock to presentation deadline.
   - Stage distribution multi-segment bar chart.
   - **Member Workload Distribution**: tracks cards per teammate and automatically flags overloaded team members (`High Active Load / Needs Help`).

---

## 🚀 How to Run the Application

The app is currently running live on:
**[http://localhost:5173](http://localhost:5173)**

To start it manually anytime in the terminal:
```bash
cd "C:\Users\LENOVO\.gemini\antigravity\scratch\collab-tracker"
npm run dev
```

---

## 🎙️ 5-Step Live Presentation Demo Script

1. **Step 1: The Agile Kanban Board**
   - Click "Kanban Board" tab.
   - Drag or quick-move a card from *In Progress* to *Completed (Done)*.
   - Show how the column counts update and confetti triggers.

2. **Step 2: Granular Task Details & Subtasks**
   - Click any task card (e.g., *Gemini AI API Task Assistant*).
   - Show the subtask checklist: check an item and point out how the progress bar recalculates dynamically.
   - Post a quick comment to demonstrate in-card discussion.

3. **Step 3: Role-Based Access Control (RBAC)**
   - Use the **Role Simulation** dropdown in the top right to switch from **Alex (Admin)** to **Prof. Sarah Jenkins (Viewer)**.
   - Point out the yellow read-only warning banner: dragging and edits are disabled to protect data integrity.

4. **Step 4: Progress Overview & Team Workload Balancing**
   - Click the **Progress Overview & Workload** tab.
   - Highlight the **Member Workload Distribution** cards.
   - Explain how this solves the problem of student burnout and helps the team spot overloaded members before deadlines slip.

5. **Step 5: Workspaces & Multi-Board Management**
   - Click the **Workspace & Team Roles** tab.
   - Show the permission comparison matrix.
   - Click **Invite Teammate** or switch to the *CS490 Capstone* workspace using the top dropdown.
