# Branch protection (main)

To require CI to pass before merging into `main`:

1. Open the repo on GitHub → **Settings** → **Branches**.
2. Under **Branch protection rules**, add or edit a rule for branch name `main`.
3. Enable:
   - **Require a pull request before merging** (optional but recommended).
   - **Require status checks to pass before merging**.
   - In **Status checks that are required**, add: **Lint & Build** (from the Frontend CI workflow).
4. Save.

This ensures the frontend only merges when lint and build succeed.
